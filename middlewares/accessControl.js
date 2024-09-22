const Role = require("../user/models/role");
const Permission = require("../user/models/permission");
const config = require('../config/config');
const CustomError = require("../error/customError");
const jwt = require("jsonwebtoken");
// Check if the user has the required permission for a route
exports.checkPermission = (permission) => {
    return async (req, res, next) => {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(" ")[1];
  
      if (!token) {
        return res.status(403).json({ message: "Access denied" });
      }
      try {
        const user = jwt.verify(token, config.get('jwt.secret'));
  
        if (user.role.some(r=>r==="SUPER_ADMIN")) {
          req.user_id = user.user_id;
          req.role=user.role
          return next();
        }
  
        const role = await Role.findOne({
          where: { role_name: user.role },
          include: {
            model: Permission,
            as: "permissions"
          }
        });
      console.log(role.permissions);
      if (role && role.permissions.some(perm => perm.permission_name === permission)) {
        req.user_id = user.user_id;
        req.role=user.role;
        return next();
      } else {
          return res.status(403).json({ message: "Access denied" });
        }
      } catch (err) {
        console.error(err, "Error Has been Encountered");
        return res.status(403).json({ message: "Access denied" });
      }
    };
  };