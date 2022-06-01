const get = require('lodash/get');

const ValidationObj = require('./ValidationObj');
const validateUrl = require('./validateUrl');
const crossStreams = require('./crossStreams');

const LINKEDIN_MAX_CONTIGUOUS_SIZE = 200 * 1024 * 1024;

function validateLinkedinBody (body, media) {
  const maxCharacters = 3000;
  const validationObj = new ValidationObj();

  if ((!body && (!media || !media.length)) || typeof body !== 'string') validationObj.errors.push({ message: 'no content' });
  if (body.length > maxCharacters) validationObj.errors.push({ message: `only ${maxCharacters} characters allowed` });

  return validationObj;
}

function validateLinkedinLinkCaption (link_caption) {
  const maxCharacters = 256;
  const validationObj = new ValidationObj();

  if (link_caption) {
    if (link_caption.length > maxCharacters) validationObj.add_warning(`link caption will be truncated to meet ${maxCharacters} character limit`);
  }

  return validationObj;
}

function validateLinkedinLinkTitle (link_title) {
  const maxCharacters = 400;
  const maxRecommendedCharacters = 70;
  const validationObj = new ValidationObj();

  if (link_title) {
    if (link_title.length > maxCharacters) validationObj.add_warning(`link title will be truncated to meet ${maxCharacters} character limit`);
    if (link_title.length > maxRecommendedCharacters) validationObj.add_warning(`link title too long (${maxRecommendedCharacters} characters recomended)`);
  }

  return validationObj;
}

const LINKEDIN_IMAGE_EXTENSIONS = [
  '.gif',
  '.jpeg',
  '.jpg',
  '.png',
];

const LINKEDIN_VIDEO_EXTENSIONS = [
//   '.avi',
//   '.flv',
//   '.m4v',
//   '.mov',
  '.mp4',
//   '.mpeg',
//   '.mpg',
//   '.webm',
//   '.wmv',
];

const MAX_PIXELS = 36152320;

function countPixels (streamsObj) {
  return get(streamsObj, 'video.width', 0) * get(streamsObj, 'video.height', 0);
}

function validateLinkedinMetadata (metadata) {
  const validationObj = new ValidationObj();

  const { extension, size } = metadata;

  if (size > LINKEDIN_MAX_CONTIGUOUS_SIZE) validationObj.add_error("Linkedin's API does not currently accept files above 200MB.");

  const streamsObj = crossStreams(metadata);
  if (LINKEDIN_IMAGE_EXTENSIONS.includes(extension)) {
    if (countPixels(streamsObj) > MAX_PIXELS) {
      validationObj.add_error(`File size must not exceed ${MAX_PIXELS} pixels.`);
    }
  } else if (LINKEDIN_VIDEO_EXTENSIONS.includes(extension)) { // eslint-disable-line no-empty
  } else {
    validationObj.add_error('Only images and videos can be uploaded to LinkedIn through the API.');
  }

  return validationObj;
}

function validateLinkedinMedia (media, link_url) {
  const all = new ValidationObj();
  const response = {
    all,
  };

  const article_count = link_url ? 1 : 0;
  const img_count = media.filter(instance => LINKEDIN_IMAGE_EXTENSIONS.includes(instance.metadata.extension)).length;
  const video_count = media.filter(instance => LINKEDIN_VIDEO_EXTENSIONS.includes(instance.metadata.extension)).length;

  if (video_count > 1) all.add_error('Only 1 video can be attached to a LinkedIn post at this time.');

  if (img_count > 9) all.add_error('Only up to 9 images can be attached to a LinkedIn post at this time.');

  const media_type_count = [article_count, img_count, video_count].filter(count => count > 0).length;
  if (media_type_count > 1) all.add_error('Only 1 type of media (link, image, video) can be attached to a LinkedIn post at this time.');

  for (const instance of media) {
    response[instance.id] = validateLinkedinMetadata(instance.metadata);
  }
  return response;
}

function validate_linkedin (post, integration) {
  return {
    integration: integration.id,
    platform: integration.platform,
    body: validateLinkedinBody(post.body, post.media),
    media: validateLinkedinMedia(post.media, post.link_url),
    link: validateUrl(post.link_url),
    link_caption: validateLinkedinLinkCaption(post.link_caption),
    link_title: validateLinkedinLinkTitle(post.link_title),
  };
}

module.exports = {
  validate_linkedin,
  validateLinkedinBody,
  validateLinkedinMetadata,
  LINKEDIN_IMAGE_EXTENSIONS,
  LINKEDIN_VIDEO_EXTENSIONS,
  LINKEDIN_MAX_CONTIGUOUS_SIZE,
};
