/* eslint-disable max-len */
module.exports = function getYouTubeResolution (message) {
  if (message.includes('invalid_grant')) {
    return 'This error means that either the authorization with this app expired or the app was removed from this Google Business profile by a managing user on Google. You\'ll need to reauthorize your Google Business profile channel before you can continue to publish.';
  }
  return 'An unknown error occurred. Try to publish your post again later. If the problem persists, please contact customer support.';
};
