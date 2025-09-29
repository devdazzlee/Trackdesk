"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.requireAdmin = exports.requireAffiliate = exports.requireRole = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                affiliateProfile: true,
                adminProfile: true
            }
        });
        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            affiliateProfile: user.affiliateProfile,
            adminProfile: user.adminProfile
        };
        next();
    }
    catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};
exports.authenticateToken = authenticateToken;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
};
exports.requireRole = requireRole;
const requireAffiliate = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    if (req.user.role !== 'AFFILIATE') {
        return res.status(403).json({ error: 'Affiliate access required' });
    }
    if (!req.user.affiliateProfile) {
        return res.status(404).json({ error: 'Affiliate profile not found' });
    }
    next();
};
exports.requireAffiliate = requireAffiliate;
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    if (!['ADMIN', 'MANAGER'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
exports.requireAdmin = requireAdmin;
const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                include: {
                    affiliateProfile: true,
                    adminProfile: true
                }
            });
            if (user) {
                req.user = {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    affiliateProfile: user.affiliateProfile,
                    adminProfile: user.adminProfile
                };
            }
        }
        catch (error) {
        }
    }
    next();
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map