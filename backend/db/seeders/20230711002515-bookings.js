'use strict';
const { Booking } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: "1984-11-19",
        endDate: "2023-11-19"
      },
      {
        spotId: 2,
        userId: 2,
        startDate: "2021-11-19",
        endDate: "2022-11-30"
      },
      {
        spotId: 3,
        userId: 3,
        startDate: "2022-09-07",
        endDate: "2022-09-11"
      },
    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Bookings', {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
