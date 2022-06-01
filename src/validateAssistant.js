const ValidationObj = require('./ValidationObj');

function validateAssistantBody () {
  const validationObj = new ValidationObj();
  // No validation for now
  return validationObj;
}

function validateAssistantMedia () {
  const all = new ValidationObj();

  const response = {
    all,
  };

  // No validation for now

  return response;
}

module.exports = function validate_assistant (post, integration) {
  return {
    integration: integration.id,
    platform: integration.platform,
    body: validateAssistantBody(post.body),
    media: validateAssistantMedia(post.media),
  };
};
