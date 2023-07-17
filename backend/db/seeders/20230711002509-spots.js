'use strict';
const { Spot } = require('../models')
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123.00,
      },
      {
        ownerId: 2,
        address: "123 App Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 35.7645358,
        lng: -122.4730327,
        name: "Neverland",
        description: "Magical place",
        price: 300.00,
      },
      {
        ownerId: 3,
        address: "123 Pixar Lane",
        city: "Alemeda",
        state: "California",
        country: "United States of America",
        lat: 40.7645358,
        lng: -127.4730327,
        name: "Zombieland",
        description: "Feed your hunger",
        price: 700.00,
      },
    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ["123 Disney Lane", "123 App Lane", "123 Pixar Lane"] }
    }, {});
  }
};

