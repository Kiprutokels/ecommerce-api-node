"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseUtil = void 0;
class ResponseUtil {
    static success(res, data, message = 'Success', statusCode = 200) {
        const response = {
            success: true,
            message,
            data,
        };
        return res.status(statusCode).json(response);
    }
    static error(res, message = 'Error', statusCode = 400, errors) {
        const response = {
            success: false,
            message,
            errors,
        };
        return res.status(statusCode).json(response);
    }
    static paginated(res, data, total, page, perPage, message = 'Success') {
        const totalPages = Math.ceil(total / perPage);
        const response = {
            success: true,
            message,
            data,
            pagination: {
                page,
                per_page: perPage,
                total,
                total_pages: totalPages,
                has_next: page < totalPages,
                has_prev: page > 1,
            },
        };
        return res.status(200).json(response);
    }
}
exports.ResponseUtil = ResponseUtil;
//# sourceMappingURL=response.util.js.map