const express = require("express");
const router = express.Router();

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, User, Review, SpotImage, sequelize, ReviewImage, Booking } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const spot = require("../../db/models/spot");
const { json } = require("sequelize");
const { Op } = require('sequelize');


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

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .isIn([1, 2, 3, 4, 5])
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
];

const validateBooking = [
    check("startDate")
        .exists({ checkFalsy: true }),
    // .withMessage("Review text is required"),
    check("endDate")
        .isAfter(new Date().toISOString())
        .withMessage("endDate cannot come before startDate"),
    handleValidationErrors,
];

const authorizationCatch = (err, req, res, next) => {
    res.status(403)
        .setHeader('Content-Type', 'application/json')
        .json({
            message: 'Forbidden'
        })
}


//Get Spots

router.get("/", async (req, res) => {
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



//by current User
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const spots = await Spot.findAll({
        where: { ownerId: userId },
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

    const spot = await Spot.findOne({ where: { id: spotId } });

    if (spot && spot.ownerId === req.user.id) {
        const spotImage = await SpotImage.create({ spotId, url, preview });

        const { updatedAt, createdAt, ...response } = spotImage.toJSON();
        delete response.spotId;

        return res.json(response);
    } else if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    } else if (spot && spot.ownerId !== req.user.id) {
        next(err)
    }

}, authorizationCatch);

// Edit a spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    // const { spotId } = req.params;
    const spotId = req.params.spotId;
    const spot = await Spot.findOne({ where: { id: spotId } });
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    } else if (spot && spot.ownerId !== req.user.id) {
        next(err)
    }
    const updatedSpot = await spot.update({ address, city, state, country, lat, lng, name, description, price });
    res.json(updatedSpot);
}, authorizationCatch);

//Delete a spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    const spotId = req.params.spotId;
    const { user } = req;
    const findOwner = await Spot.findByPk(spotId)
    const deletedSpot = await Spot.destroy({
        where: {
            id: spotId, ownerId: req.user.id
        }
    })

    if (!findOwner) return res.status(404).json({ message: "Spot couldn't be found" })
    else if (deletedSpot) {
        return res.status(200).json({ message: "Successfully deleted" })
    } else if (findOwner && findOwner.ownerId !== req.user.id) {
        next(err)
    }

}, authorizationCatch);


//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
    const options = {
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            },
        ],
        where: { spotId: req.params.spotId }
    };
    const reviews = await Review.findAll(options);

    // Check if any reviews are found
    if (reviews.length === 0) {
        return res.status(404).json({ message: 'Spot not found' });
    }

    for (let i = 0; i < reviews.length; i++) {
        const review = reviews[i].toJSON();
        if (review.Spot) {
            reviews[i] = review;
            review.Spot.previewImage = review.Spot.SpotImages[0].url;
            delete review.Spot.SpotImages;
        }
    }

    res.json({ Reviews: reviews });
});

//Create a review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
    const { review, stars } = req.body;
    const spotId = req.params.spotId;
    const userId = req.user.id;

    const oldReview = await Review.findOne({ where: { userId: req.user.id, spotId: req.params.spotId } });
    if (oldReview) {
        return res.status(500).json({
            message: "User already has a review for this spot"
        })
    }


    const spot = await Spot.findOne({ where: { id: spotId } });

    if (spot) {
        const newReview = await Review.create({ userId, spotId, review, stars });


        return res.json(newReview);

    } else if (res.status(404)) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

});

//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId)
    const bookingObj = {}
    let bookingArr = []
    let result = []
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId === req.user.id) {
        const bookings = await Booking.findAll({
            where: { spotId: req.params.spotId },
            include: { model: User, attributes: ['id', 'firstName', 'lastName'] }
        })
        bookings.forEach(booking => {
            bookingArr.push(booking.toJSON())
        })
        bookingArr.forEach((ele) => {
            let bookingList = {};
            bookingList.User = ele.User;
            bookingList.id = ele.id;
            bookingList.spotId = ele.spotId;
            bookingList.userId = ele.userId;
            bookingList.startDate = ele.startDate;
            bookingList.endDate = ele.endDate;
            bookingList.createdAt = ele.createdAt;
            bookingList.updatedAt = ele.updatedAt;
            result.push(bookingList);
        });

        res.json({ Bookings: result })
    } else {
        const bookings = await Booking.findAll({
            where: { spotId: req.params.spotId },
            attributes: ['spotId', 'startDate', 'endDate'] // Only these attributes will be returned
        })

        res.json({ Bookings: bookings })
    }
});


// Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const { startDate, endDate } = req.body;
    const spotId = req.params.spotId;
    const userId = req.user.id;



    const oldBooking = await Booking.findOne({
        where: {
            spotId: spotId,
            [Op.or]: [
                {
                    startDate: {
                        [Op.between]: [startDate, endDate],
                    },
                },
                {
                    endDate: {
                        [Op.between]: [startDate, endDate],
                    },
                },
                {
                    [Op.and]: [
                        { startDate: { [Op.lte]: startDate } },
                        { endDate: { [Op.gte]: endDate } },
                    ],
                },
            ],
        },
    });


    const spot = await Spot.findOne({ where: { id: spotId } });

    if (!spot) return res.status(404).json({ message: "Spot couldn't be found" })

    if (spot && spot.ownerId === req.user.id) return next(err)
    if (spot && spot.ownerId !== req.user.id) {
        if (oldBooking) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking"
                }
            });
        } else {
            const newBooking = await Booking.create({ spotId, userId, startDate, endDate });
            return res.json(newBooking);
        }

    }

}, authorizationCatch);






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
