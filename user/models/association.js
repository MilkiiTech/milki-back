const User = require("./user");
const Role = require("./role");
const Permission = require("./permission");
const Zone = require("../../structure/models/zone")
const Woreda = require("../../structure/models/woreda");
const Sector = require("../../structure/models/sector");
const Group = require("../../structure/models/group")
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

// Define Association Of Sector and Users this association defines which User works in which Sector
Sector.hasMany(User, {foreignKey:'sector_id', as:"users"});
User.belongsTo(Sector, {foreignKey:'sector_id', as:"sector"});
// Define Association of Sector to Woreda and Zone
Sector.belongsTo(Zone, { foreignKey: 'zone_id' });
Sector.belongsTo(Woreda, { foreignKey: 'woreda_id' });
// Define Association to track Who created and updated Woreda
Sector.belongsTo(User, {as:"createdBy"});
Sector.belongsTo(User, {as:"updatedBy"});

// Group and User association 
Group.belongsTo(User, {as:"leader"});
Group.belongsTo(User, {as:"createdBy"});
Group.belongsTo(User, {as:"updatedBy"});
Group.belongsToMany(User, { through: 'GroupMembers', as: 'members' });

// Group and Sector Association
Sector.hasMany(Group, {foreignKey:'sector_id', as:"groups"});
Group.belongsTo(Sector, {foreignKey:'sector_id', as:"sector"});

module.exports = { User, Role, Permission, Zone, Woreda , Sector, Group};



