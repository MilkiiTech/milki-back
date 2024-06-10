const User = require("./user");
const Role = require("./role");
const Permission = require("./permission");
const Zone = require("../../structure/models/zone")
const Woreda = require("../../structure/models/woreda");
const Sector = require("../../structure/models/sector");
// Define the association of Users to Roles
Role.belongsToMany(User, { through: 'UsersRoles' });
User.belongsToMany(Role, { through: 'UsersRoles' });

// Define the association of Roles to Permissions
Role.belongsToMany(Permission, { through: 'RolePermission' });
Permission.belongsToMany(Role, { through: 'RolePermission' });

// Define Association Of Zone to Users

Zone.belongsTo(User, {as:"user"});
// Define Association to track Who created and updated Zone
Zone.belongsTo(User, {as:"createdBy"});
Zone.belongsTo(User, {as:"updatedBy"});
// Define Association of Woreda to Zone
Woreda.belongsTo(Zone, {as:"zone"});
Woreda.belongsTo(User, {as:"user"})
// Define Association to track Who created and updated Woreda
Woreda.belongsTo(User, {as:"createdBy"});
Woreda.belongsTo(User, {as:"updatedBy"});

// Define Association of Sector to Woreda and Zone
Zone.hasMany(Sector, { foreignKey: 'zone_id' });
Woreda.hasMany(Sector, { foreignKey: 'woreda_id' });

Sector.belongsTo(Zone, { foreignKey: 'zone_id' });
Sector.belongsTo(Woreda, { foreignKey: 'woreda_id' });
// Define Association to track Who created and updated Woreda
Sector.belongsTo(User, {as:"createdBy"});
Sector.belongsTo(User, {as:"updatedBy"});

module.exports = { User, Role, Permission, Zone, Woreda , Sector};



