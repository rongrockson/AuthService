export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
    }
}

export const handleError = (err, res) => {
    const { statusCode = 500, message = 'Internal Server Error' } = err;
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message
    });
};
