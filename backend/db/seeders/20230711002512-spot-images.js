'use strict';
const { SpotImage } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        "spotId": 1,
        "url": "https://a0.muscache.com/im/pictures/83738e60-4654-4faa-af1a-f53d02acbe6c.jpg?im_w=1200",
        "preview": true
      },
      {
        "spotId": 1,
        "url": "https://a0.muscache.com/im/pictures/feaae2d8-ff04-40f2-af8f-7d754f680024.jpg?im_w=720",
        "preview": false
      },
      {
        "spotId": 1,
        "url": "https://a0.muscache.com/im/pictures/71250762-2f08-4879-ada3-2b58903dfc18.jpg?im_w=720",
        "preview": false
      },
      {
        "spotId": 1,
        "url": "https://a0.muscache.com/im/pictures/5c598ec7-60e0-4505-bb7b-a8f12791d588.jpg?im_w=720",
        "preview": false
      },
      {
        "spotId": 1,
        "url": "https://a0.muscache.com/im/pictures/59a29025-d179-4c36-8dbc-6de882f0f0e1.jpg?im_w=720",
        "preview": false
      },
      {
        "spotId": 2,
        "url": "https://a0.muscache.com/im/pictures/miso/Hosting-38103188/original/84340fe9-0bab-4f9e-8c32-367e21b85066.jpeg?im_w=1200",
        "preview": true
      },
      {
        "spotId": 2,
        "url": "https://a0.muscache.com/im/pictures/ca513d07-75cb-4626-9ee2-44dafe21c1d2.jpg?im_w=720",
        "preview": false
      },
      {
        "spotId": 2,
        "url": "https://a0.muscache.com/im/pictures/miso/Hosting-38103188/original/fedf133f-8fa6-4ce9-b416-8cd447b7d1ce.jpeg?im_w=720",
        "preview": false
      },
      {
        "spotId": 2,
        "url": "https://a0.muscache.com/im/pictures/miso/Hosting-38103188/original/f38c6c31-b9fa-4adb-9af5-cf83efdb667e.jpeg?im_w=720",
        "preview": false
      },
      {
        "spotId": 2,
        "url": "https://a0.muscache.com/im/pictures/4ac39e10-eada-4d1f-95fb-70a76d350bec.jpg?im_w=720",
        "preview": false
      },
      {
        "spotId": 3,
        "url": "https://a0.muscache.com/im/pictures/4f8d1797-818a-426b-b0f0-2c7e6ab91a4d.jpg?im_w=1200",
        "preview": true
      },
      {
        "spotId": 3,
        "url": "https://a0.muscache.com/im/pictures/d24e98c7-3784-4f05-9d32-b3d3263d7f69.jpg?im_w=720",
        "preview": false
      },
      {
        "spotId": 3,
        "url": "https://a0.muscache.com/im/pictures/12d26724-afe6-47db-8c0a-25f7907b3021.jpg?im_w=720",
        "preview": false
      },
      {
        "spotId": 3,
        "url": "https://a0.muscache.com/im/pictures/d13b140d-fe00-44fe-bed6-a832c6ecfc8d.jpg?im_w=720",
        "preview": false
      },
      {
        "spotId": 3,
        "url": "https://a0.muscache.com/im/pictures/2e868569-00dd-40ba-9085-bb7ed6e6cd9b.jpg?im_w=720",
        "preview": false
      },
      {
        "spotId": 4,
        "url": "https://a0.muscache.com/im/pictures/71ec13d7-c611-44e1-ac94-bb2a8265af65.jpg?im_w=1200",
        "preview": true
      },
      {
        "spotId": 4,
        "url": "https://a0.muscache.com/im/pictures/c65c2579-c4d1-4c35-ab47-cd66f7740f05.jpg?im_w=720",
        "preview": false
      },
      {
        "spotId": 4,
        "url": "https://a0.muscache.com/im/pictures/be642ba4-0282-4671-9404-66d3fc573b85.jpg?im_w=720",
        "preview": false
      },
      {
        "spotId": 4,
        "url": "https://a0.muscache.com/im/pictures/364293f1-7d59-457a-a20e-f9000b232e2a.jpg?im_w=720",
        "preview": false
      },
      {
        "spotId": 4,
        "url": "https://a0.muscache.com/im/pictures/860cc2c6-17b7-4916-8131-16bef126e0e3.jpg?im_w=720",
        "preview": false
      }
    ]
      , { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
