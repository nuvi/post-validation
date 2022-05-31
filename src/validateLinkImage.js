const ValidationObj = require('./ValidationObj');
const { FACEBOOK, LINKEDIN } = require('./enums');

const SUPPORTED_NETWORKS = [
  LINKEDIN,
  FACEBOOK,
];

module.exports = function validateLinkImage (linkImageUrl, isLinkPreviewCustomized, platform) {
  const validationObj = new ValidationObj();
  const isCustomImage = linkImageUrl && isLinkPreviewCustomized;
  if (SUPPORTED_NETWORKS.includes(platform) && isCustomImage) {
    if (platform === FACEBOOK) validationObj.add_warning('Custom Link Image may cause post to fail if you are not the verified on Facebook as the owner of the domain');
    return validationObj;
  }
  if (linkImageUrl && isCustomImage) validationObj.add_warning('Custom Link Image unsupported. Default link image will be posted instead.');
  return validationObj;
};
