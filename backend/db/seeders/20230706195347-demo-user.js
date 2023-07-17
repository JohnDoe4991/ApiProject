// 'use strict';

// const { User } = require('../models');
// const bcrypt = require("bcryptjs");

// let options = {};
// if (process.env.NODE_ENV === 'production') {
//   options.schema = process.env.SCHEMA;  // define your schema in options object
// }

// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await User.bulkCreate([
//       {
//         firstName: "Marlo",
//         lastName: "Stanfield",
//         email: 'demo@user.io',
//         username: 'Demo-lition',
//         hashedPassword: bcrypt.hashSync('password')
//       },
//       {
//         firstName: "Bill",
//         lastName: "Kennedy",
//         email: 'user1@user.io',
//         username: 'FakeUser1',
//         hashedPassword: bcrypt.hashSync('password2')
//       },
//       {
//         firstName: "George",
//         lastName: "Washington",
//         email: 'user2@user.io',
//         username: 'FakeUser2',
//         hashedPassword: bcrypt.hashSync('password3')
//       }
//     ], { validate: true });
//   },

//   async down(queryInterface, Sequelize) {
//     options.tableName = 'Users'
//     const Op = Sequelize.Op;
//     return queryInterface.bulkDelete(options, {
//       username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
//     }, {});
//   }
// };

'use strict';


const { User } = require('../models');
const bcrypt = require("bcryptjs");


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        id: 1,
        email: 'user1@gmail.com',
        username: 'user1',
        firstName: 'alexUserOne',
        lastName: 'lastNameuserOne',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        id:2,
        email: 'user2@gmail.com',
        username: 'user2',
        firstName: 'anasUserTwo',
        lastName: 'lastNameUserTwo',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        id: 3,
        email: 'user3@gmail.com',
        username: 'user3',
        firstName: 'JohnUserThree',
        lastName: 'lastNameUserThree',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], { validate: true });
  },


  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['user1', 'user2', 'user3'] }
    }, {});
  }
};

