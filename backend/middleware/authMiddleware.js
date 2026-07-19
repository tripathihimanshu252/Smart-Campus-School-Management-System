// Secure JWT Verification and Tenant Isolation Middleware
const jwt = require('jsonwebtoken');

/**
 * 1. PROTECT MIDDLEWARE
 * Kaam: Token check karna aur User ko Request Object mein inject karna
 */
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // 🔥 FIX: Secret wahi use karo jo controller me token banate waqt use hua tha
            // Agar .env me JWT_SECRET nahi hai, toh ye default string use karega
            const secret = process.env.JWT_SECRET || 'SESSION_JWT_NODE_VECTOR_TEST_CLUSTER-AI-DS';

            // Token Verify karna
            const decoded = jwt.verify(token, secret);

            // Data Isolation: tenantId hona compulsory hai
            if (!decoded.tenantId) {
                return res.status(401).json({ success: false, message: 'Access Denied: Missing Tenant Identification' });
            }

            // User info request mein store karna
            req.user = {
                id: decoded.id,
                role: decoded.role ? decoded.role.toLowerCase().trim() : '',
                email: decoded.email ? decoded.email.toLowerCase().trim() : '',
                tenantId: decoded.tenantId.trim() // 🔥 FIX: toUpperCase() hata diya taaki mapping sahi rahe
            };

            next();
        } catch (error) {
            console.error("Token Verification Error:", error.message);
            return res.status(401).json({ success: false, message: 'Access Denied: Invalid or Expired Token' });
        }
    } else {
        return res.status(401).json({ success: false, message: 'Access Denied: No Authentication Token Found' });
    }
};

/**
 * 2. AUTHORIZE ROLES MIDDLEWARE
 * Kaam: User ka role check karna ki wo specific page access kar sakta hai ya nahi
 */
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Super Admin access always allowed
        if (req.user?.role === 'super-admin' || req.user?.role === 'superadmin') {
            return next();
        }

        // Role check
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `RBAC Restriction: Unauthorized access for role [${req.user?.role || 'Guest'}].`
            });
        }
        next();
    };
};

module.exports = { protect, authorizeRoles };