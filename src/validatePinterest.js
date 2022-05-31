const ValidationObj = require('./ValidationObj');
const crossStreams = require('./crossStreams');
const urlRegex = require('./urlRegex');
const validateUrl = require('./validateUrl');
const validateLinkImage = require('./validateLinkImage');
const MAX_NOTE_LENGTH = 500;

function validatePinterestBody (body) {
  const validationObj = new ValidationObj();

  if (body.length > MAX_NOTE_LENGTH) validationObj.add_error('Note too long', MAX_NOTE_LENGTH, body.length);

  if (body.match(urlRegex)) validationObj.add_error('pinterest post bodies cannot contain urls');

  return validationObj;
}

const SUPPORTED_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif'];

// https://business.pinterest.com/en/Pinterest-product-specs
function validatePinterestMetadata (metadata) {
  const validationObj = new ValidationObj();

  const { extension, size } = metadata;
  const streamsObj = crossStreams(metadata);
  const { display_aspect_ratio } = streamsObj.video || {};

  if (SUPPORTED_IMAGE_EXTENSIONS.includes(extension)) {
    if (size > 32000000) validationObj.add_error('Image size must not exceed 32 MB');

    if (display_aspect_ratio !== '2:3') validationObj.add_warning('Recommended image aspect ratio: 2:3 (portrait)');
  } else {
    validationObj.add_error(`Invalid file type: ${extension}`);
  }

  return validationObj;
}

function validatePinterestMedia (media) {
  const all = new ValidationObj();
  if (media.length < 1) {
    all.add_error('Pinterest requires that an image be attached to each pin.');
  }
  if (media.length > 1) {
    all.add_error('Only 1 image can be attached to a pin.');
  }
  const response = {
    all,
  };
  for (const instance of media) {
    response[instance.id] = validatePinterestMetadata(instance.metadata);
  }
  return response;
}

function validatePinterestLink (url) {
  const validationObj = validateUrl(url);
  if (url && !validationObj.errors.length) {
    if (/pinterest\.com/.test(url)) {
      validationObj.add_error('May not link to pinterest.com');
    }
  }
  return validationObj;
}

function validate_pinterest (post, integration) {
  return {
    integration: integration.id,
    platform: integration.platform,
    // title: validatePinterestTitle(post.title),
    body: validatePinterestBody(post.body),
    link: validatePinterestLink(post.link_url),
    media: validatePinterestMedia(post.media),
    link_image_url: validateLinkImage(post.link_image_url, post.is_link_preview_customized, post.platform),
  };
}

module.exports = {
  validate_pinterest,
  validatePinterestBody,
  validatePinterestMetadata,
};
