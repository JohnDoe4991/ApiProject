// 'use strict';
// const { SpotImage } = require('../models');
// let options = {};
// if (process.env.NODE_ENV === 'production') {
//   options.schema = process.env.SCHEMA;  // define your schema in options object
// }

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//   await SpotImage.bulkCreate([
//     {
//       spotId: 1,
//       url: "/images/airbnb",
//       preview: true
//     },
//     {
//       spotId: 2,
//       url: "/images/apple",
//       preview: false
//     },
//     {
//       spotId: 3,
//       url: "/images/orange",
//       preview: true
//     },
//   ], {validate: true})
//   },

//   async down (queryInterface, Sequelize) {
//     options.tableName = 'SpotImages'
//     const Op = Sequelize.Op;
//     return queryInterface.bulkDelete(options, {
//       spotId: { [Op.in]: [1, 2, 3] }
//     }, {});
//   }
// };

'use strict';
const { SpotImage } = require('../models');
const bcrypt = require("bcryptjs");


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'http://www.thisIsForSpot1ownedByuser1.com',
        preview: true,




      },
      {
        spotId: 2,
        url: 'http://www.thisIsForSpot2OwnedByUser2.com',
        preview: true,




      },
      {
        spotId: 3,
        url: 'http://www.thisIsForSpot3OwnedByUser3.com',
        preview: true,




      },])
  },


  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName='SpotImages'
    const Op=Sequelize.Op;
    await queryInterface.bulkDelete(options,{
      spotId: {[Op.in]:[1,2,3]}
    },{})
  }
};

