"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateQuery = exports.validateBody = void 0;
const zod_1 = require("zod");
const response_util_1 = require("@/utils/response.util");
const validateBody = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                response_util_1.ResponseUtil.error(res, 'Validation failed', 422, errors);
                return;
            }
            response_util_1.ResponseUtil.error(res, 'Validation error', 500);
        }
    };
};
exports.validateBody = validateBody;
const validateQuery = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.query);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                response_util_1.ResponseUtil.error(res, 'Query validation failed', 422, errors);
                return;
            }
            response_util_1.ResponseUtil.error(res, 'Query validation error', 500);
        }
    };
};
exports.validateQuery = validateQuery;
const validateParams = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.params);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                response_util_1.ResponseUtil.error(res, 'Parameter validation failed', 422, errors);
                return;
            }
            response_util_1.ResponseUtil.error(res, 'Parameter validation error', 500);
        }
    };
};
exports.validateParams = validateParams;
//# sourceMappingURL=validation.middleware.js.map