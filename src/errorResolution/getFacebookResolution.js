/* eslint-disable max-len */
module.exports = function getFacebookResolution (message) {
  if (message.includes('A security check is required to proceed')) {
    return `According to Facebook this Page is "Temporarily blocked for policies violations" and "A security check is required to proceed." Please log in to Facebook and view the Page configuration to ensure that all security checks are complete before attempting to publish to it again.
    This error is not always consistent and can occur when a Page's behavior is suspicious according to Facebook's private algorithms. If you are unable to find any verification notices when logging in to Facebook, try to create fewer posts and ensure they are all unique to help reduce the algorithm's likelihood to flag your Page for a violation.`;
  }
  if (message.includes('You\'re restricted from acting as your Page until you complete Page Publishing Authorization')) {
    return 'The personal Facebook account of the User who authorized the Reputation app must log in to Facebook and complete the authorization of their personal account in the Settings - Account Settings - Identity Confirmation area.';
  }
  if (message.includes('Sessions for the user are not allowed because the user is not a confirmed user')) {
    return 'The Facebook User needs to log in to Facebook and perform the required verification in order to be allowed to publish content.';
  }
  if (message.includes('The user must be an administrator, editor, or moderator of the page')) {
    return `The Facebook User who authorized this Page has changed in some way that caused their authorization to publish to be revoked by Facebook. Common reasons for this include the user changing their password or an administrator making changes to permissions in Business Manager. To resolve this issue, have an administrator log in to Facebook Business Manager and verify that each User has the appropriate access to create content for your Pages. Then have the Users reauthorize Reputation.
    It is also possible that some permissions were not accepted during the authorization process or that some permissions were revoked by a User. To resolve this situation, have each User completely revoke access to Reputation through their Facebook Settings. Then have them reauthorize their account.`;
  }
  if (message.includes('The session has been invalidated because the user changed their password or Facebook has changed the session for security reasons')) {
    return `The Facebook User who authorized this Page has changed in some way that caused their authorization to publish to be revoked by Facebook. Common reasons for this include the user changing their password or an administrator making changes to permissions in Business Manager. To resolve this issue, have an administrator log in to Facebook Business Manager and verify that each User has the appropriate access to create content for your Pages. Then have the Users reauthorize Reputation.
    It is also possible that some permissions were not accepted during the authorization process or that some permissions were revoked by a User. To resolve this situation, have each User completely revoke access to Reputation through their Facebook Settings. Then have them reauthorize their account.`;
  }

  return 'An unknown error occurred. Try to publish your post again later. If the problem persists, please contact customer support.';
};
