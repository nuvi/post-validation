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
  if (message.includes('The user has not authorized application')) {
    return 'This error means that either the authorization with this app expired or the app was removed from this Facebook account by a managing user on Facebook. You\'ll need to reauthorize your Facebook page before you can continue to publish.';
  }
  if (message.includes('You do not have permission to create an unpublished post')) {
    return `
      This can be a result of being added as an admin via business manager to a page created via the business manager of Facebook.<br />
      To prevent this issue, you will have to reassign your role from the regular page.<br />
      <br />
      1) Remove yourself as an admin from the Business Manager<br />
      2) You need to add the user as an admin on your selected Facebook Page (ensuring that you are not within the Business Manager Framework).<br />
      <br />
      Then<br />
      (new Facebook experience)<br />
      1) Go to the Facebook Page and click  Page Settings on the bottom left (DO NOT USE BUSINESS MANAGER).<br />
      2) Click Page Roles in the left column.<br />
      3) Type a name in the box and select the person from the list that appears.<br />
      4) Click "Admin"* to select a role from the dropdown menu.<br />
      5) Click Add and enter your password to confirm.<br />
      <br />
      (classic Facebook experience)<br />
      1) Click Settings at the top of your Page (DO NOT USE BUSINESS MANAGER).<br />
      2) Click Page Roles in the left column.<br />
      3) Type a name in the box and select the person from the list that appears.<br />
      4) Click "Admin"  to select a role from the dropdown menu.<br />
      5) Click Add and enter the password to confirm.<br />
      <br />
      *Please note, if the "Admin" does not appear, select "Editor", this can be changed later.
   `;
  }

  if (message.includes('Your photos couldn\'t be uploaded. Photos should be less than 4 MB and saved as JPG, PNG, GIF, TIFF, HEIF or WebP files')) {
    return 'Typically, our process automatically resizes and formats images to avoid this error. You may duplicate the post and reschedule and the images should be handled correctly. If the issue persists please contact customer support.';
  }

  if (message.includes('targeting invalid')) {
    return 'This typically happens when targeting is applied to a post and the facebook page is not setup to handle targeting. Please review your pages settings.';
  }

  if (message.includes('No Permission to Upload Video')) {
    return 'Facebook has determined that your access token does not have permission to upload videos. This can sometimes be caused by a mistake on Facebook\'s part. Try to publish your video again. If the error persists, you will need to re-authenticate with Facebook and ensure you do not disable any of the permissions when prompted.';
  }

  if (message.includes('Please reduce the amount of data you\'re asking for, then retry your request')) {
    return 'Facebook is throwing this error, please wait for sometime and then retry.';
  }

  return 'An unknown error occurred. Try to publish your post again later. If the problem persists, please contact customer support.';
};
