const getTwitterResolution = require('./errorResolution/getTwitterResolution');
const getFacebookResolution = require('./errorResolution/getFacebookResolution');
const getInstagramResolution = require('./errorResolution/getInstagramResolution');
const getLinkedInResolution = require('./errorResolution/getLinkedInResolution');
const getGoogleResolution = require('./errorResolution/getGoogleResolution');
const getYouTubeResolution = require('./errorResolution/getYouTubeResolution');
const getTikTokResolution = require('./errorResolution/getTikTokResolution');

const GENERIC_RESOLUTION = 'An unknown error occurred. Try to publish your post again later. If the problem persists, please contact customer support.';

const EXPIRED_INTEGRATION = 'The token used to publish this post is expired.';
const CAN_NOT_PUBLISH = "This token for this post has been marked as one that can't be published to.";

module.exports = function getErrorResolution (platform, message) {
  if (!message) {
    return GENERIC_RESOLUTION;
  }

  if (message === EXPIRED_INTEGRATION) {
    return 'Please reauthorize the social account in order to continue publishing to this social account.';
  }

  if (message === CAN_NOT_PUBLISH) {
    return 'The social account has been marked as an account that can not be published to. Please speak to the individual that authorized the account and have them update the credential to allow publishing.'; // eslint-disable-line max-len
  }

  switch (platform) {
    case 'twitter': return getTwitterResolution(message);
    case 'facebook': return getFacebookResolution(message);
    case 'instagram': return getInstagramResolution(message);
    case 'linkedin': return getLinkedInResolution(message);
    case 'youtube': return getYouTubeResolution(message);
    case 'google_my_business': return getGoogleResolution(message);
    case 'tiktok': return getTikTokResolution(message);
    default: return GENERIC_RESOLUTION;
  }
};
