const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const isObject = require('lodash/isObject');

const ValidationObj = require('./ValidationObj');
const crossStreams = require('./crossStreams');

const INSTAGRAM_IMAGE_EXTENSIONS = [
  '.jpeg',
  '.jpg',
  '.png',
];

const INSTAGRAM_VIDEO_EXTENSIONS = [
  '.mp4',
];

const INSTAGRAM_VIDEO_CODECS = [
  'h264',
  'hevc',
];

const INSTAGRAM_AUDIO_CODECS = [
  'aac'
];

const MAX_VIDEO_SIZE = 100000000;

const MAX_AUDIO_SAMPLE_RATE = 48000;
const MAX_AUDIO_CHANNELS = 2;

const MAX_IMAGE_SIZE = 8000000;
const MAX_CHARACTERS = 1600;

const MAX_COMMENTS = 6;
const MAX_HASHTAGS = 30;

function validateInstagramBody (body, replies = []) {
  const validationObj = new ValidationObj();

  const hashtags = [body, ...replies.map(reply => reply.body)].join(' ').match(/#(\w+)/g);
  if (hashtags && hashtags.length > MAX_HASHTAGS) {
    validationObj.add_error(`Post must not contain more than ${MAX_HASHTAGS} hashtags.`);
  }

  if (replies.length > MAX_COMMENTS) validationObj.add_error(`Post must not contain more than ${MAX_COMMENTS} comments.`);
  if (body.length > MAX_CHARACTERS) validationObj.add_error(`Caption must be no more than ${MAX_CHARACTERS} characters.`);

  replies.forEach((reply, index) => {
    const commentNumber = `Comment #${index + 1}`;
    if (reply.body.length > MAX_CHARACTERS) validationObj.add_error(`${commentNumber} must be no more than ${MAX_CHARACTERS} characters.`);
  });
  return validationObj;
}

function validateInstagramMetadata (metadata, postContentType) {
  const validationObj = new ValidationObj();

  const { extension, size, duration } = metadata;
  const streamsObj = crossStreams(metadata);
  const {
    width, height, nb_frames, codec_name,
  } = streamsObj.video || {};
  const audio = streamsObj.audio || {};
  let aspectRatio = width / height;
  if (INSTAGRAM_IMAGE_EXTENSIONS.includes(extension)) {
    if (postContentType === 'reel') {
      validationObj.add_error('Images are not supported by reels.');
    } else if (postContentType === 'story') {
      if (aspectRatio !== 9 / 16) validationObj.add_warning('An aspect ratio of 9:16 is recommended to reach the largest audience.');
    } else if (aspectRatio < 0.8 || aspectRatio > 1.91) {
      validationObj.add_error('Image must have an aspect ratio between 0.8 and 1.91.');
    }
    if (size > MAX_IMAGE_SIZE) validationObj.add_error('Image file size must not exceed 8 MB.');
  } else if (INSTAGRAM_VIDEO_EXTENSIONS.includes(extension)) {
    const rotation = get(streamsObj, 'video.rotation');
    if (rotation && (`${rotation}` === '-90' || `${rotation}` === '90')) aspectRatio = height / width;
    if (!INSTAGRAM_VIDEO_CODECS.includes(codec_name)) validationObj.add_error('Video codec must be either H.264 or HEVC.');
    if (!isEmpty(audio)) {
      if (!INSTAGRAM_AUDIO_CODECS.includes(get(audio, 'codec_name'))) validationObj.add_error('Audio codec must be AAC.');
      if (get(audio, 'sample_rate') > MAX_AUDIO_SAMPLE_RATE) validationObj.add_error('Audio sample rate must be less than or equal to 48khz.');
      if (get(audio, 'channels') > MAX_AUDIO_CHANNELS) validationObj.add_error('Audio must have either 1 or 2 channels.');
    }
    if (nb_frames / duration > 60 || nb_frames / duration < 23) validationObj.add_error('Video framerate must be between 23 and 60.');
    if (postContentType !== 'reel' && (aspectRatio < 4 / 5 || aspectRatio > 16 / 9)) validationObj.add_error('Video must have an aspect ratio between 4:5 and 16:9.');
    if (width > 1920) validationObj.add_warning('Video width should be less than 1920 pixels.');
    if (duration < 3) validationObj.add_error('Video must be a minimum duration of 3 seconds.');
    if (postContentType !== 'reel' && duration > 60) validationObj.add_error('Video duration must not exceed 60 seconds.');

    if (postContentType === 'reel') {
      if (aspectRatio < 0.01 / 1 || aspectRatio > 10 / 1) validationObj.add_error('Video must have an aspect ratio between 0.01:1 and 10:1.');
      if (aspectRatio !== 9 / 16) validationObj.add_warning('An aspect ratio of 9:16 is recommended to reach the largest audience.');
      if (duration > 60 * 15) validationObj.add_error('Video duration must not exceed 15 minutes for Reels content.');
      if (duration > 90) validationObj.add_warning('A video duration less than 90 seconds is recommended to reach the largest audience.');
      if (duration < 5) validationObj.add_warning('A video duration greater than 5 seconds is recommended to reach the largest audience.');
    } else if (postContentType === 'story') {
      if (aspectRatio < 0.1 / 1 || aspectRatio > 10 / 1) validationObj.add_error('Video must have an aspect ratio between 0.1:1 and 10:1.');
      if (aspectRatio !== 9 / 16) validationObj.add_warning('An aspect ratio of 9:16 is recommended to reach the largest audience.');
      if (duration > 60) validationObj.add_error('Video duration must not exceed 60 seconds for Stories content.');
      if (duration < 3) validationObj.add_error('Video duration must exceed 3 seconds for Stories content');
    }

    if (size > MAX_VIDEO_SIZE) validationObj.add_error('Video file size must not exceed 100MB.');
  } else {
    validationObj.add_error(`Unsupported file type. Must be one of: ${INSTAGRAM_IMAGE_EXTENSIONS.join(', ')}, ${INSTAGRAM_VIDEO_EXTENSIONS.join(', ')}`);
  }

  if (width < 320) {
    validationObj.add_error('Image width must be at least 320px');
  }

  return validationObj;
}

function validateInstagramMedia (media, postContentType) {
  const all = new ValidationObj();

  if (!media || media.length === 0) all.add_error('Must include at least 1 image/video to automatically post to Instagram.');
  if (postContentType === 'reel' && media.length > 1) all.add_error('Maximum of 1 video to post as an Instagram Reel');
  if (media.length > 10) all.add_error('Maximum of 10 images/videos to automatically post to Instagram');

  const response = { all };

  if (media && media.length) {
    if (media.some(instance => !isObject(instance.metadata))) {
      all.add_error('Media metadata analysis unavailable. Please check back later.');
      return response;
    }

    for (const instance of media) {
      response[instance.id] = validateInstagramMetadata(instance.metadata, postContentType);
    }
  }

  return response;
}

function validate_instagram (post, integration) {
  return {
    integration: integration.id,
    platform: integration.platform,
    body: validateInstagramBody(post.body, post.replies),
    media: validateInstagramMedia(post.media, post.post_content_type),
  };
}

module.exports = {
  validate_instagram,
  INSTAGRAM_IMAGE_EXTENSIONS,
  INSTAGRAM_VIDEO_EXTENSIONS,
  INSTAGRAM_VIDEO_CODECS,
  INSTAGRAM_AUDIO_CODECS,
};
