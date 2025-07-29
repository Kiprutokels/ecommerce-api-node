"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = exports.comparePassword = exports.hashPassword = exports.JWT_EXPIRES_IN = exports.JWT_SECRET = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
exports.JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d');
const hashPassword = async (password) => {
    return bcryptjs_1.default.hash(password, 12);
};
exports.hashPassword = hashPassword;
const comparePassword = async (password, hash) => {
    return bcryptjs_1.default.compare(password, hash);
};
exports.comparePassword = comparePassword;
const generateToken = (payload) => {
    const options = {
        expiresIn: exports.JWT_EXPIRES_IN,
    };
    return jsonwebtoken_1.default.sign(payload, exports.JWT_SECRET, options);
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    const decoded = jsonwebtoken_1.default.verify(token, exports.JWT_SECRET);
    if (typeof decoded === 'string' || !('userId' in decoded)) {
        throw new Error('Invalid token payload');
    }
    return decoded;
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=auth.js.map