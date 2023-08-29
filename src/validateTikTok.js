const isObject = require('lodash/isObject');

const ValidationObj = require('./ValidationObj');
const crossStreams = require('./crossStreams');

const TIKTOK_VIDEO_EXTENSIONS = ['.mpeg4', '.mp4', '.webm'];

const TIKTOK_VIDEO_CODECS = ['h264', 'h265', 'vp8', 'vp9'];

// https://developers.tiktok.com/doc/web-video-kit-with-web
function validateTikTokBody (body) {
  const maxCharacters = 150;
  const validationObj = new ValidationObj();

  if (body.length > maxCharacters) {
    validationObj.add_error(`Message is too long. Maximum length is ${maxCharacters} characters.`);
  }
  return validationObj;
}

function validateTikTokMetadata (metadata, tikTokCreatorLimits) {
  const validationObj = new ValidationObj();

  const { extension, size, duration } = metadata;
  const streamsObj = crossStreams(metadata);
  const {
    width, height, nb_frames, codec_name,
  } = streamsObj.video || {};

  if (TIKTOK_VIDEO_EXTENSIONS.includes(extension)) {
    if (size > 4000000000) validationObj.add_error('Video size must not exceed 4 GB');
    if (duration > tikTokCreatorLimits.max_video_post_duration_sec) validationObj.add_error('Video duration must be 60 seconds or less');
    if (duration < 3) validationObj.add_error('Video duration must be at least 3 seconds');
    if (nb_frames / duration > 60 || nb_frames / duration < 23) validationObj.add_error('Video framerate must be between 23 and 60.');
    if (!TIKTOK_VIDEO_CODECS.includes(codec_name)) validationObj.add_error('Video codec must be either H.264 or HEVC.');
    if (width < 360) validationObj.add_error('Minimum width for video is 360px');
    if (height < 360) validationObj.add_error('Minimum height for video is 360px');
    if (width > 4096) validationObj.add_error('Maximum width for video is 4096px');
    if (height > 4096) validationObj.add_error('Maximum height for video is 4096px');
  } else {
    validationObj.add_error(`Invalid file type: ${extension}`);
  }

  return validationObj;
}

function validateTikTokMedia (media, tikTokCreatorLimits = { max_video_post_duration_sec: 600 }) {
  const all = new ValidationObj();
  const response = { all };
  if (media) {
    if (media.some(instance => !isObject(instance.metadata))) {
      all.add_error('Media metadata analysis unavailable. Please check back later.');
      return response;
    }

    const video_count = media.filter(instance => TIKTOK_VIDEO_EXTENSIONS.includes(instance.metadata.extension)).length;
    if (!video_count) all.add_error(`Must include one video in one of the following formats: ${TIKTOK_VIDEO_EXTENSIONS.join(', ')}.`);
    if (video_count > 1) all.add_error('Only 1 video can be uploaded to TikTok at a time.');

    for (const instance of media) {
      response[instance.id] = validateTikTokMetadata(instance.metadata, tikTokCreatorLimits);
    }
  }
  return response;
}

function validateTikTokSettings (post, tikTokCreatorLimits) {
  const validationObj = new ValidationObj();
  if (!tikTokCreatorLimits) {
    validationObj.add_warning('TikTok Creator Limits are unavailable and may vary for each account. We are unable to guarantee successful publication.');
    return validationObj;
  }
  if (!post.privacy) {
    validationObj.add_error('A privacy setting must be selected.');
  } else if (!tikTokCreatorLimits.privacy_level_options.includes(post.privacy)) {
    validationObj.add_error(`The privacy setting ${post.privacy} is not allowed for the account "${tikTokCreatorLimits.creator_nickname}".`);
  }
  return validationObj;
}

function validate_tiktok (post, integration, tikTokCreatorLimits) {
  const validation = {
    integration: integration.id,
    platform: integration.platform,
    body: validateTikTokBody(post.body),
    media: validateTikTokMedia(post.media, tikTokCreatorLimits),
    tiktok_settings: validateTikTokSettings(post, tikTokCreatorLimits),
  };
  return validation;
}

module.exports = {
  validate_tiktok,
  validateTikTokMetadata,
  TIKTOK_VIDEO_EXTENSIONS,
};
