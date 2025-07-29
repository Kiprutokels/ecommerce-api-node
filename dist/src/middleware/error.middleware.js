"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const client_1 = require("@prisma/client");
const response_util_1 = require("@/utils/response.util");
const errorHandler = (error, req, res, next) => {
    console.error('Error:', error);
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002':
                response_util_1.ResponseUtil.error(res, 'A record with this data already exists', 409);
                return;
            case 'P2025':
                response_util_1.ResponseUtil.error(res, 'Record not found', 404);
                return;
            case 'P2003':
                response_util_1.ResponseUtil.error(res, 'Foreign key constraint failed', 400);
                return;
            default:
                response_util_1.ResponseUtil.error(res, 'Database error', 500);
                return;
        }
    }
    if (error instanceof client_1.Prisma.PrismaClientValidationError) {
        response_util_1.ResponseUtil.error(res, 'Invalid data provided', 400);
        return;
    }
    const statusCode = error.statusCode || error.status || 500;
    const message = error.message || 'Internal server error';
    response_util_1.ResponseUtil.error(res, message, statusCode);
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res, next) => {
    response_util_1.ResponseUtil.error(res, `Route ${req.originalUrl} not found`, 404);
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=error.middleware.js.map