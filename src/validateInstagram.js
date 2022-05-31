const ValidationObj = require('./ValidationObj');
const crossStreams = require('./crossStreams');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const { threadRegex } = require('../../utils/regex');

const SUPPORTED_IMAGE_EXTENSIONS = [
  '.jpeg',
  '.jpg',
  '.png',
];

const INSTAGRAM_VIDEO_EXTENSIONS = [
  '.mp4',
];

const SUPPORTED_VIDEO_CODECS = [
  'h264',
  'hevc',
];

const SUPPORTED_AUDIO_CODECS = [
  'aac'
];

const MAX_VIDEO_SIZE = 100000000;

const MAX_AUDIO_SAMPLE_RATE = 48000;
const MAX_AUDIO_CHANNELS = 2;

const MAX_IMAGE_SIZE = 8000000;
const MAX_CHARACTERS = 1600;

const MAX_COMMENTS = 6;

function validateInstagramBody (body) {
  const validationObj = new ValidationObj();
  const bodies = body.split(threadRegex);

  if (bodies.length - 1 > MAX_COMMENTS) validationObj.add_error(`Post must not contain more than ${MAX_COMMENTS} comments.`);
  bodies.forEach((msg, index) => {
    const commentNumber = index !== 0 ? `Comment #${index}` : 'Caption';
    if (msg.length > MAX_CHARACTERS) validationObj.add_error(`${commentNumber} must be no more than ${MAX_CHARACTERS} characters.`);
  });
  return validationObj;
}

function validateInstagramMetadata (metadata) {
  const validationObj = new ValidationObj();

  const { extension, size, duration } = metadata;
  const streamsObj = crossStreams(metadata);
  const {
    width, height, nb_frames, codec_name,
  } = streamsObj.video || {};
  const audio = streamsObj.audio || {};
  let aspectRatio = width / height;
  if (SUPPORTED_IMAGE_EXTENSIONS.includes(extension)) {
    if (aspectRatio < 0.8 || aspectRatio > 1.91) {
      validationObj.add_error('Image must have an aspect ratio between 0.8 and 1.91.');
    }
    if (size > MAX_IMAGE_SIZE) validationObj.add_error('Image file size must not exceed 8 MB.');
  } else if (INSTAGRAM_VIDEO_EXTENSIONS.includes(extension)) {
    const rotation = get(streamsObj, 'video.rotation');
    if (rotation && (`${rotation}` === '-90' || `${rotation}` === '90')) aspectRatio = height / width;
    if (!SUPPORTED_VIDEO_CODECS.includes(codec_name)) validationObj.add_error('Video codec must be either H.264 or HEVC.');
    if (!isEmpty(audio)) {
      if (!SUPPORTED_AUDIO_CODECS.includes(get(audio, 'codec_name'))) validationObj.add_error('Audio codec must be AAC.');
      if (get(audio, 'sample_rate') > MAX_AUDIO_SAMPLE_RATE) validationObj.add_error('Audio sample rate must be less than or equal to 48khz.');
      if (get(audio, 'channels') > MAX_AUDIO_CHANNELS) validationObj.add_error('Audio must have either 1 or 2 channels.');
    }
    if (nb_frames / duration > 60 || nb_frames / duration < 23) validationObj.add_error('Video framerate must be between 23 and 60.');
    if (aspectRatio < 4 / 5 || aspectRatio > 16 / 9) validationObj.add_error('Video must have an aspect ratio between 4:5 and 16:9.');
    if (width > 1920) validationObj.add_warning('Video width should be less than 1920 pixels.');
    if (duration < 3) validationObj.add_error('Video must be a minimum duration of 3 seconds.');
    if (duration > 60) validationObj.add_error('Videa must be a maximum duration of 60 seconds.');
    if (size > MAX_VIDEO_SIZE) validationObj.add_error('Video file size must not exceed 100MB.');
  } else {
    validationObj.add_error(`Unsupported file type. Must be one of ${SUPPORTED_IMAGE_EXTENSIONS.join(', ')}`);
  }

  if (width < 320) {
    validationObj.add_error('Image width must be at least 320px');
  }

  return validationObj;
}

function validateInstagramMedia (media) {
  const all = new ValidationObj();

  if (!media || media.length === 0) all.add_error('Must include at least 1 image/video to automatically post to Instagram.');
  if (media.length > 10) all.add_error('Maximum of 10 images/videos to automatically post to Instagram');

  const response = {
    all,
  };

  if (media && media.length) {
    for (const instance of media) {
      response[instance.id] = validateInstagramMetadata(instance.metadata);
    }
  }

  return response;
}

function validate_instagram (post, integration) {
  return {
    integration: integration.id,
    platform: integration.platform,
    body: validateInstagramBody(post.body),
    media: validateInstagramMedia(post.media),
  };
}

module.exports = {
  validate_instagram,
  INSTAGRAM_VIDEO_EXTENSIONS,
};
