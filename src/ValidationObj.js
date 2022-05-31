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
