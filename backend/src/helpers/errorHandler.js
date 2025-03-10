const errorHandler = (err, req, res, next) => {
    // check if response has already been sent
    if (res.headersSent) {
        // if true then pass the error to the next middleware
        return next(err);
    }

    // set the status code of the response
    const statusCode = err.statusCode && res.statusCode >= 400 ? err.statusCode : 500;
    res.status(statusCode); // set the status code of the response

    // log the error to the console if not in production for debugging
    if (process.env.NODE_ENV !== 'production') {
        console.error(err);
    }

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export default errorHandler;