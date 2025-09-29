import { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
        affiliateProfile?: any;
        adminProfile?: any;
    };
}
export declare const authenticateToken: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export declare const requireRole: (roles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const requireAffiliate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const requireAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const optionalAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map