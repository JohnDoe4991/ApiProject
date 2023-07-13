'use strict';
const { Review, Spot } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        review: "This was an awesome spot!",
        stars: 5
      },
      {
        spotId: 1,
        userId: 2,
        review: "This place was cool!",
        stars: 4
      },
      {
        spotId: 2,
        userId: 2,
        review: "Waste of Money!",
        stars: 1
      },
      {
        spotId: 3,
        userId: 3,
        review: "Great Spot and great host",
        stars: 4
      },
    ], {})
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
