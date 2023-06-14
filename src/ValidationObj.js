/*
 * This is used to store any errors/warnings when validating different media types that will appear on the front end as errors/warnings
 */
module.exports = class ValidationObj {
  constructor () {
    this.errors = [];
    this.warnings = [];
  }

  add_error (message, start = null, end = null) {
    this.errors.push({ message, start, end });
  }

  add_warning (message, start = null, end = null) {
    this.warnings.push({ message, start, end });
  }
};
