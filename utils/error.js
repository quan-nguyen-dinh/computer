function BaseError(status, message) {
    if (Array.isArray(message)) {
        message = message.join('</br>');
    }
    Error.call(this, message);
    Error.captureStackTrace(this);
    this.status = status;
    this.message = message;
}

BaseError.prototype = Object.create(Error.prototype);
BaseError.prototype.name = 'BaseError';

module.exports = BaseError;