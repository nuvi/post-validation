/* eslint-disable max-len */
module.exports = function getTwitterResolution (message) {
  if (message.includes('Your account is suspended and is not permitted to access this feature')) {
    return `Twitter suspends accounts for a variety of reasons. One common reason is publishing too many tweets to quickly or publishing the exact same tweet multiple times to one account or many accounts.
      First, log in to Twitter and view your account information to see if there are any warnings or verifications you are required to complete. If there are no notices to resolve, try publishing tweets with a few minutes in between each one. If you need to share the same message to multiple accounts, try adding some custom variables into the message to ensure it is not identical to other tweets being sent at the same time.`;
  }
  if (message.includes('Could not authenticate you')) {
    return 'This error message from Twitter is very generic. It can mean that you need to reauthorize your account or simply that you need to try again later. As a first step, try to publish your post a few minutes later. If that doesn\'t work, try to reauthenticate your Twitter account. If the problem continues, please contact customer support.';
  }
  if (message.includes('To protect our users from spam and other malicious activity, this account is temporarily locked')) {
    return 'Twitter has locked your account. This typically means that the account published too many tweets to quickly or too many tweets with the same content. Regardless of the reason, you\'ll need to log in to twitter.com and follow the verification prompts to unlock your account before you can publish again.';
  }

  return 'An unknown error occurred. Try to publish your tweet again later. If the problem persists, please contact customer support.';
};
