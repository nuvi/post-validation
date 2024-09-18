const isObject = require('lodash/isObject');
const isEmpty = require('lodash/isEmpty');
const get = require('lodash/get');

const ValidationObj = require('./ValidationObj');
const crossStreams = require('./crossStreams');

const THREADS_IMAGE_EXTENSIONS = [
  '.jpeg',
  '.jpg',
  '.png',
];

const THREADS_VIDEO_EXTENSIONS = [
  '.mp4',
  '.mov'
];

const THREADS_VIDEO_CODECS = [
  'h264',
  'hevc',
];

const THREADS_AUDIO_CODECS = [
  'aac',
];

const MAX_CHARACTERS = 500;
const MAX_IMAGE_SIZE = 8000000;
const MIN_IMAGE_WIDTH = 320;
const MAX_IMAGE_WIDTH = 1440;
const MAX_AUDIO_SAMPLE_RATE = 48000;
const MAX_AUDIO_CHANNELS = 2;
const MIN_VIDEO_DURATION = 1;
const MAX_VIDEO_DURATION = 300; // 5 Minutes
const MAX_VIDEO_SIZE = 1000000000; // 1GB

const HASHTAG_REGEX = /#[\w]+/gi;

function validateThreadsBody (body, hasMedia, replies = []) {
  const validationObj = new ValidationObj();
  if (!body.length && !hasMedia) validationObj.add_error('Threads must contain either media or text.');
  if (body.length > MAX_CHARACTERS) validationObj.add_error(`Threads must not contain more than ${MAX_CHARACTERS} characters`);
  if (get(body.match(HASHTAG_REGEX), 'length', 0) > 1) validationObj.add_warning('Threads will only use the first tag. All other tags will be displayed as text.');
  replies.forEach((reply, index) => {
    if (reply.body.length) {
      const replyNumber = `reply #${index + 1}`;
      if (reply.body.length > MAX_CHARACTERS) validationObj.add_error(`Threads must not contain more than ${MAX_CHARACTERS} characters in ${replyNumber}`);
      if (get(reply.body.match(HASHTAG_REGEX), 'length', 0) > 1) validationObj.add_warning(`Threads ${replyNumber} will only use the first tag. All other tags will be displayed as text.`);
    }
  });

  return validationObj;
}

function validateThreadsMetadata (metadata) {
  const validationObj = new ValidationObj();

  const { extension, size, duration } = metadata;
  const streamsObj = crossStreams(metadata);
  const {
    width, height, codec_name, nb_frames,
  } = streamsObj.video || {};
  const audio = streamsObj.audio || {};
  let aspectRatio = width / height;
  if (THREADS_IMAGE_EXTENSIONS.includes(extension)) {
    if (size > MAX_IMAGE_SIZE) validationObj.add_error('Image file size must not exceed 8MB.');
    if (width < MIN_IMAGE_WIDTH) validationObj.add_warning(`Image width should be a minimum of ${MIN_IMAGE_WIDTH}.`);
    if (width > MAX_IMAGE_WIDTH) validationObj.add_warning(`Image width should be a maximum of ${MAX_IMAGE_WIDTH}.`);
    if (aspectRatio > 10) validationObj.add_error('Image must have an aspect ratio of 10:1 or less');
  } else if (THREADS_VIDEO_EXTENSIONS) {
    if (!isEmpty(audio)) {
      if (!THREADS_AUDIO_CODECS.includes(get(audio, 'codec_name'))) validationObj.add_error('Audio codec must be AAC.');
      if (get(audio, 'sample_rate') > MAX_AUDIO_SAMPLE_RATE) validationObj.add_error('Audio sample rate must be less than or equal to 48khz.');
      if (get(audio, 'channels') > MAX_AUDIO_CHANNELS) validationObj.add_error('Audio must have either 1 or 2 channels.');
    }
    if (aspectRatio !== 9 / 16) validationObj.add_warning('An aspect ratio of 9:16 is recommended to avoid cropping or blank space');
    if (aspectRatio < 0.01 || aspectRatio > 10) validationObj.add_error('Video must have an aspect ratio between 0.01 and 10');
    if (!THREADS_VIDEO_CODECS.includes(codec_name)) validationObj.add_error('Video codec must be either H.264 or HEVC.');
    if (nb_frames / duration > 60 || nb_frames / duration < 23) validationObj.add_error('Video framerate must be between 23 and 60.');
    if (width > 1920) validationObj.add_warning('Video width should be less than 1920 pixels.');
    if (duration > MAX_VIDEO_DURATION) validationObj.add_error('Video duration must not exceed 5 minutes');
    if (duration < MIN_VIDEO_DURATION) validationObj.add_error('Video must be a minimum duration of 1 seconds');
    if (size > MAX_VIDEO_SIZE) validationObj.add_error('Video file size must not exceed 1GB.');
  } else {
    validationObj.add_error(`Unsupported file type. Must be one of: ${THREADS_IMAGE_EXTENSIONS.join(', ')}, ${THREADS_VIDEO_EXTENSIONS.join(', ')}`);
  }

  return validationObj;
}

function validateThreadsMedia (media) {
  const all = new ValidationObj();
  if (media.length > 10) all.add_error('Maximum of 10 images/videos to automatically post to Threads');
  const response = { all };

  if (media && media.length) {
    if (media.some(instance => !isObject(instance.metadata))) {
      all.add_error('Media metadata analysis unavailable. Please check back later.');
      return response;
    }

    for (const instance of media) {
      response[instance.id] = validateThreadsMetadata(instance.metadata);
    }
  }
  return response;
}

function validate_threads (post, integration) {
  const hasMedia = !!post.media.length;
  return {
    integration: integration.id,
    platform: integration.platform,
    body: validateThreadsBody(post.body, post.replies, hasMedia),
    media: validateThreadsMedia(post.media),
  };
}

module.exports = {
  validate_threads,
  THREADS_VIDEO_EXTENSIONS,
  THREADS_IMAGE_EXTENSIONS,
};
