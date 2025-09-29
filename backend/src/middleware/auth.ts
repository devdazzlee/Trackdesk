import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    accountId: string;
    affiliateId?: string;
    userId?: string;
    affiliateProfile?: any;
    adminProfile?: any;
  };
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
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
      accountId: user.id, // Use user ID as accountId for now
      affiliateId: user.affiliateProfile?.id,
      userId: user.id,
      affiliateProfile: user.affiliateProfile,
      adminProfile: user.adminProfile
    };

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

export const requireAffiliate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (!['ADMIN', 'MANAGER'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};

export const optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
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
          accountId: user.id, // Use user ID as accountId for now
          affiliateId: user.affiliateProfile?.id,
          userId: user.id,
          affiliateProfile: user.affiliateProfile,
          adminProfile: user.adminProfile
        };
      }
    } catch (error) {
      // Token is invalid, but we continue without authentication
    }
  }

  next();
};


