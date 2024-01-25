/* eslint-disable max-len */
module.exports = function getInstagramResolution (message) {
  if (message.includes('Application does not have permission for this action')) {
    return `Generally this error indicates that the Facebook User that authorized the Instagram account either did not grant all the required permissions to publish or that some of the permissions requirements have changes since the User's last authorization. Please reauthorize the User's Facebook/Instagram account in order to continue publishing content.
    It is also possible that some permissions were not accepted during the authorization process or that some permissions were revoked by a User. To resolve this situation, have each User completely revoke access to Reputation through their Facebook Settings. Then have them reauthorize their account.`;
  }
  if (message.includes('User access is restricted')) {
    return 'This Instagram account has been blocked from publishing. Typically this means that you will need to log in to Instagram on a mobile device and resolve whatever notice or warning is presented. From time to time Instagram requires Business Accounts to verify some information and will sometimes block accounts that haven\'t provided that verification by a certain date. For example, in the past Instagram has required Business Accounts to provide a birthdate before continuing to publish.';
  }
  if (message.includes('The user must be an administrator, editor, or moderator of the page')) {
    return `The Facebook User who authorized this Instagram Account has changed in some way that caused their authorization to publish to be revoked by Instagram. Common reasons for this include the user changing their password or an administrator making changes to permissions in Business Manager. To resolve this issue, have an administrator log in to Facebook Business Manager and verify that each User has the appropriate access to create content for your Pages. Then have the Users reauthorize Reputation.
    It is also possible that some permissions were not accepted during the authorization process or that some permissions were revoked by a User. To resolve this situation, have each User completely revoke access to Reputation through their Facebook Settings. Then have them reauthorize their account.`;
  }
  if (message.includes('Application request limit reached')) {
    return 'This is an internal issue that can be resolved by simply re-scheduing your post to be published again. If the issue persists please contact customer support.';
  }
  if (message.includes('The user is not an Instagram Business')) {
    return 'Only Instagram Business Accounts may be used with Reputation (not personal accounts). If this account is intended for business use, please follow the steps provided by Instagram to promote your account to a Business Account and connect it to a Business Page in Facebook. Then, reauthorize your account for use with Reputation.';
  }
  if (message.includes('Sessions for the user are not allowed because the user is not a confirmed user')) {
    return 'The Instagram User needs to log in to the Instagram mobile app and perform the required verification in order to be allowed to publish content.';
  }
  if (message.includes('does not exist, cannot be loaded due to missing permissions, or does not support this operation')) {
    return 'This Instagram account no longr exists or does not have permission to publish. Please reauthorize the Instagram account if you believe this to be an error.';
  }
  if (message.includes('Error:')) {
    return 'Facebook encountered an error. Please try again.';
  }
  return 'An unknown error occurred. Try to publish your post again later. If the problem persists, please contact customer support.';
};
