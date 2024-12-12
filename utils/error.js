function BaseError(status, message) {
    Error.call(this, message);
    Error.captureStackTrace(this);
    this.status = status;
    this.message = message;
}

BaseError.prototype = Object.create(Error.prototype);
BaseError.prototype.name = 'BaseError';

module.exports = BaseError;