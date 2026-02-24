const { rolePermissions } = require('../config/permissions');

exports.hasPermission = (requiredPermission) => {

  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    const userRole = req.user.role;

    const permissions = rolePermissions[userRole] || [];

    if (!permissions.includes(requiredPermission)) {
      return res.status(403).json({
        message: 'Permission refusée'
      });
    }

    next();
  };
};