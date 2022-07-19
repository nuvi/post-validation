const ValidationObj = require('./ValidationObj');
const urlRegex = require('./urlRegex');
const commonTLDRegex = /(([a-z]{1,63}\.)[-a-z0-9@:%._+~#=]{1,256}\.(com|org|edu|gov|uk|net|ca|de|jp|fr|au|us|ru|ch|it|nl|se|no|es|mil)(?:[-a-z0-9@:%_+.~#?&()//=]*)\b)/i;

module.exports = function validateUrl (url) {
  const validationObj = new ValidationObj();
  if (url) {
    const urlMatch1 = url.match(urlRegex);
    const urlMatch2 = url.match(commonTLDRegex);
    if (!urlMatch1 && !urlMatch2) {
      validationObj.add_error('Must be a valid url, i.e. https://example.com');
    }
  }
  return validationObj;
};
