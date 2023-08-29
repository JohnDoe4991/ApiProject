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
        ownerId: 2,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "Amazing Welcoming Unique Ocean Home",
        description: "My exceptionally beautiful, welcoming home with a breathtaking close-up ocean view provides a perfect spot for your romantic getaway, artist retreat or small family gathering. Come sit in the garden and watch the waves roll in or sit in the hot tub in the moonlight. 3 min walk to Beach, 20 min drive to San Francisco. My home is the top floor of the building. It has a completely separate entrance and living space. Driveway, yard, hot tub are shared. No pets, smoking or big parties.",
        price: 421.00,
      },
      {
        ownerId: 3,
        address: "123 App Lane",
        city: "Santa Cruz",
        state: "California",
        country: "United States of America",
        lat: 35.7645358,
        lng: -122.4730327,
        name: "180°OceanView+HotTub+EBikes+Surfboards+SUPS+Kayak",
        description: "Incredible beach home with sweeping views of the ocean. Watch the waves crash from your bed. Directly in front of Pleasure Point, a world class surf spot. 180° upstairs decks to lounge & enjoy the ocean and views of the ocean from every room in the home. Hot tub, cedar sauna, 4 electric bikes, surfboards, stand - up paddle boards, sea kayak, ping pong table, basketball arcade game, and dart board.",
        price: 699.00,
      },
      {
        ownerId: 4,
        address: "123 Pixar Lane",
        city: "Stinson Beach",
        state: "California",
        country: "United States of America",
        lat: 40.7645358,
        lng: -127.4730327,
        name: "Comfortable updated beach house in Stinson Beach",
        description: "Feel at home on the beach....walk right out to sand. 7 guests max. Comfortable, cozy beachfront dog-friendly home w/ open great room for your family to enjoy the priceless views of sand and surf. 3 BR/2 baths +enclosed outdoor shower. 1 dog welcome, $75/dog - charged separately once your booking is confirmed and accepted by the host. (No cats please).",
        price: 805.00,
      },
      {
        ownerId: 5,
        address: "123 Miller Lane",
        city: "San Rafael",
        state: "California",
        country: "United States of America",
        lat: 40.7645358,
        lng: -127.4730327,
        name: "BAY VIEW BUNGALOW ON WATERFRONT 15 MIN 2 GG BRIDGE",
        description: "FANTASTIC STUDIO BUNGALOW TUCKED ON A SECLUDED WATERFRONT ENCLAVE! ONE LARGE ROOM & SEPARATE BATH. SUPER COMFY ADJUSTABLE QUEEN BED. DECK WITH DIRECT ACCESS TO THE BAY. SPECTACULAR VIEWS! MAX. 2 GUESTS-MUST BE IDENTIFIED AT BOOKING. (NO KITCHEN-Kitchenette only, see details below). NO SMOKING (Entire property inside & exterior is non-smoking). No children under 12 yrs. NO PETS. 50+ STEPS To Unit / There is NO DISABLED ACCESS. **MAXIMUM STAY IS 5 NIGHTS** (Sorry, but No Exceptions).",
        price: 173.00,
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
