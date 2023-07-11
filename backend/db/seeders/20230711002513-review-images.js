'use strict';
const { ReviewImage } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: "image url"
      },
      {
        reviewId: 2,
        url: "image url"
      }
    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('ReviewImages', {
      reviewId: { [Op.in]: [1, 2] }
    }, {});
  }
};
