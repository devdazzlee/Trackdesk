"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountModel = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AccountModel {
    static async create(data) {
        return await prisma.account.create({
            data: {
                name: data.name,
                domain: data.domain,
                subdomain: data.subdomain,
                status: data.status || 'PENDING',
                plan: data.plan || 'STARTER',
                settings: data.settings || {},
                branding: data.branding || {},
            }
        });
    }
    static async findById(id) {
        return await prisma.account.findUnique({
            where: { id }
        });
    }
    static async findBySubdomain(subdomain) {
        return await prisma.account.findUnique({
            where: { subdomain }
        });
    }
    static async update(id, data) {
        return await prisma.account.update({
            where: { id },
            data
        });
    }
    static async delete(id) {
        await prisma.account.delete({
            where: { id }
        });
    }
    static async list(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return await prisma.account.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' }
        });
    }
}
exports.AccountModel = AccountModel;
//# sourceMappingURL=Account.js.map