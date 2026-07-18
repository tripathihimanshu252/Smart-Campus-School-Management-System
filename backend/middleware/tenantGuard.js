// 🏢 Cross-Tenant Isolation Infrastructure Guard Layer
const verifyTenantAccess = (req, res, next) => {
  try {
    // 1️⃣ USER CONTEXT EXTRACTION
    const userTenant = req.user?.tenantMapping || req.user?.tenantId || req.headers['x-tenant-id'];
    const userRole = req.user?.role?.toLowerCase().trim();
    
    // 2️⃣ TARGET RESOURCE CONTEXT RESOLUTION
    let targetTenant = 
      req.headers['x-tenant-id'] || 
      req.body?.tenantMapping || 
      req.body?.tenantId || 
      req.query?.tenantMapping || 
      req.query?.tenantId || 
      req.params?.tenantId;

    if (!targetTenant && userTenant) {
        targetTenant = userTenant;
    }

    console.log(`[TENANT GUARD] Verifying: UserTenant=${userTenant}, TargetTenant=${targetTenant}, Role=${userRole}`);

    // 🔥 SUPER ADMIN BYPASS FIX
    // Agar user super-admin hai, toh usko cross-tenant restrictions se azaad rakho
    if (userRole === 'super-admin' || userRole === 'superadmin') {
      const activeTenantKey = (targetTenant || userTenant || 'GLOBAL-MASTER').toString().trim().toUpperCase();
      req.tenantMapping = activeTenantKey;
      req.tenantId = activeTenantKey;
      console.log(`✅ [TENANT GUARD] Super Admin Bypass Granted for Target: ${activeTenantKey}`);
      return next();
    }

    // 3️⃣ INTEGRITY BOUNDARY VERIFICATION
    if (!userTenant || !targetTenant) {
      return res.status(400).json({
        success: false,
        message: 'Security Violation: Tenant identification context missing in transmission pipeline.'
      });
    }

    // 4️⃣ CROSS-TENANT ACCESS CONTROL LOOP DETECTOR
    if (userTenant.toString().toUpperCase().trim() !== targetTenant.toString().toUpperCase().trim()) {
      return res.status(403).json({
        success: false,
        message: 'Security Violation Exception: Cross-Tenant Data Access Request Denied.'
      });
    }

    // 🔥 DYNAMIC TERMINAL INJECTION MAPPING
    const cleanTenantKey = userTenant.toString().trim().toUpperCase();
    req.tenantMapping = cleanTenantKey;
    req.tenantId = cleanTenantKey; 

    next();
  } catch (error) {
    console.error("Middleware Crash Details:", error);
    return res.status(500).json({ 
      success: false, 
      message: 'Critical error triggered inside core multi-tenant security barrier layer.', 
      error: error.message 
    });
  }
};

module.exports = { verifyTenantAccess };