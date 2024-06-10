const { Command } = require('commander');
const bcrypt = require('bcrypt');
console.log("registering an admin")
const path = require('path');
// const Role = require('../user/models/role');
const {Role, User, Permission}=require("../user/models/association")

const program = new Command();
console.log(program);

program
  .version('1.0.0')
  .description('Register an admin user')
  .requiredOption('-u, --username <username>', 'Username for the admin')
  .requiredOption('-e, --email <email>', 'Email for the admin')
  .requiredOption('-p, --password <password>', 'Password for the admin');

  async function registerAdmin() {
    try {
        program.parse(process.argv);
        const { username, email, password } = program.opts();

        let role = await Role.findOne({ where: { role_name: "SUPER_ADMIN" } });
        if (!role) {
            role = await Role.create({ role_name: "SUPER_ADMIN" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await User.create({ username, email, password: hashedPassword });

        // Associate the user with the role
        await user.addRole(role);
        await role.addUser(user);

        console.log('Admin user registered successfully');
    } catch (error) {
      console.log(error,"error");
        console.error('Error registering admin:', error);
    }
};

  registerAdmin()
  
