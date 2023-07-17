// 'use strict';
// const { ReviewImage } = require('../models')

// let options = {};
// if (process.env.NODE_ENV === 'production') {
//   options.schema = process.env.SCHEMA;  // define your schema in options object
// }

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await ReviewImage.bulkCreate([
//       {
//         reviewId: 1,
//         url: "image url"
//       },
//       {
//         reviewId: 2,
//         url: "image url"
//       }
//     ], { validate: true })
//   },

//   async down(queryInterface, Sequelize) {
//     options.tableName = 'ReviewImages'
//     const Op = Sequelize.Op;
//     return queryInterface.bulkDelete(options, {
//       reviewId: { [Op.in]: [1, 2] }
//     }, {});
//   }
// };

'use strict';
const { ReviewImage } = require('../models');
const bcrypt = require("bcryptjs");


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: 'http://www.userId1reviewId1.com'


      },


      {
        reviewId: 2,
        url: 'http://www.alsouserId1reviewId2.com'


      },
      {
        reviewId: 3,
        url: 'http://www.userId2reviewId3.com'


      },
      {
        reviewId: 4,
        url: 'http://www.userId2reviewId4.com'


      },


      {
        reviewId: 5,
        url: 'http://www.userId3reviewId5.com'


      },
      {
        reviewId: 6,
        url: 'http://www.userId3reviewId6.com'


      },])
  },


  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
