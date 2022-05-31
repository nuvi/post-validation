const get = require('lodash/get');

const ValidationObj = require('./ValidationObj');
const { CALLS_TO_ACTION_REQUIRING_URL, SUPPORTED_CALLS_TO_ACTION } = require('../../utils/googleMyBusinessConstants');

const SUPPORTED_IMAGE_EXTENSIONS = [
  '.jpeg',
  '.jpg',
  '.png',
];

function validateGMBBody (body) {
  const maxCharacters = 1500;
  const validationObj = new ValidationObj();

  if (!body || typeof body !== 'string') validationObj.errors.push({ message: 'GMB requires a summary for every post' });
  if (body.length > maxCharacters) validationObj.errors.push({ message: 'Summary is too long' });

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
      result.add_error('GMB Event posts must have a title');
    }
    if (!get(event, 'start_date.year') || !get(event, 'start_date.month') || !get(event, 'start_date.day')
      || get(event, 'start_time.hour') === undefined || get(event, 'start_time.minute') === undefined
    ) {
      result.add_error('GMB Event posts must have a start date & time');
    }
    if (!get(event, 'end_date.year') || !get(event, 'end_date.month') || !get(event, 'end_date.day')
      || get(event, 'end_time.hour') === undefined || get(event, 'end_time.minute') === undefined
    ) {
      result.add_error('GMB Event posts must have an end date & time');
    }
  } else if (details.google_my_business.call_to_action) {
    const cta = details.google_my_business.call_to_action;
    if (!cta.action) {
      result.add_error('GMB Call To Action posts require an action');
    }
    if (cta.action && !SUPPORTED_CALLS_TO_ACTION.includes(cta.action)) {
      result.add_error(`GMB unsupported Call To Action: ${cta.action}`);
    }
    if (CALLS_TO_ACTION_REQUIRING_URL.includes(cta.action) && !cta.url) {
      result.add_error('GMB Call To Action posts require a url');
    }
  } else if (details.google_my_business.offer) {
    const offer = details.google_my_business.offer;
    if (!offer.coupon_code) {
      result.add_error('GMB Offer posts require a coupon code');
    }
    if (!offer.url) {
      result.add_error('GMB Offer posts require a redemption url');
    }
    if (!offer.terms) {
      result.add_error('GMB Offer posts require terms of offer to be specified');
    }
    if (!offer.title) {
      result.add_error('GMB Offer posts must have a title');
    }
    if (!get(offer, 'start_date.year') || !get(offer, 'start_date.month') || !get(offer, 'start_date.day')
      || get(offer, 'start_time.hour') === undefined || get(offer, 'start_time.minute') === undefined
    ) {
      result.add_error('GMB Offer posts must have a start date & time');
    }
    if (!get(offer, 'end_date.year') || !get(offer, 'end_date.month') || !get(offer, 'end_date.day')
      || get(offer, 'end_time.hour') === undefined || get(offer, 'end_time.minute') === undefined
    ) {
      result.add_error('GMB Offer posts must have an end date & time');
    }
  }

  return result;
}

function validateGMBMedia (media) {
  const all = new ValidationObj();

  if (!media || media.length !== 1) {
    all.add_error('Must include exactly 1 image to post to Google My Business');
  } else {
    const metadata = media[0].metadata;
    const { extension } = metadata;
    if (!SUPPORTED_IMAGE_EXTENSIONS.includes(extension)) {
      all.add_error(`Unsupported file type. Must be one of ${SUPPORTED_IMAGE_EXTENSIONS.join(', ')}`);
    }
  }

  const response = {
    all,
  };

  return response;
}

function validate_google_my_business (post, integration) {
  return {
    integration: integration.id,
    platform: integration.platform,
    body: validateGMBBody(post.body),
    details: validateGMBDetails(post.details),
    media: validateGMBMedia(post.media),
  };
}

module.exports = {
  validate_google_my_business,
};
