const ValidationObj = require('./ValidationObj');
const crossStreams = require('./crossStreams');
const get = require('lodash/get');

const SUPPORTED_VIDEO_EXTENSIONS = ['.mpeg4', '.mp4', '.webm'];

// https://developers.tiktok.com/doc/web-video-kit-with-web
function validateTikTokBody (body) {
  const validationObj = new ValidationObj();
  if (body && body.length && typeof body === 'string') {
    validationObj.add_warning('TikTok does not accept posts with a body. Only attached video will be used.');
  }
  return validationObj;
}

function validateTikTokMetadata (metadata) {
  const validationObj = new ValidationObj();

  const { extension, size, duration } = metadata;
  const streamsObj = crossStreams(metadata);
  const { width, height } = streamsObj.video || {};

  if (SUPPORTED_VIDEO_EXTENSIONS.includes(extension)) {
    if (size > 50000000) validationObj.add_error('Video size must not exceed 50 MB');
    if (duration > 60) validationObj.add_error('Video duration must be 60 seconds or less');
    if (duration < 3) validationObj.add_error('Video duration must be at least 3 seconds');
    if (width < 960) validationObj.add_error('Minimum width for video is 960px');
    if (height < 540) validationObj.add_error('Minimum height for video is 540px');
  } else {
    validationObj.add_error(`Invalid file type: ${extension}`);
  }

  return validationObj;
}

function validateTikTokMedia (media) {
  const all = new ValidationObj();
  const video_count = media.filter(instance => SUPPORTED_VIDEO_EXTENSIONS.includes(instance.metadata.extension)).length;
  if (!video_count) all.add_error(`Must include one video in one of the following formats: ${SUPPORTED_VIDEO_EXTENSIONS.join(', ')}.`);
  if (video_count > 1) all.add_error('Only 1 video can be uploaded to TikTok at a time.');
  const response = {
    all,
  };
  for (const instance of media) {
    response[instance.id] = validateTikTokMetadata(instance.metadata);
  }
  return response;
}

function createPublishExecutionWarning () {
  const validationObj = new ValidationObj();
  validationObj.add_warning(`
    This video will be uploaded at the specified time and a notification will be sent to the TikTok mobile app. 
    Publishing must be completed via that in-app notification.
  `);
  return validationObj;
}

function validate_tiktok (post, integration) {
  const validation = {
    integration: integration.id,
    platform: integration.platform,
    body: validateTikTokBody(post.body),
    media: validateTikTokMedia(post.media),
  };
  if (!get(validation, 'body.errors.length') && !get(validation, 'media.errors.length')) {
    validation.note = createPublishExecutionWarning();
  }
  return validation;
}

module.exports = {
  validate_tiktok,
  validateTikTokMetadata,
};
