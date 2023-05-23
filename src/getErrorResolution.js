const getTwitterResolution = require('./errorResolution/getTwitterResolution');
const getFacebookResolution = require('./errorResolution/getFacebookResolution');
const getInstagramResolution = require('./errorResolution/getInstagramResolution');
const getLinkedInResolution = require('./errorResolution/getLinkedInResolution');
const getYouTubeResolution = require('./errorResolution/getYouTubeResolution');
const getTikTokResolution = require('./errorResolution/getTikTokResolution');

const GENERIC_RESOLUTION = 'An unknown error occurred. Try to publish your post again later. If the problem persists, please contact customer support.';

module.exports = function getErrorResolution (platform, message) {
  switch (platform) {
    case 'twitter': return getTwitterResolution(message);
    case 'facebook': return getFacebookResolution(message);
    case 'instagram': return getInstagramResolution(message);
    case 'linkedin': return getLinkedInResolution(message);
    case 'youtube': return getYouTubeResolution(message);
    case 'tiktok': return getTikTokResolution(message);
    default: return GENERIC_RESOLUTION;
  }
};
