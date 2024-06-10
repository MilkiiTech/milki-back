const { Command } = require('commander');
const bcrypt = require('bcrypt');
const Role = require("../user/models/role");
const fs = require('fs');
const path = require('path');
const Permission = require("../user/models/permission");
const program = new Command();

// Define the path to your JSON file
const filePath = path.join(__dirname, 'role.json');

async function createPermission() {
    try {
        // Asynchronously read the JSON file
        const data = await fs.promises.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        
        // create permissions 
        jsonData?.permissions.forEach(async permission => {
          for (let key in permission) {
            if (permission.hasOwnProperty(key)) {
              console.log(`${key}: ${permission[key]}`);
              try {
              await Permission.create({permission_name:permission[key]});
                
              } catch (error) {
                console.log(console.log(`${key}: ${permission[key]}`))
              }
            }
          }
        });

        // create Roles for Users

        jsonData?.roles.forEach(async role => {
          try {
          await Role.create({role_name:role});
            
          } catch (error) {
            console.error(`Role Name ${role}`);
          }
        });

        console.log('Role and Permission Created successfully');
    } catch (error) {
        console.error('Error registering roles and permissions:', error);
    }
}

createPermission();
