const Ajv = require('ajv');

const post_schema = require('./post.json');

module.exports = function validate_post (post) {
  const ajv = new Ajv();
  const valid = ajv.validate(post_schema, post);
  if (!valid) {
    console.error(post); // eslint-disable-line no-console
    throw new Error(`Invalid schema for post! ${JSON.stringify(ajv.errors)}`);
  }
};
