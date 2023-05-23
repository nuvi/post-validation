/* eslint-disable max-len */
const getErrorResolution = require('../../getErrorResolution');

describe('getErrorResolution', () => {
  it('should handle unknown network', () => {
    const input = 'Holy smokes this thing didn\'t work.';
    const expected = 'An unknown error occurred. Try to publish your post again later. If the problem persists, please contact customer support.';
    expect(getErrorResolution('truth.social', input)).toEqual(expected);
  });


  /* Facebook */
  it('should handle Facebook security check errors', () => {
    const input = 'StatusCodeError: 400 - {"error":{"message":"A security check is required to proceed.","type":"OAuthException","code":368,"error_data":{"sentry_block_data":"Aei7dLt4UvLkyCYEx1ZtWF_T2COu9aHfHorH2BqrF30xFDN6ZbQMB12bs28Vc1-b1bqQOrRHmOVYzSfe5aoIQK0L0eXMo4ZWOcEAc36sbC-ZGQlQba-WCC4upv8xkMuxNZ0dsXS77bLLYXSi8HPQbPLiN0uL7oel8Ryq9r_WL5jJNwhPMlbmnEnm7lXJeYMj5lHtkY2UddSJYlFm-roLF3bSZDYIiPXqrY6U00boaZ_d1LI3YRFzAaCZMnay41BG23VhTCKY4SXXZRkYcH880EQWKnSFBy8s5pWUkyCgfMD3bntXqYTTxoDgP0DkFlw9_UjJa7WS9-ACc9ghfVsAILwbnlMZ0LzswXqZSf1_Hl4REmyVg1ox0y1eBO33ZL4FFwAIV0YAyybJiAH-fQqa7y5R-wEOyepAk4iVi0dmAh0q3utOg7n6I8IS-Db7y8QnFXw","help_center_id":0,"is_silent":false},"error_subcode":1404006,"error_user_msg":"","fbtrace_id":"AeJWYBGJKg6Yu8fXI8A7Wdk"}}';
    const expected = `According to Facebook this Page is "Temporarily blocked for policies violations" and "A security check is required to proceed." Please log in to Facebook and view the Page configuration to ensure that all security checks are complete before attempting to publish to it again.
    This error is not always consistent and can occur when a Page's behavior is suspicious according to Facebook's private algorithms. If you are unable to find any verification notices when logging in to Facebook, try to create fewer posts and ensure they are all unique to help reduce the algorithm's likelihood to flag your Page for a violation.`;
    expect(getErrorResolution('facebook', input)).toEqual(expected);
  });

  it('should handle FB restricted account error', () => {
    const input = 'StatusCodeError: 400 - {"error":{"message":"You\'re restricted from acting as your Page until you complete Page Publishing Authorization. Switch back to your Primary Profile to complete authorization under - Settings - Account Settings - Identity Confirmation. Complete verification or you will be restricted indefinitely.","type":"OAuthException","code":368,"error_data":{"sentry_block_data":"Aeg302WsdQi1c3zHaRq0G4F7O5eFHJd-n5qtihFCgq5WmF8MO_TfJheqn8Bo3GD1kxhJABZbN6OuUWjzikyeZBHUYNGmEj8qybzcXCZPT3hHQ7gsJ2Ihfmip1fuQVBqKkXPuUGoUHSFgYXfLfdQ2B9Yof8uZceDturEyRfvwhMgwSihfKsz50Csotg5x2M25eXD1gohG3hrxsv5m6TQwlYOuM1YVMb_WnXw-fO9RSrfNAhdsh9dkvcsnCUVAKURGMBML2YbEGV1GPkdoJh7kJoPsNFk_rFvXFTZDvWUVjanDvMh03jeggGGp2JRWRhrhodqZwW2g5CWGrnbceWTVN4nuZifGwfuoDxSLCdmRenmW6w","help_center_id":0,"is_silent":false},"error_subcode":1404078,"error_user_msg":"","fbtrace_id":"Ahsb6AMPTwJV2WfGPEqxIFW"}} ';
    const expected = 'The personal Facebook account of the User who authorized the Reputation app must log in to Facebook and complete the authorization of their personal account in the Settings - Account Settings - Identity Confirmation area.';
    expect(getErrorResolution('facebook', input)).toEqual(expected);
  });

  it('should handle FB session not allowed error', () => {
    const input = 'StatusCodeError: 400 - {"error":{"message":"Error validating access token: Sessions for the user are not allowed because the user is not a confirmed user.","type":"OAuthException","code":190,"error_subcode":464,"fbtrace_id":"AFb-Qe6CujAHQwLLt7MXYe9"}} ';
    const expected = 'The Facebook User needs to log in to Facebook and perform the required verification in order to be allowed to publish content.';
    expect(getErrorResolution('facebook', input)).toEqual(expected);
  });

  it('should handle FB must be admin error', () => {
    const input = 'StatusCodeError: 400 - {"error":{"message":"The user must be an administrator, editor, or moderator of the page in order to impersonate it. If the page business requires Two Factor Authentication, the user also needs to enable Two Factor Authentication.","type":"OAuthException","code":190,"error_subcode":492,"fbtrace_id":"ArmNm5F1-pv6cm7cLNCNd5W"}} ';
    const expected = `The Facebook User who authorized this Page has changed in some way that caused their authorization to publish to be revoked by Facebook. Common reasons for this include the user changing their password or an administrator making changes to permissions in Business Manager. To resolve this issue, have an administrator log in to Facebook Business Manager and verify that each User has the appropriate access to create content for your Pages. Then have the Users reauthorize Reputation.
    It is also possible that some permissions were not accepted during the authorization process or that some permissions were revoked by a User. To resolve this situation, have each User completely revoke access to Reputation through their Facebook Settings. Then have them reauthorize their account.`;
    expect(getErrorResolution('facebook', input)).toEqual(expected);
  });

  it('should handle FB session invalidated error', () => {
    const input = 'StatusCodeError: 400 - {"error":{"message":"Error validating access token: The session has been invalidated because the user changed their password or Facebook has changed the session for security reasons.","type":"OAuthException","code":190,"error_subcode":460,"fbtrace_id":"ASkD40ZYzAMGpUkxW2P4ez6"}} ';
    const expected = `The Facebook User who authorized this Page has changed in some way that caused their authorization to publish to be revoked by Facebook. Common reasons for this include the user changing their password or an administrator making changes to permissions in Business Manager. To resolve this issue, have an administrator log in to Facebook Business Manager and verify that each User has the appropriate access to create content for your Pages. Then have the Users reauthorize Reputation.
    It is also possible that some permissions were not accepted during the authorization process or that some permissions were revoked by a User. To resolve this situation, have each User completely revoke access to Reputation through their Facebook Settings. Then have them reauthorize their account.`;
    expect(getErrorResolution('facebook', input)).toEqual(expected);
  });

  it('should handle unknown FB errors', () => {
    const input = 'Something went horribly wrong';
    const expected = 'An unknown error occurred. Try to publish your post again later. If the problem persists, please contact customer support.';
    expect(getErrorResolution('facebook', input)).toEqual(expected);
  });

  it('should handle falsey FB error', () => {
    const input = null;
    const expected = 'An unknown error occurred. Try to publish your post again later. If the problem persists, please contact customer support.';
    expect(getErrorResolution('facebook', input)).toEqual(expected);
  });


  /* Instagram */
  it('should handle IG application does not have permission errors', () => {
    const input = 'StatusCodeError: 400 - {"error":{"message":"(#10) Application does not have permission for this action","type":"OAuthException","code":10,"fbtrace_id":"AlxUisvCSIMDcrLtpCjx_X0"}} ';
    const expected = `Generally this error indicates that the Facebook User that authorized the Instagram account either did not grant all the required permissions to publish or that some of the permissions requirements have changes since the User's last authorization. Please reauthorize the User's Facebook/Instagram account in order to continue publishing content.
    It is also possible that some permissions were not accepted during the authorization process or that some permissions were revoked by a User. To resolve this situation, have each User completely revoke access to Reputation through their Facebook Settings. Then have them reauthorize their account.`;
    expect(getErrorResolution('instagram', input)).toEqual(expected);
  });

  it('should handle IG user access restricted error', () => {
    const input = 'StatusCodeError: 400 - {"error":{"message":"User access is restricted","type":"OAuthException","code":25,"error_subcode":2207050,"is_transient":false,"error_user_title":"User is restricted","error_user_msg":"The Instagram account is restricted.","fbtrace_id":"AdHA39nXVwnOZT5aiIGyzDv"}} ';
    const expected = 'This Instagram account has been blocked from publishing. Typically this means that you will need to log in to Instagram on a mobile device and resolve whatever notice or warning is presented. From time to time Instagram requires Business Accounts to verify some information and will sometimes block accounts that haven\'t provided that verification by a certain date. For example, in the past Instagram has required Business Accounts to provide a birthdate before continuing to publish.';
    expect(getErrorResolution('instagram', input)).toEqual(expected);
  });

  it('should handle IG administrator error', () => {
    const input = 'StatusCodeError: 400 - {"error":{"message":"The user must be an administrator, editor, or moderator of the page in order to impersonate it. If the page business requires Two Factor Authentication, the user also needs to enable Two Factor Authentication.","type":"OAuthException","code":190,"error_subcode":492,"fbtrace_id":"Ain9T1EtRGY9ZUjBZd61jZM"}} ';
    const expected = `The Facebook User who authorized this Instagram Account has changed in some way that caused their authorization to publish to be revoked by Instagram. Common reasons for this include the user changing their password or an administrator making changes to permissions in Business Manager. To resolve this issue, have an administrator log in to Facebook Business Manager and verify that each User has the appropriate access to create content for your Pages. Then have the Users reauthorize Reputation.
    It is also possible that some permissions were not accepted during the authorization process or that some permissions were revoked by a User. To resolve this situation, have each User completely revoke access to Reputation through their Facebook Settings. Then have them reauthorize their account.`;
    expect(getErrorResolution('instagram', input)).toEqual(expected);
  });

  it('should handle IG Application request limit reached error', () => {
    const input = 'StatusCodeError: 403 - {"error":{"message":"Application request limit reached","type":"OAuthException","is_transient":false,"code":4,"error_subcode":2207051,"error_user_title":"Action is blocked","error_user_msg":"We restrict certain activity to protect our community. Tell us if you think that we\'ve made a mistake.","fbtrace_id":"Ak94s1zgaADBUMfc50QG0ma"}} ';
    const expected = 'This is an internal issue that can be resolved by simply re-scheduing your post to be published again. If the issue persists please contact customer support.';
    expect(getErrorResolution('instagram', input)).toEqual(expected);
  });

  it('should handle IG The user is not an Instagram Business error', () => {
    const input = 'StatusCodeError: 400 - {"error":{"message":"(#10) The user is not an Instagram Business","type":"OAuthException","code":10,"fbtrace_id":"A0KEsOD0sm8GOzzjLAIOHNN"}} ';
    const expected = 'Only Instagram Business Accounts may be used with Reputation (not personal accounts). If this account is intended for business use, please follow the steps provided by Instagram to promote your account to a Business Account and connect it to a Business Page in Facebook. Then, reauthorize your account for use with Reputation.';
    expect(getErrorResolution('instagram', input)).toEqual(expected);
  });

  it('should handle IG Sessions for the user error', () => {
    const input = 'StatusCodeError: 400 - {"error":{"message":"Error validating access token: Sessions for the user are not allowed because the user is not a confirmed user.","type":"OAuthException","code":190,"error_subcode":464,"fbtrace_id":"Ag9aEZj3MREVj9m9kxav2rf"}} ';
    const expected = 'The Instagram User needs to log in to the Instagram mobile app and perform the required verification in order to be allowed to publish content.';
    expect(getErrorResolution('instagram', input)).toEqual(expected);
  });

  it('should handle IG unknown errors', () => {
    const input = 'Holy smokes this thing didn\'t work.';
    const expected = 'An unknown error occurred. Try to publish your post again later. If the problem persists, please contact customer support.';
    expect(getErrorResolution('instagram', input)).toEqual(expected);
  });


  /* LinkedIn */
  it('should handle LinkedIn token expired errors', () => {
    const input = `Error: Error posting to https://api.linkedin.com/rest/images (initializeUpload) : 
    {"status":401,"serviceErrorCode":65602,"code":"EXPIRED_ACCESS_TOKEN","message":"The token used in the request has expired"} `;
    const expected = 'Your LinkedIn access token has expired. You\'ll need to reauthorize your LinkedIn account before you can continue to publish.';
    expect(getErrorResolution('linkedin', input)).toEqual(expected);
  });

  it('should handle LinkedIn socket disconnected errors', () => {
    const input = 'FetchError: request to https://api.linkedin.com/rest/videos/urn:li:video:D5610AQH8aV6kw5VLxA failed, reason: Client network socket disconnected before secure TLS connection was established ';
    const expected = 'There was a network connection issue while attempting to publish your video. Please try again and contact customer support if the issue continues.';
    expect(getErrorResolution('linkedin', input)).toEqual(expected);
  });

  it('should handle unknown LinkedIn errors', () => {
    const input = 'Something went horribly wrong again. I blame Microsoft.';
    const expected = 'An unknown error occurred. Try to publish your post again later. If the problem persists, please contact customer support.';
    expect(getErrorResolution('linkedin', input)).toEqual(expected);
  });


  /* TikTok */
  it('should handle unknown TikTok errors', () => {
    const input = 'Something went horribly wrong again.';
    const expected = 'An unknown error occurred. Try to publish your video again later. If the problem persists, please contact customer support.';
    expect(getErrorResolution('tiktok', input)).toEqual(expected);
  });


  /* Twitter */
  it('should handle Twitter account suspended errors', () => {
    const input = 'StatusCodeError: 403 - {"errors":[{"code":64,"message":"Your account is suspended and is not permitted to access this feature."}]} ';
    const expected = `Twitter suspends accounts for a variety of reasons. One common reason is publishing too many tweets to quickly or publishing the exact same tweet multiple times to one account or many accounts.
      First, log in to Twitter and view your account information to see if there are any warnings or verifications you are required to complete. If there are no notices to resolve, try publishing tweets with a few minutes in between each one. If you need to share the same message to multiple accounts, try adding some custom variables into the message to ensure it is not identical to other tweets being sent at the same time.`;
    expect(getErrorResolution('twitter', input)).toEqual(expected);
  });

  it('should handle Twitter Could not authenticate you errors', () => {
    const input = 'Error: Error getting status: {"errors":[{"message":"Could not authenticate you","code":32}]}    ';
    const expected = 'This error message from Twitter is very generic. It can mean that you need to reauthorize your account or simply that you need to try again later. As a first step, try to publish your post a few minutes later. If that doesn\'t work, try to reauthenticate your Twitter account. If the problem continues, please contact customer support.';
    expect(getErrorResolution('twitter', input)).toEqual(expected);
  });

  it('should handle Twitter spam errors', () => {
    const input = 'StatusCodeError: 403 - {"errors":[{"code":326,"message":"To protect our users from spam and other malicious activity, this account is temporarily locked. Please log in to https://twitter.com to unlock your account."}]}';
    const expected = 'Twitter has locked your account. This typically means that the account published too many tweets to quickly or too many tweets with the same content. Regardless of the reason, you\'ll need to log in to twitter.com and follow the verification prompts to unlock your account before you can publish again.';
    expect(getErrorResolution('twitter', input)).toEqual(expected);
  });

  it('should handle unknown Twitter errors', () => {
    const input = 'Something went horribly wrong again.';
    const expected = 'An unknown error occurred. Try to publish your tweet again later. If the problem persists, please contact customer support.';
    expect(getErrorResolution('twitter', input)).toEqual(expected);
  });


  /* YouTube */
  it('should handle unknown YouTube errors', () => {
    const input = 'Something went horribly wrong again.';
    const expected = 'An unknown error occurred. Try to publish your video again later. If the problem persists, please contact customer support.';
    expect(getErrorResolution('youtube', input)).toEqual(expected);
  });
});
