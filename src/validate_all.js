const {
  ASSISTANT, FACEBOOK, TWITTER, LINKEDIN, PINTEREST, YOUTUBE, INSTAGRAM, GOOGLE_MY_BUSINESS, TIKTOK,
} = require('./enums');

const { validate_facebook } = require('./validateFacebook');
const { validate_linkedin } = require('./validateLinkedin');
const { validate_pinterest } = require('./validatePinterest');
const { validate_twitter } = require('./validateTwitter');
const { validate_youtube } = require('./validateYoutube');
const { validate_instagram } = require('./validateInstagram');
const { validate_google_my_business } = require('./validateGoogleMyBusiness');
const validate_assistant = require('./validateAssistant');
const { validate_tiktok } = require('./validateTikTok');

module.exports = function validate_all (post, integration, tikTokCreatorLimits) {
  if (integration.platform === FACEBOOK) return validate_facebook(post, integration);
  if (integration.platform === LINKEDIN) return validate_linkedin(post, integration);
  if (integration.platform === PINTEREST) return validate_pinterest(post, integration);
  if (integration.platform === TWITTER) return validate_twitter(post, integration);
  if (integration.platform === YOUTUBE) return validate_youtube(post, integration);
  if (integration.platform === INSTAGRAM) return validate_instagram(post, integration);
  if (integration.platform === GOOGLE_MY_BUSINESS) return validate_google_my_business(post, integration);
  if (integration.platform === ASSISTANT) return validate_assistant(post, integration);
  if (integration.platform === TIKTOK) return validate_tiktok(post, integration, tikTokCreatorLimits);

  throw new Error('No implemented integration selected!');
};
