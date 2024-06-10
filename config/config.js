var convict = require("convict");
convict.addFormat(require('convict-format-with-validator').ipaddress);

var config = convict({
    env: {
      doc: 'The application environment.',
      format: ['production', 'development', 'test'],
      default: 'development',
      env: 'NODE_ENV'
    },
    ip: {
      doc: 'The IP address to bind.',
      format: 'ipaddress',
      default: '127.0.0.1',
      env: 'IP_ADDRESS',
    },
    port: {
      doc: 'The port to bind.',
      format: 'port',
      default: 8080,
      env: 'PORT',
      arg: 'port'
    },
    db: {
      host: {
        doc: 'Database host name/IP',
        format: '*',
        default: '127.0.0.1',
        env: 'DB_HOST',
        arg: 'db-host'
      },
      port: {
        doc: 'Database port',
        format: 'port',
        default: 5432,
        env: 'DB_PORT',
        arg: 'db-port'
      },
      name: {
        doc: 'Database name',
        format: String,
        default: 'users',
        env: 'DB_NAME',
        arg: 'db-name'
      },
      user: {
        doc: 'Database user',
        format: String,
        default: 'postgres',
        env: 'DB_USER',
        arg: 'db-user'
      },
      password: {
        doc: 'Database password',
        format: String,
        default: '',
        env: 'DB_PASSWORD',
        arg: 'db-password',
        sensitive: true
      }
    },
    jwt: {
      secret: {
        doc: 'JWT Secret Key',
        format: String,
        default: 'secratekeys',
        env: 'JWT_SECRET',
        sensitive: true
      }
    },
    admins: {
      doc: 'Users with write access, or null to grant full access without login.',
      format: Array,
      nullable: true,
      default: null
    }
  });

// Load environment dependent configuration
var env = config.get('env');
config.loadFile('./config/' + env + '.json');

// Perform validation
config.validate({allowed: 'strict'});

module.exports = config;