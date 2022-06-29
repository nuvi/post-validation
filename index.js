const validate_post = require('./src/schema/validate_post');
const validate_all = require('./src/validate_all');
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
const {
  validatePinterestBody,
  validatePinterestMetadata,
} = require('./src/validatePinterest');
const {
  validateTikTokMetadata,
} = require('./src/validateTikTok');
const {
  validateTwitterBody,
  validateTwitterMetadata,
  validateTwitterImageDimensions,
  TWITTER_IMAGE_EXTENSIONS,
  TWITTER_VIDEO_EXTENSIONS,
} = require('./src/validateTwitter');
const {
  validateYoutubeBody,
  validateYoutubeMetadata,
} = require('./src/validateYoutube');
const {
  threadRegex,
} = require('./src/regex');
const ValidationObj = require('./src/ValidationObj');

module.exports = {
  validate_post,
  validate_all,
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
  validatePinterestBody,
  validatePinterestMetadata,
  validateTikTokMetadata,
  validateTwitterBody,
  validateTwitterMetadata,
  validateTwitterImageDimensions,
  TWITTER_IMAGE_EXTENSIONS,
  TWITTER_VIDEO_EXTENSIONS,
  validateYoutubeBody,
  validateYoutubeMetadata,
  threadRegex,
  ValidationObj,
};
