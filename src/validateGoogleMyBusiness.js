const get = require('lodash/get');
const isObject = require('lodash/isObject');

const ValidationObj = require('./ValidationObj');

const GMB_CALLS_TO_ACTION = [
  'BOOK',
  'ORDER',
  'SHOP',
  'LEARN_MORE',
  'SIGN_UP',
  'CALL',
];

const GMB_CALLS_TO_ACTION_REQUIRING_URL = [
  'BOOK',
  'ORDER',
  'SHOP',
  'LEARN_MORE',
  'SIGN_UP',
];

const GMB_IMAGE_EXTENSIONS = [
  '.jpeg',
  '.jpg',
  '.png',
];

function validateGMBBody (body, postContentType) {
  const maxCharacters = 1500;
  const validationObj = new ValidationObj();

  if (!body || typeof body !== 'string') validationObj.errors.push({ message: 'GBP requires a summary for every post' });
  if (body.length > maxCharacters) validationObj.errors.push({ message: 'Summary is too long' });

  if (postContentType === 'reel') validationObj.add_warning('GBP does not support Reels. This post will be published as a normal post.');

  return validationObj;
}

function validateGMBDetails (details) {
  const result = new ValidationObj();
  if (!details || !details.google_my_business) {
    return result;
  }

  if (details.google_my_business.event) {
    const event = details.google_my_business.event;
    if (!event.title) {
      result.add_error('GBP Event posts must have a title');
    }
    if (!get(event, 'start_date.year') || !get(event, 'start_date.month') || !get(event, 'start_date.day')
      || get(event, 'start_time.hour') === undefined || get(event, 'start_time.minute') === undefined
    ) {
      result.add_error('GBP Event posts must have a start date & time');
    }
    if (!get(event, 'end_date.year') || !get(event, 'end_date.month') || !get(event, 'end_date.day')
      || get(event, 'end_time.hour') === undefined || get(event, 'end_time.minute') === undefined
    ) {
      result.add_error('GBP Event posts must have an end date & time');
    }
  } else if (details.google_my_business.call_to_action) {
    const cta = details.google_my_business.call_to_action;
    if (!cta.action) {
      result.add_error('GBP Call To Action posts require an action');
    }
    if (cta.action && !GMB_CALLS_TO_ACTION.includes(cta.action)) {
      result.add_error(`GBP unsupported Call To Action: ${cta.action}`);
    }
    if (GMB_CALLS_TO_ACTION_REQUIRING_URL.includes(cta.action) && !cta.url) {
      result.add_error('GBP Call To Action posts require a url');
    }
  } else if (details.google_my_business.offer) {
    const offer = details.google_my_business.offer;
    if (!offer.coupon_code) {
      result.add_error('GBP Offer posts require a coupon code');
    }
    if (!offer.url) {
      result.add_error('GBP Offer posts require a redemption url');
    }
    if (!offer.terms) {
      result.add_error('GBP Offer posts require terms of offer to be specified');
    }
    if (!offer.title) {
      result.add_error('GBP Offer posts must have a title');
    }
    if (!get(offer, 'start_date.year') || !get(offer, 'start_date.month') || !get(offer, 'start_date.day')
      || get(offer, 'start_time.hour') === undefined || get(offer, 'start_time.minute') === undefined
    ) {
      result.add_error('GBP Offer posts must have a start date & time');
    }
    if (!get(offer, 'end_date.year') || !get(offer, 'end_date.month') || !get(offer, 'end_date.day')
      || get(offer, 'end_time.hour') === undefined || get(offer, 'end_time.minute') === undefined
    ) {
      result.add_error('GBP Offer posts must have an end date & time');
    }
  }

  return result;
}

function validateGMBMedia (media) {
  const all = new ValidationObj();

  const response = { all };

  if (media.some(instance => !isObject(instance.metadata))) {
    all.add_error('Media metadata analysis unavailable. Please check back later.');
    return response;
  }

  if (!GMB_IMAGE_EXTENSIONS.includes(media[0].metadata.extension)) {
    all.add_error(`Unsupported file type. Must be one of ${GMB_IMAGE_EXTENSIONS.join(', ')}`);
  }

  return response;
}

function validate_google_my_business (post, integration) {
  return {
    integration: integration.id,
    platform: integration.platform,
    body: validateGMBBody(post.body, post.post_content_type),
    details: validateGMBDetails(post.details),
    media: validateGMBMedia(post.media),
  };
}

module.exports = {
  GMB_CALLS_TO_ACTION,
  GMB_CALLS_TO_ACTION_REQUIRING_URL,
  GMB_IMAGE_EXTENSIONS,
  validate_google_my_business,
};
