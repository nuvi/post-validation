const {
  ASSISTANT, FACEBOOK, TWITTER, LINKEDIN, PINTEREST, YOUTUBE, INSTAGRAM, GOOGLE_MY_BUSINESS, TIKTOK,
} = require('./enums');

const ValidationObj = require('./ValidationObj');

const { validate_facebook } = require('./validateFacebook');
const { validate_linkedin } = require('./validateLinkedin');
const { validate_pinterest } = require('./validatePinterest');
const { validate_twitter } = require('./validateTwitter');
const { validate_youtube } = require('./validateYoutube');
const { validate_instagram } = require('./validateInstagram');
const { validate_google_my_business } = require('./validateGoogleMyBusiness');
const validate_assistant = require('./validateAssistant');
const { validate_tiktok } = require('./validateTikTok');
const publishingKnex = require('../../connections/publishingKnex');

module.exports = async function validate_all (post) {
  let integration = null;
  if (post.platformId === 'campaign-placeholder') integration = { platform: post.platform };
  else [integration] = await publishingKnex('Integrations').where({ companyGuid: post.companyGuid, platform: post.platform, platformId: post.platformId || '' });
  if (!integration) {
    const response = {
      platformId: post.platformId,
      platform: post.platform,
      body: new ValidationObj(),
    };
    response.body.add_error('Integration associated with this post was removed!');
    return response;
  }
  if (!post.publishAt) {
    const response = {
      platormId: post.platformId,
      platform: post.platform,
      body: new ValidationObj(),
    };
    response.body.add_error('One or more locations are missing a valid timezone.');
    return response;
  }

  if (integration.platform === FACEBOOK) return validate_facebook(post, integration);
  if (integration.platform === LINKEDIN) return validate_linkedin(post, integration);
  if (integration.platform === PINTEREST) return validate_pinterest(post, integration);
  if (integration.platform === TWITTER) return validate_twitter(post, integration);
  if (integration.platform === YOUTUBE) return validate_youtube(post, integration);
  if (integration.platform === INSTAGRAM) return validate_instagram(post, integration);
  if (integration.platform === GOOGLE_MY_BUSINESS) return validate_google_my_business(post, integration);
  if (integration.platform === ASSISTANT) return validate_assistant(post, integration);
  if (integration.platform === TIKTOK) return validate_tiktok(post, integration);

  throw new Error('No implemented integration selected!');
};
