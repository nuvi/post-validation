const isFunction = require('lodash/isFunction');
const isObject = require('lodash/isObject');
const { parseTweet } = require('twitter-text');

if (!isFunction(parseTweet)) throw new Error('Error importing from twitter-text: parseTweet is not a function!');

const ValidationObj = require('./ValidationObj');
const validateUrl = require('./validateUrl');
const validateLinkImage = require('./validateLinkImage');
const crossStreams = require('./crossStreams');

// TODO: check if they text they are wanting to send is the same as the text in their last tweet

function validateTwitterBody (body, replies, postContentType, hasMedia = false) {
  const parsedTweet = parseTweet(body);

  const validationObj = new ValidationObj();
  validationObj.validationObj = parsedTweet.weightedLength;

  if (!body || typeof body !== 'string' || !body.length) {
    if (!hasMedia) validationObj.add_error('Must have a body');
  }

  if (parsedTweet.permillage > 1000) validationObj.add_error('Message too long in primary Tweet', 1001, body.length);
  else if (!parsedTweet.valid && !hasMedia) validationObj.add_error('Invalid post body in primary Tweet');


  if (replies.length > 20) validationObj.add_warning('Having more than 20 replies Twitter may flag the account as spam');

  replies.forEach((msg, index) => {
    const parsedThread = parseTweet(msg);

    const tweetNumber = `reply #${index + 1}`;
    if (parsedThread.permillage > 1000) validationObj.add_error(`Message too long in ${tweetNumber}`, 1001, msg.length);
    else if (!parsedThread.valid) validationObj.add_error(`Invalid post body in ${tweetNumber}`);
  });

  const invalidChars = /\uFFFE|\uFEFF|\uFFFF/gm;
  let result;
  while ((result = invalidChars.exec([body, ...replies.map((reply) => reply.body).join(' ')]))) { // eslint-disable-line no-cond-assign
    validationObj.add_error('Invalid character', result.index, result.index + result.length);
  }

  if (postContentType === 'reel') validationObj.add_warning('Twitter does not support Reels. This post will be published as a normal tweet.');

  return validationObj;
}

const TWITTER_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];
const SUPPORTED_GIF_EXTENSIONS = ['.gif'];
const TWITTER_VIDEO_EXTENSIONS = ['.mp4'];

const TWITTER_MAX_IMAGE_DIMENSIONS = {
  width: 4096,
  height: 4096,
};

const LOWER_ASPECT_RATIO = 1 / 3;
const UPPER_ASPECT_RATIO = 3 / 1;
const RECOMMENDED_ASPECT_RATIOS = ['16:9', '9:16', '1:1'];

// https://developer.twitter.com/en/docs/media/upload-media/uploading-media/media-best-practices
function validateTwitterMetadata (metadata) {
  const validationObj = new ValidationObj();

  const { extension, size, duration } = metadata;
  const streamsObj = crossStreams(metadata);
  const {
    width, height, nb_frames, display_aspect_ratio, r_frame_rate, sample_aspect_ratio, pix_fmt, codec_name: display_codec_name, bit_rate: display_bit_rate,
  } = streamsObj.video || {};
  const {
    codec_name: audio_codec_name, profile, channel_layout, bit_rate: audio_bit_rate,
  } = streamsObj.audio || {};

  if (TWITTER_IMAGE_EXTENSIONS.includes(extension)) {
    // errors
    if (size > 5000000) validationObj.add_error('File size must not exceed 5 MB');
  } else if (SUPPORTED_GIF_EXTENSIONS.includes(extension)) {
    if (nb_frames > 1) {
      // errors
      if (size > 15000000) validationObj.add_error('File size must not exceed 15 MB');
      if (width > 1280 || height > 1080) validationObj.add_error('Resolution must be <= 1280x1080 (width x height)');
      if (nb_frames > 350) validationObj.add_error('Number of frames must be <= 350');
      if (width * height * nb_frames > 300000000) validationObj.add_error('Number of pixels (width * height * num_frames) must be <= 300 million');
    } else {
      validationObj.add_error('Cannot publish a static gif to Twitter');
    }
  } else if (TWITTER_VIDEO_EXTENSIONS.includes(extension)) {
    const fps = Number(r_frame_rate.split('/')[0]);
    const resolution = `${width}x${height}`;

    let aspectRatio;
    if (display_aspect_ratio) {
      const [aspectWidth, aspectHeight] = display_aspect_ratio.split(':').map(i => parseInt(i, 10));
      aspectRatio = aspectWidth / aspectHeight;
      if (!RECOMMENDED_ASPECT_RATIOS.includes(display_aspect_ratio)) validationObj.add_warning('Recommended Aspect Ratio: 16:9 (landscape or portrait), 1:1 (square)');
    }
    if (!aspectRatio) {
      aspectRatio = width / height;
    }
    if (aspectRatio < LOWER_ASPECT_RATIO || aspectRatio > UPPER_ASPECT_RATIO) validationObj.add_error('Aspect ratio must be between 1:3 and 3:1');

    if (sample_aspect_ratio) {
      if (sample_aspect_ratio !== '1:1') validationObj.add_error('Must have 1:1 pixel aspect ratio');
    }

    // errors
    if (size > 512000000) validationObj.add_error('File size must not exceed 512 MB');
    if (nb_frames / duration > 60) validationObj.add_error('Frame rate must be 60 FPS or less');
    if (width < 32 || height < 32) validationObj.add_error('Dimensions must be greater than 32x32');
    if (duration < 0.5 || duration > 140) validationObj.add_error('Duration must be between 0.5 seconds and 140 seconds');
    if (audio_codec_name && audio_codec_name !== 'acc' && profile !== 'LC') validationObj.add_error('Audio must be AAC with Low Complexity profile');
    if (channel_layout && channel_layout !== 'stereo' && channel_layout !== 'mono') validationObj.add_error('Audio must be mono or stereo');
    // TODO: Must not have open GOP
    // TODO: Must use progressive scan

    // warnings
    if (display_codec_name !== 'h264') validationObj.add_warning('Recommended Video Codec: H264 High Profile');
    if (fps !== 30 && fps !== 60) validationObj.add_warning('Recommended Frame Rates: 30 FPS, 60 FPS');
    if (width > 1280 || height > 1080) validationObj.add_warning('Dimensions must be lower than 1280x1024; the video will be downscaled automatically');
    if (!['1280x720', '720x1280', '720x720'].includes(resolution)) validationObj.add_warning('Recommended Video Resolution: 1280x720 (landscape), 720x1280 (portrait), 720x720 (square)');
    if (display_bit_rate < 5000) validationObj.add_warning('Recommended Minimum Video Bitrate: 5,000 kbps');
    if (audio_bit_rate < 128) validationObj.add_warning('Recommended Minimum Audio Bitrate: 128 kbps');
    if (pix_fmt !== 'yuv420p') validationObj.add_warning('Only YUV 4:2:0 pixel format is supported; the video will be adjusted accordingly');
  } else {
    validationObj.add_error('Unsupported file type');
  }

  return validationObj;
}

function validateTwitterMedia (media) {
  const all = new ValidationObj();
  const response = { all };
  if (media) {
    if (media.some(instance => !isObject(instance.metadata))) {
      all.add_error('Media metadata analysis unavailable. Please check back later.');
      return response;
    }

    const img_count = media.filter(instance => TWITTER_IMAGE_EXTENSIONS.includes(instance.metadata.extension)).length;
    const gif_count = media.filter(instance => SUPPORTED_GIF_EXTENSIONS.includes(instance.metadata.extension)).length;
    const video_count = media.filter(instance => TWITTER_VIDEO_EXTENSIONS.includes(instance.metadata.extension)).length;
    if (img_count > 4) all.add_error('Only 4 images can be attached to a tweet at this time.');
    if (gif_count > 1) all.add_error('Only 1 gif can be attached to a tweet at this time.');
    if (video_count > 1) all.add_error('Only 1 video can be attached to a tweet at this time.');
    const media_type_count = [img_count, gif_count, video_count].filter(count => count > 0).length;
    if (media_type_count > 1) all.add_error('Only 1 type of media (image, gif, video) can be attached to a tweet at this time.');

    for (const instance of media) {
      response[instance.id] = validateTwitterMetadata(instance.metadata);
    }
  }
  return response;
}

function validateTwitterImageDimensions (metadata) {
  const streamsObj = crossStreams(metadata);
  const { width, height } = streamsObj.video || {};
  if (width > TWITTER_MAX_IMAGE_DIMENSIONS.width || height > TWITTER_MAX_IMAGE_DIMENSIONS.height) {
    return false;
  }
  return true;
}

function validate_twitter (post, integration) {
  return {
    integration: integration.id,
    platform: integration.platform,
    body: validateTwitterBody(post.body, post.replies, post.post_content_type, Boolean(post.media && post.media.length)),
    link: validateUrl(post.link_url),
    media: validateTwitterMedia(post.media),
    link_image_url: validateLinkImage(post.link_image_url, post.is_link_preview_customized, post.platform),
  };
}

module.exports = {
  validate_twitter,
  validateTwitterBody,
  validateTwitterMetadata,
  validateTwitterImageDimensions,
  TWITTER_VIDEO_EXTENSIONS,
  TWITTER_IMAGE_EXTENSIONS,
  TWITTER_MAX_IMAGE_DIMENSIONS,
};
