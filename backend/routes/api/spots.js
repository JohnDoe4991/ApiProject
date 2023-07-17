const express = require("express");
const router = express.Router();

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, User, Review, SpotImage, sequelize, ReviewImage, Booking } = require("../../db/models");

const { check, validationResult } = require("express-validator");
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

const validateQueryParams = [
    check('page')
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage('Page must be an integer between 1 and 10'),
    check('size')
        .optional()
        .isInt({ min: 1, max: 20 })
        .withMessage('Size must be an integer between 1 and 20'),
    check('minLat')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Minimum latitude is invalid'),
    check('maxLat')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Maximum latitude is invalid'),
    check('minLng')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Minimum longitude is invalid'),
    check('maxLng')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Maximum longitude is invalid'),
    check('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be greater than or equal to 0'),
    check('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be greater than or equal to 0'),
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

const authCatch = (err, req, res, next) => {
    res.status(401)
        .setHeader('Content-Type', 'application/json')
        .json({
            message: "Authentication required"
        })
};

const handleDaError = (statusCode, message, data = {}, res) => {
    return res.status(statusCode).json({ message, ...data });
  };

const authMeAuthMe = (err, req, res, next) => {
    res.status(403)
        .setHeader('Content-Type', 'application/json')
        .json({
            message: 'Forbidden'
        })
};

const showErrors = (err, req, res, next) => {

    res.status(400)
    res.setHeader('Content-Type', 'application/json')
    res.json({
        message: "Bad Request",
        errors: err.errors
    })
}

const fixErrorProb = function (err, req, res, next) {
    res.status(401);
    res.setHeader('Content-Type', 'application/json')
    res.json(
        {
            message: "Authentication required"
        }
    );
};


const queryParm = (err, req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorResponse = {
            message: 'Bad Request',
            errors: err.errors,
        };

        return res.status(400).json(errorResponse);
    }

    next();
};





//by current User
router.get('/current', requireAuth, fixErrorProb, async (req, res) => {
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
router.post('/', requireAuth, fixErrorProb, validateSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const record = await Spot.create({ ownerId: req.user.id, address, city, state, country, lat, lng, name, description, price });
    res.json(record);
})

// add an image to a spot based on spotid
router.post('/:spotId/images', requireAuth, fixErrorProb, async (req, res) => {
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

}, authMeAuthMe,);

// Edit a spot
router.put("/:spotId", requireAuth, validateSpot, showErrors, async (req, res) => {

    const spotId = req.params.spotId;

    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spot = await Spot.findOne({ where: { id: spotId } });

    if(spot && spot.ownerId === req.user.id) {
      const updatedSpot = await spot.update({ address, city, state, country, lat, lng, name, description, price });
      res.json(updatedSpot);
    } else if (!spot) {
      return handleDaError(404, "Spot couldn't be found", {}, res);
    } else if (spot && spot.ownerId !== req.user.id) {
      next(err)
    }
}, authMeAuthMe);

//Delete a spot
router.delete('/:spotId', requireAuth, fixErrorProb, async (req, res) => {
    const spotId = req.params.spotId;
    const { user } = req;
    const findOwner = await Spot.findByPk(spotId)
    const deletedSpot = await Spot.destroy({
        where: {
            id: spotId, ownerId: req.user.id
        }
    })

    if (!findOwner) return res.status(404).json({ message: "Spot couldn't be found" })
    else if (findOwner && findOwner.ownerId !== req.user.id) {
        next(err)
    } else if (deletedSpot) {
        return res.status(200).json({ message: "Successfully deleted" })
    }

}, authMeAuthMe);


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
router.post('/:spotId/reviews', requireAuth, fixErrorProb, validateReview, async (req, res) => {
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
router.get('/:spotId/bookings', requireAuth, fixErrorProb, async (req, res) => {
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
router.post('/:spotId/bookings', requireAuth, fixErrorProb, async (req, res) => {
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

}, authMeAuthMe);

//Get Spots

router.get("/", validateQueryParams, queryParm, async (req, res) => {

    let { page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;


    const spots = await Spot.findAll({

        ...getPagination(req.query),
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

    let spotsList = processSpots(spots);
    return res.json({ Spots: spotsList, page, size });
});

//Helper functions
const processSpots = (spots) => {

    return spots.map((spot) => {

        spot = spot.toJSON();

        const avgRating = spot.Reviews.reduce((sum, review) => sum + review.stars, 0) / spot.Reviews.length;

        const previewImage = spot.SpotImages.find((image) => image.preview === true);

        spot.avgRating = avgRating || 0;
        spot.previewImage = previewImage ? previewImage.url : "No spot image found";

        delete spot.Reviews;
        delete spot.SpotImages;

        return spot;
    });
}

const getPagination = (queryParams) => {
    let { page, size } = queryParams;

    page = page === undefined ? 1 : parseInt(page);
    size = size === undefined ? 20 : parseInt(size);
    const limit = parseInt(size, 20);
    const offset = (parseInt(page, 20) - 1) * limit;

    return { limit, offset };
};



module.exports = router;
