const express = require("express");
const router = express.Router();

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, User, Review, SpotImage, sequelize } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const spot = require("../../db/models/spot");
const { json } = require("sequelize");


const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Name is required')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required')
        .isFloat({ min: 0 })
        .withMessage('Price must be a non-negative number'),
    handleValidationErrors
];


//Get Spots

router.get("/", async (req, res) => {
    const userId = req.user.id;
    const spots = await Spot.findAll({

        include: [
            {
                model: Review,
                attributes: ['stars']
            },
            {
                model: SpotImage,
                attributes: ['url', 'preview']
            },
        ]
    });

    let spotsList = processSpots(spots)
    res.json(spotsList);

})
// router.get('/', async (req, res) => {
//     const spots = await Spot.findAll({
//         include: [
//             {
//                 model: Review
//             },
//             {
//                 model: SpotImage
//             },
//         ]
//     })

// let spotsList = [];
// spots.forEach(spot => {
//     spotsList.push(spot.toJSON())
// })

// spotsList.forEach((ele) => {
//     let counter = 0;
//     let total = 0;

//     ele.Reviews.forEach((review) => {
//         counter += 1;
//         total += review.stars;
//     })

//     let image
//     ele.SpotImages.forEach((spotImage) => {
//         image = spotImage.url
//     });

//     const avgRating = total / counter;
//     const previewImage = image
//     ele.avgRating = avgRating;
//     ele.previewImage = previewImage
//     delete ele.Reviews
//     delete ele.SpotImages
// });



//by current User
router.get('/current', requireAuth, async (req, res) => {
    // const userId = req.user.id;
    const spots = await Spot.findAll({
        // where: { ownerId: userId },
        include: [
            { model: Review, attributes: ["stars"] },
            { model: SpotImage, attributes: ["url", "preview"] }
        ]
    });

    let spotsList = processSpots(spots)
    res.json(spotsList);
});

//get spot from an id
router.get('/:spotId', async (req, res) => {
    let realId = req.params.spotId
    let goal = await Spot.findByPk(realId, {
        include: [
            { model: Review },
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User,
                where: { id: realId },
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    })
    if (goal) {
        let goal2 = [goal]
        let newArray = []

        goal2.forEach((ele) => {

            newArray.push(ele.toJSON())
        })
        newArray.forEach((ele) => {

            let starsAmount = 0
            let starsCount = 0
            ele.Reviews.forEach((review) => {

                if (review.stars) {
                    starsAmount += review.stars
                    starsCount += 1
                }
            })
            if (starsAmount !== 0) {
                ele.numReviews = starsCount
                ele.avgStarRating = (starsAmount / starsCount)
            }
            else {
                ele.numReviews = starsCount
                ele.avgStarRating = 'This spot has no ratings'
            }
            delete ele.Reviews;
            let temporary2 = ele.User
            delete ele.User
            let temporary = ele.SpotImages
            delete ele.SpotImages;
            ele.SpotImages = temporary
            ele.Owner = temporary2

        })
        let [stripped] = newArray
        res.status(200)
        res.setHeader('Content-Type', 'application/json')
        res.json(stripped)
    }
    else {
        res.status(404)
        res.setHeader('Content-Type', 'application/json')
        res.json({
            message: "Spot couldn't be found"
        })
    }
})
// create a spot
router.post('/', requireAuth, validateSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const record = await Spot.create({ ownerId: req.user.id, address, city, state, country, lat, lng, name, description, price });
    res.json(record);
})

// add an image to a spot based on spotid
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const { url, preview } = req.body;
    const spotId = req.params.spotId;

    const spot = await Spot.findOne({ where: { id: spotId, ownerId: req.user.id } });

    if (spot) {
        const spotImage = await SpotImage.create({ spotId, url, preview });

        const { updatedAt, createdAt, ...response } = spotImage.toJSON();
        delete response.spotId;

        return res.json(response);
    } else {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }
});

// Edit a spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    // const { spotId } = req.params;
    const spotId = req.params.spotId;
    const spot = await Spot.findOne({ where: { id: spotId, ownerId: req.user.id } });
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }
    const updatedSpot = await spot.update({ address, city, state, country, lat, lng, name, description, price });
    res.json(updatedSpot);
});

//Delete a spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    const spotId = req.params.spotId;
    const { user } = req;
    const deletedSpot = await Spot.destroy({
        where: {
            id: spotId, ownerId: req.user.id
        }
    })

    if (!deletedSpot) return res.status(404).json({ message: "Spot couldn't be found" })

    return res.json({ message: "Successfully deleted" })
});


const processSpots = (spots) => {

    const processedSpots = spots.map((spot) => {

        const spotJSON = spot.toJSON();

        const avgRating = spotJSON.Reviews.reduce((sum, review) => sum + review.stars, 0) / spotJSON.Reviews.length;

        const previewImage = spotJSON.SpotImages.find((image) => image.preview === true);

        spotJSON.avgRating = avgRating || 0;
        spotJSON.previewImage = previewImage ? previewImage.url : "No spot image found";

        delete spotJSON.Reviews;
        delete spotJSON.SpotImages;

        return spotJSON;
    });



    return processedSpots;
}

function respondWithSpot404(res) {
    res.status(404).json({
        "message": "Spot couldn't be found",
    });
}




module.exports = router;
