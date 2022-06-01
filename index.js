const validate_post = require('./src/schema/validate_post');
const {
  FACEBOOK_IMAGE_EXTENSIONS,
  FACEBOOK_VIDEO_EXTENSIONS,
  validate_facebook,
  validateFacebookBody,
  validateFacebookMetadata,
} = require('./src/validateFacebook');
const {
  GMB_CALLS_TO_ACTION_REQUIRING_URL,
} = require('./src/validateGoogleMyBusiness');
const {
  INSTAGRAM_VIDEO_EXTENSIONS,
} = require('./src/validateInstagram');
const {
  validateLinkedinBody,
  validateLinkedinMetadata,
  LINKEDIN_IMAGE_EXTENSIONS,
  LINKEDIN_VIDEO_EXTENSIONS,
  LINKEDIN_MAX_CONTIGUOUS_SIZE,
} = require('./src/validateLinkedin');

module.exports = {
  validate_post,
  FACEBOOK_IMAGE_EXTENSIONS,
  FACEBOOK_VIDEO_EXTENSIONS,
  validate_facebook,
  validateFacebookBody,
  validateFacebookMetadata,
  GMB_CALLS_TO_ACTION_REQUIRING_URL,
  INSTAGRAM_VIDEO_EXTENSIONS,
  validateLinkedinBody,
  validateLinkedinMetadata,
  LINKEDIN_IMAGE_EXTENSIONS,
  LINKEDIN_VIDEO_EXTENSIONS,
  LINKEDIN_MAX_CONTIGUOUS_SIZE,
};
