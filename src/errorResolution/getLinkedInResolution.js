/* eslint-disable max-len */
module.exports = function getLinkedInResolution (message) {
  if (message.includes('The token used in the request has expired')) {
    return 'Your LinkedIn access token has expired. You\'ll need to reauthorize your LinkedIn account before you can continue to publish.';
  }
  if (message.includes('Client network socket disconnected')) {
    return 'There was a network connection issue while attempting to publish your video. Please try again and contact customer support if the issue continues.';
  }

  return 'An unknown error occurred. Try to publish your post again later. If the problem persists, please contact customer support.';
};
