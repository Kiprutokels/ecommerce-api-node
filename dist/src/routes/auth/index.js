"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("@/controllers/auth/auth.controller");
const validation_middleware_1 = require("@/middleware/validation.middleware");
const auth_middleware_1 = require("@/middleware/auth.middleware");
const auth_validator_1 = require("@/validators/auth.validator");
const router = (0, express_1.Router)();
router.post('/register', (0, validation_middleware_1.validateBody)(auth_validator_1.registerSchema), auth_controller_1.AuthController.register);
router.post('/login', (0, validation_middleware_1.validateBody)(auth_validator_1.loginSchema), auth_controller_1.AuthController.login);
router.post('/logout', auth_middleware_1.authenticate, auth_controller_1.AuthController.logout);
router.get('/me', auth_middleware_1.authenticate, auth_controller_1.AuthController.me);
exports.default = router;
//# sourceMappingURL=index.js.map