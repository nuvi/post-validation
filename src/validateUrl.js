const ValidationObj = require('./ValidationObj');
const urlRegex = require('./urlRegex');

module.exports = function validateUrl (url) {
  const validationObj = new ValidationObj();
  if (url && !url.match(urlRegex)) {
    validationObj.add_error('Must be a valid url, i.e. https://example.com');
  }
  return validationObj;
};
