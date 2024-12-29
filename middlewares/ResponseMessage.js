



function sendError(res, statusCode, message) {
    return res.status(statusCode).json({
        success: false,
        message: message,
    });
}
// utils/responseHandler.js
function sendSuccess(res, statusCode, message, data = null) {
    return res.status(statusCode).json({
        success: true,
        message: message,
        data: data, 
    });
}

module.exports = { sendError, sendSuccess };
// utils/ResponseHandler.js


