const SOMETHING_WENT_WRONG = "Something went wrong";
const EMAIL_NOT_FOUND = "Email not found"
const INCORRECT_PASSWORD = "Password is incorrect"
const BAD_REQUEST = "Bad request"
const LINK_EXPIRED = "Gone. Your OTP is expired. Please ask for resend OTP code in previous page."
const IMAGE_NOT_FOUND = "There are no images in file, try again."
const CATEGORY_NOT_FOUND = "Category not found."
const CATEGORY_ALREADY_EXISTS = "There are already same category in the list!"
const PRODUCT_NOT_FOUND = "Product not found."
const PRODUCT_ALREADY_EXISTS = "There are already same product in the list!"
const PRODUCT_ALREADY_HAS_DEFAULT_UNIT = "Product already have default unit in the list!"
const PRODUCT_UNIT_ALREADY_EXISTS = "Product unit already exist in the list!"
const CANNOT_DELETE_DEFAULT_PRODUCT_UNIT = "Default product unit can't be deleted!"
const NO_CHANGES = "No changes were made";

const DEFAULT_ERROR_STATUS = 500
const BAD_REQUEST_STATUS = 400
const NOT_FOUND_STATUS = 404
const LINK_EXPIRED_STATUS = 410
const INVALID_CREDENTIALS = "Invalid credentials";
const INVALID_CREDENTIALS_OTP = "Invalid credentials for OTP. Please check your OTP";

function errorHandler (error, req, res, next) {
    if (error?.name === "SequelizeValidationError") {
        return res.status(BAD_REQUEST_STATUS)
            .json(
                { message : error?.errors?.[0]?.message }
            )
    }

    const message = error?.message || SOMETHING_WENT_WRONG;
    const status = error?.status || DEFAULT_ERROR_STATUS;
    res.status(status).json({ 
        type : "error", 
        status, 
        message
    });
}

module.exports = {
    errorHandler,
    SOMETHING_WENT_WRONG,
    EMAIL_NOT_FOUND,
    INCORRECT_PASSWORD,
    BAD_REQUEST,
    DEFAULT_ERROR_STATUS,
    BAD_REQUEST_STATUS,
    NOT_FOUND_STATUS,
    INVALID_CREDENTIALS,
    INVALID_CREDENTIALS_OTP,
    LINK_EXPIRED,
    LINK_EXPIRED_STATUS,
    IMAGE_NOT_FOUND,
    CATEGORY_NOT_FOUND,
    CATEGORY_ALREADY_EXISTS,
    PRODUCT_NOT_FOUND,
    PRODUCT_ALREADY_EXISTS,
    PRODUCT_ALREADY_HAS_DEFAULT_UNIT,
    PRODUCT_UNIT_ALREADY_EXISTS,
    CANNOT_DELETE_DEFAULT_PRODUCT_UNIT,
    NO_CHANGES
}