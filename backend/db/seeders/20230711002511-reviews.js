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
      // {
      //   spotId: 1,
      //   userId: 2,
      //   review: "Decent spot, could be better.",
      //   stars: 3
      // },
      // {
      //   spotId: 1,
      //   userId: 3,
      //   review: "Not worth the hype, sadly.",
      //   stars: 2
      // },
      // {
      //   spotId: 1,
      //   userId: 4,
      //   review: "Had a great time, would recommend.",
      //   stars: 4
      // },
      // {
      //   spotId: 1,
      //   userId: 5,
      //   review: "Exceeded expectations! Will come back.",
      //   stars: 5
      // },
      // {
      //   spotId: 1,
      //   userId: 6,
      //   review: "Meh, didn't really impress me.",
      //   stars: 2
      // },
      // {
      //   spotId: 1,
      //   userId: 7,
      //   review: "Absolutely stunning! A must-visit.",
      //   stars: 5
      // },
      // {
      //   spotId: 1,
      //   userId: 8,
      //   review: "Had a good time. Enjoyed the vibe.",
      //   stars: 4
      // },
      // {
      //   spotId: 1,
      //   userId: 9,
      //   review: "Disappointing. Not what I expected.",
      //   stars: 2
      // },
      {
        spotId: 2,
        userId: 2,
        review: "Average spot, nothing special.",
        stars: 3
      },
      // {
      //   spotId: 2,
      //   userId: 3,
      //   review: "Mediocre experience, expected more.",
      //   stars: 2
      // },
      // {
      //   spotId: 2,
      //   userId: 4,
      //   review: "Had a terrible time. Disappointing.",
      //   stars: 1
      // },
      // {
      //   spotId: 2,
      //   userId: 5,
      //   review: "Horrible experience. Regret going.",
      //   stars: 1
      // },
      // {
      //   spotId: 2,
      //   userId: 6,
      //   review: "Not too bad, not too good either.",
      //   stars: 3
      // },
      // {
      //   spotId: 2,
      //   userId: 7,
      //   review: "Worth the visit, but not amazing.",
      //   stars: 4
      // },
      // {
      //   spotId: 2,
      //   userId: 8,
      //   review: "Disappointing. Expected more quality.",
      //   stars: 2
      // },
      // {
      //   spotId: 2,
      //   userId: 9,
      //   review: "Not my cup of tea. Unpleasant experience.",
      //   stars: 1
      // },
      {
        spotId: 3,
        userId: 2,
        review: "Good spot, but a bit overrated.",
        stars: 4
      },
      {
        spotId: 3,
        userId: 3,
        review: "Nice place to visit, enjoyed the ambiance.",
        stars: 3
      },
      {
        spotId: 3,
        userId: 4,
        review: "Solid experience. Worth checking out.",
        stars: 4
      },
      {
        spotId: 3,
        userId: 5,
        review: "Loved every moment. Great memories.",
        stars: 5
      },
      {
        spotId: 3,
        userId: 6,
        review: "Average spot, nothing extraordinary.",
        stars: 3
      },
      {
        spotId: 3,
        userId: 7,
        review: "Really enjoyed my time there.",
        stars: 4
      },
      {
        spotId: 3,
        userId: 8,
        review: "Could have been better. Good, not great.",
        stars: 3
      },
      {
        spotId: 3,
        userId: 9,
        review: "Not bad. Had its moments.",
        stars: 3
      },
      {
        spotId: 4,
        userId: 2,
        review: "Pleasantly surprised. Great atmosphere.",
        stars: 4
      },
      {
        spotId: 4,
        userId: 3,
        review: "Not my cup of tea, but others might like it.",
        stars: 2
      },
      {
        spotId: 4,
        userId: 4,
        review: "Average experience. Didn't stand out.",
        stars: 3
      },
      {
        spotId: 4,
        userId: 5,
        review: "Didn't meet my expectations. Just okay.",
        stars: 2
      },
      {
        spotId: 4,
        userId: 6,
        review: "Had a pleasant time. Nice ambiance.",
        stars: 4
      },
      {
        spotId: 4,
        userId: 7,
        review: "Fell short of what I hoped for.",
        stars: 3
      },
      {
        spotId: 4,
        userId: 8,
        review: "Fair experience. Not too impressed.",
        stars: 3
      },
      {
        spotId: 4,
        userId: 9,
        review: "Expected more. Not the best choice.",
        stars: 2
      }

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
