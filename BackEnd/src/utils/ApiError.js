class ApiError extends Error {
    constructor(statusCode = 500, message = "Internal server error.") {
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
    }
}

export default ApiError;
