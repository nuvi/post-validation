/* eslint-disable max-len */
module.exports = function getYouTubeResolution (message) {
  if (message.includes('invalid_grant')) {
    return 'This error means that either the authorization with this app expired or the app was removed from this Google Business profile by a managing user on Google. You\'ll need to reauthorize your Google Business profile channel before you can continue to publish.';
  }
  if (message.includes('post is being processed')) {
    return 'This error means the Google Business Profile is flagged, not verified, or the post needs to be approved by Google. The approval process can take up to 3 weeks per post, You will need to publish through Google Business Profile manager.';
  }
  if (message.includes('post was rejected')) {
    return 'This error means the post was rejected by Google My Business. Please check Google Business Profile\'s content policy.';
  }
  return 'An unknown error occurred. Try to publish your post again later. If the problem persists, please contact customer support.';
};
