const get = require('lodash/get');
const isObject = require('lodash/isObject');

const ValidationObj = require('./ValidationObj');
const validateUrl = require('./validateUrl');
const validateLinkImage = require('./validateLinkImage');
const crossStreams = require('./crossStreams');

function validateFacebookBody (body, hasMedia = false) {
  const maxCharacters = 63206;
  const validationObj = new ValidationObj();

  if (!hasMedia && (!body || typeof body !== 'string' || !body.length)) validationObj.add_error('Must have a body');
  if (body.length > maxCharacters) validationObj.add_error('too long');

  return validationObj;
}

const FACEBOOK_IMAGE_EXTENSIONS = [
  '.jpeg',
  '.jpg',
  '.png',
  '.bmp',
  '.tif',
  '.tiff',
  '.gif',
];

const FACEBOOK_VIDEO_EXTENSIONS = [
  '.3g2',
  '.3gp',
  '.3gpp',
  '.asf',
  '.avi',
  '.dat',
  '.divx',
  '.dv',
  '.f4v',
  '.flv',
  '.m2ts',
  '.m4v',
  '.mkv',
  '.mod',
  '.mov',
  '.mp4',
  '.mpe',
  '.mpeg',
  '.mpeg4',
  '.mpg',
  '.mts',
  '.nsv',
  '.ogm',
  '.ogv',
  '.qt',
  '.tod',
  '.ts',
  '.vob',
  '.wmv'
];

const FACEBOOK_MAX_IMAGE_SIZE = 4194304;

const FACEBOOK_MAX_IMAGE_DIMENSIONS = {
  width: 2048,
  height: 2048,
};

const FACEBOOK_MAX_VIDEO_DIMENSIONS = {
  width: 1920,
  height: 1080,
};

// video (future use): https://developers.facebook.com/docs/graph-api/video-uploads
// video (in use): https://developers.facebook.com/docs/graph-api/reference/page/videos
// image: https://developers.facebook.com/docs/graph-api/photo-uploads
function validateFacebookMetadata (metadata) {
  const validationObj = new ValidationObj();

  const { extension, size, duration } = metadata;
  const streamsObj = crossStreams(metadata);

  if (FACEBOOK_IMAGE_EXTENSIONS.includes(extension)) {
    if (extension === '.gif') validationObj.add_warning('GIFs can be uploaded but will not animate on facebook.');
    if (size >= FACEBOOK_MAX_IMAGE_SIZE) {
      validationObj.add_warning("Images larger than 4 MB will be resized to meet Facebook's image size requirements.");
    } else if (extension === '.png' && size > 1 * 1024 * 1024) {
      validationObj.add_warning('PNG files should be less than 1MB when published to Facebook. PNG files larger than 1 MB may appear pixelated after upload.');
    }
  } else if (FACEBOOK_VIDEO_EXTENSIONS.includes(extension)) {
    const lowerAspectRatio = 9 / 16;
    const upperAspectRatio = 16 / 9;
    const aspectRatioArr = get(streamsObj, 'video.display_aspect_ratio', '').split(':');
    const aspectRatio = aspectRatioArr[0] / aspectRatioArr[1];

    if (size < 1024) validationObj.add_error('File size must exceed 1 KB');
    if (duration < 1) validationObj.add_error('Duration must be longer than 1 second');
    if (get(streamsObj, 'video.height', 0) > FACEBOOK_MAX_VIDEO_DIMENSIONS.height) {
      validationObj.add_warning("Videos with a resolution greater then 1080p will be resized to meet Facebook's video requirements.");
    }
    if (size > 1000000000) validationObj.add_error('File size must not exceed 1 GB');
    if (duration > 20 * 60) validationObj.add_error('Duration must be equal to or less than 20 minutes');
    if (aspectRatio < lowerAspectRatio || aspectRatio > upperAspectRatio) validationObj.add_error('Aspect ratio must be between 9:16 and 16:9');
  } else {
    validationObj.add_error('Unsupported file type');
  }

  return validationObj;
}

function validateFacebookMedia (media) {
  const all = new ValidationObj();
  const response = { all };
  if (media) {
    if (media.some(instance => !isObject(instance.metadata))) {
      all.add_error('Media metadata analysis unavailable. Please check back later.');
      return response;
    }

    const img_count = media.filter(instance => FACEBOOK_IMAGE_EXTENSIONS.includes(instance.metadata.extension)).length;
    const video_count = media.filter(instance => FACEBOOK_VIDEO_EXTENSIONS.includes(instance.metadata.extension)).length;
    // if(img_count > 4) all.add_error('Only 4 images can be attached to a facebook post at this time.');
    if (video_count > 1) all.add_error('Only 1 video can be attached to a facebook post at this time.');
    const media_type_count = [img_count, video_count].filter(count => count > 0).length;
    if (media_type_count > 1) all.add_error('Only 1 type of media (image, video) can be attached to a facebook post at this time.');
    for (const instance of media) {
      response[instance.id] = validateFacebookMetadata(instance.metadata);
    }
  }
  return response;
}

function validate_facebook (post, integration) {
  return {
    integration: integration.id,
    platform: integration.platform,
    body: validateFacebookBody(post.body, Boolean(post.media && post.media.length)),
    media: validateFacebookMedia(post.media),
    link: validateUrl(post.link_url),
    link_image_url: validateLinkImage(post.link_image_url, post.is_link_preview_customized, post.platform),
  };
}

module.exports = {
  FACEBOOK_IMAGE_EXTENSIONS,
  FACEBOOK_VIDEO_EXTENSIONS,
  FACEBOOK_MAX_IMAGE_SIZE,
  FACEBOOK_MAX_IMAGE_DIMENSIONS,
  FACEBOOK_MAX_VIDEO_DIMENSIONS,
  validate_facebook,
  validateFacebookBody,
  validateFacebookMetadata,
};
