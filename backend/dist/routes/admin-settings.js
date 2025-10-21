"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, "../../uploads/avatars");
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `admin-${uniqueSuffix}${path_1.default.extname(file.originalname)}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(new Error("Only image files are allowed"));
        }
    },
});
router.get("/profile", auth_1.authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res
                .status(403)
                .json({ error: "Only admins can access this profile" });
        }
        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatar: true,
                createdAt: true,
                role: true,
            },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const admin = await prisma.adminProfile.findFirst({
            where: { userId },
        });
        res.json({
            user,
            admin: admin
                ? {
                    id: admin.id,
                    permissions: admin.permissions,
                    department: admin.department,
                }
                : null,
        });
    }
    catch (error) {
        console.error("Error fetching admin profile:", error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});
router.put("/profile", auth_1.authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res
                .status(403)
                .json({ error: "Only admins can update this profile" });
        }
        const userId = req.user.id;
        const schema = zod_1.z.object({
            firstName: zod_1.z.string().min(1, "First name is required"),
            lastName: zod_1.z.string().min(1, "Last name is required"),
            phone: zod_1.z.string().optional(),
            department: zod_1.z.string().optional(),
        });
        const { firstName, lastName, phone, department } = schema.parse(req.body);
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                firstName,
                lastName,
                phone,
            },
        });
        await prisma.adminProfile.upsert({
            where: { userId },
            update: {
                department,
            },
            create: {
                userId,
                department,
                permissions: ["READ", "WRITE", "DELETE"],
            },
        });
        res.json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                phone: updatedUser.phone,
                avatar: updatedUser.avatar,
                role: updatedUser.role,
            },
        });
    }
    catch (error) {
        console.error("Error updating admin profile:", error);
        if (error instanceof zod_1.z.ZodError) {
            return res
                .status(400)
                .json({ error: "Invalid input data", details: error.errors });
        }
        res.status(500).json({ error: "Failed to update profile" });
    }
});
router.post("/profile/avatar", auth_1.authenticateToken, upload.single("avatar"), async (req, res) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res
                .status(403)
                .json({ error: "Only admins can upload avatars" });
        }
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const userId = req.user.id;
        const avatarPath = `/uploads/avatars/${req.file.filename}`;
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { avatar: avatarPath },
        });
        res.json({
            success: true,
            message: "Avatar uploaded successfully",
            avatar: avatarPath,
        });
    }
    catch (error) {
        console.error("Error uploading avatar:", error);
        res.status(500).json({ error: "Failed to upload avatar" });
    }
});
router.delete("/profile/avatar", auth_1.authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ error: "Only admins can remove avatars" });
        }
        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { avatar: true },
        });
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { avatar: null },
        });
        if (user?.avatar) {
            const avatarPath = path_1.default.join(__dirname, "../../", user.avatar);
            if (fs_1.default.existsSync(avatarPath)) {
                fs_1.default.unlinkSync(avatarPath);
            }
        }
        res.json({
            success: true,
            message: "Avatar removed successfully",
        });
    }
    catch (error) {
        console.error("Error removing avatar:", error);
        res.status(500).json({ error: "Failed to remove avatar" });
    }
});
router.put("/security/password", auth_1.authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ error: "Only admins can change password" });
        }
        const userId = req.user.id;
        const schema = zod_1.z.object({
            currentPassword: zod_1.z.string().min(1, "Current password is required"),
            newPassword: zod_1.z
                .string()
                .min(8, "New password must be at least 8 characters"),
            confirmPassword: zod_1.z.string().min(1, "Confirm password is required"),
        });
        const { currentPassword, newPassword, confirmPassword } = schema.parse(req.body);
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, password: true, email: true },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        await prisma.activity.create({
            data: {
                userId,
                action: "password_changed",
                resource: "security",
                details: {
                    timestamp: new Date().toISOString(),
                    userEmail: user.email,
                },
            },
        });
        res.json({
            success: true,
            message: "Password changed successfully",
        });
    }
    catch (error) {
        console.error("Error changing password:", error);
        if (error instanceof zod_1.z.ZodError) {
            return res
                .status(400)
                .json({ error: "Invalid input data", details: error.errors });
        }
        res.status(500).json({ error: "Failed to change password" });
    }
});
exports.default = router;
//# sourceMappingURL=admin-settings.js.map