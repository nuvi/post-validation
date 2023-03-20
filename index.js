const validate_post = require('./src/schema/validate_post');
const validate_all = require('./src/validate_all');
const {
  FACEBOOK_IMAGE_EXTENSIONS,
  FACEBOOK_VIDEO_EXTENSIONS,
  FACEBOOK_MAX_IMAGE_SIZE,
  FACEBOOK_MAX_IMAGE_DIMENSIONS,
  FACEBOOK_MAX_VIDEO_DIMENSIONS,
  validate_facebook,
  validateFacebookBody,
  validateFacebookMetadata,
} = require('./src/validateFacebook');
const {
  GMB_CALLS_TO_ACTION,
  GMB_CALLS_TO_ACTION_REQUIRING_URL,
  GMB_IMAGE_EXTENSIONS,
  validate_google_my_business,
} = require('./src/validateGoogleMyBusiness');
const {
  validate_instagram,
  INSTAGRAM_IMAGE_EXTENSIONS,
  INSTAGRAM_VIDEO_EXTENSIONS,
  INSTAGRAM_VIDEO_CODECS,
  INSTAGRAM_AUDIO_CODECS,
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
  validate_tiktok,
  validateTikTokMetadata,
  TIKTOK_VIDEO_EXTENSIONS,
} = require('./src/validateTikTok');
const {
  validateTwitterBody,
  validateTwitterMetadata,
  validateTwitterImageDimensions,
  TWITTER_IMAGE_EXTENSIONS,
  TWITTER_VIDEO_EXTENSIONS,
  TWITTER_MAX_IMAGE_DIMENSIONS,
} = require('./src/validateTwitter');
const {
  validate_youtube,
  validateYoutubeBody,
  validateYoutubeMetadata,
  YOUTUBE_VIDEO_EXTENSIONS,
  YOUTUBE_PREFERRED_RESOLUTIONS,
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
  FACEBOOK_MAX_IMAGE_SIZE,
  FACEBOOK_MAX_IMAGE_DIMENSIONS,
  FACEBOOK_MAX_VIDEO_DIMENSIONS,
  validate_facebook,
  validateFacebookBody,
  validateFacebookMetadata,
  GMB_CALLS_TO_ACTION,
  GMB_CALLS_TO_ACTION_REQUIRING_URL,
  GMB_IMAGE_EXTENSIONS,
  validate_google_my_business,
  validate_instagram,
  INSTAGRAM_IMAGE_EXTENSIONS,
  INSTAGRAM_VIDEO_EXTENSIONS,
  INSTAGRAM_VIDEO_CODECS,
  INSTAGRAM_AUDIO_CODECS,
  validateLinkedinBody,
  validateLinkedinMetadata,
  LINKEDIN_IMAGE_EXTENSIONS,
  LINKEDIN_VIDEO_EXTENSIONS,
  LINKEDIN_MAX_CONTIGUOUS_SIZE,
  validatePinterestBody,
  validatePinterestMetadata,
  validate_tiktok,
  validateTikTokMetadata,
  TIKTOK_VIDEO_EXTENSIONS,
  validateTwitterBody,
  validateTwitterMetadata,
  validateTwitterImageDimensions,
  TWITTER_IMAGE_EXTENSIONS,
  TWITTER_VIDEO_EXTENSIONS,
  TWITTER_MAX_IMAGE_DIMENSIONS,
  validate_youtube,
  validateYoutubeBody,
  validateYoutubeMetadata,
  YOUTUBE_VIDEO_EXTENSIONS,
  YOUTUBE_PREFERRED_RESOLUTIONS,
  threadRegex,
  ValidationObj,
};
