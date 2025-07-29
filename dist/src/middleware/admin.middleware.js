"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = void 0;
const response_util_1 = require("@/utils/response.util");
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        response_util_1.ResponseUtil.error(res, 'Authentication required', 401);
        return;
    }
    if (!req.user.isAdmin) {
        response_util_1.ResponseUtil.error(res, 'Admin access required', 403);
        return;
    }
    next();
};
exports.requireAdmin = requireAdmin;
//# sourceMappingURL=admin.middleware.js.map