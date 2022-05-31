const ValidationObj = require('./ValidationObj');
const crossStreams = require('./crossStreams');

const MAX_TITLE_LENGTH = 100;

const MAX_DESCRIPTION_LENGTH = 5000;

function validateYoutubeTitle (title) {
  const validationObj = new ValidationObj();

  if (!title || typeof title !== 'string' || title.length === 0) validationObj.add_error('Must have a title');
  else if (title.length > MAX_TITLE_LENGTH) validationObj.add_error('Title too long', 0, title.length);

  return validationObj;
}

function validateYoutubeBody (body) {
  const validationObj = new ValidationObj();

  if (!body || typeof body !== 'string') validationObj.add_error('Must have a body');
  if (body.length > MAX_DESCRIPTION_LENGTH) validationObj.add_error('Description too long', 0, body.length);

  return validationObj;
}

const SUPPORTED_VIDEO_EXTENSIONS = ['.mov', '.mpeg4', '.mp4', '.avi', '.wmv', '.mpegps', '.flv', '.3gpp', '.webm'];

const PREFERRED_RESOLUTIONS = ['3840x2160', '2560x1440', '1920x1080', '1280x720', '854x480', '640x360', '426x240'];

// https://support.google.com/youtube/answer/1722171?hl=en
function validateYoutubeMetadata (metadata) {
  const validationObj = new ValidationObj();

  const { extension, size, duration } = metadata;
  const streamsObj = crossStreams(metadata);
  const { width, height, display_aspect_ratio } = streamsObj.video || {};
  const { codec_name: audio_codec_name, profile } = streamsObj.audio || {};

  if (SUPPORTED_VIDEO_EXTENSIONS.includes(extension)) {
    if (size > 128000000000) validationObj.add_error('Video size must not exceed 128 GB');
    if (duration > 15 * 60 * 60) validationObj.add_error('Duration must be less than 12 hours');
    if (width < 426) validationObj.add_error('Minimum width is 426px');
    if (height < 240) validationObj.add_error('Minimum height is 240px');
    if (width > 3840) validationObj.add_error('Maximum width is 3840px');
    if (height > 2160) validationObj.add_error('Maximum width is 2160px');

    if (audio_codec_name !== 'acc' && profile !== 'LC') validationObj.add_warning('Audio codec AAC-LC preferred');
    if (!PREFERRED_RESOLUTIONS.includes(`${width}x${height}`)) validationObj.add_warning(`Recommended resolutions: ${PREFERRED_RESOLUTIONS}`);
    if (display_aspect_ratio !== '16:9') validationObj.add_warning('Recommended aspect ratio: 16:9');
  } else {
    validationObj.add_error(`Invalid file type: ${extension}`);
  }

  return validationObj;
}

function validateYoutubeMedia (media) {
  const all = new ValidationObj();
  const video_count = media.filter(instance => SUPPORTED_VIDEO_EXTENSIONS.includes(instance.metadata.extension)).length;
  if (video_count > 1) all.add_error('Only 1 video can be uploaded to youtube at a time.');
  const response = {
    all,
  };
  for (const instance of media) {
    response[instance.id] = validateYoutubeMetadata(instance.metadata);
  }
  return response;
}

function validate_youtube (post, integration) {
  return {
    integration: integration.id,
    platform: integration.platform,
    title: validateYoutubeTitle(post.title),
    body: validateYoutubeBody(post.body),
    media: validateYoutubeMedia(post.media),
  };
}

module.exports = {
  validate_youtube,
  validateYoutubeBody,
  validateYoutubeMetadata,
};
