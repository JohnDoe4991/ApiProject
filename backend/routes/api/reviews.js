const express = require("express");
const router = express.Router();

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, User, Review, SpotImage, sequelize, ReviewImage } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const spot = require("../../db/models/spot");
const { json } = require("sequelize");


const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .isIn([1, 2, 3, 4, 5])
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
];

const fixErrorProb = function (err, req, res, next) {
    res.status(401);
    res.setHeader('Content-Type', 'application/json')
    res.json(
        {
            message: "Authentication required"
        }
    );
};

const authMeAuthMe = (err, req, res, next) => {
    res.status(403)
        .setHeader('Content-Type', 'application/json')
        .json({
            message: 'Forbidden'
        })
}

const showValErr = (err, req, res, next) => {

    res.status(400)
    res.setHeader('Content-Type', 'application/json')
    res.json({
        message: "Bad Request",
        errors: err.errors
    })
}

//Get all reviews by current user
router.get('/current', requireAuth, fixErrorProb, async (req, res) => {
    const reviewList = await Review.findAll({
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: {
                    exclude: ['description', 'createdAt', 'updatedAt']
                },
                include: [
                    {
                        model: SpotImage,
                        attributes: ['id', 'url', 'preview']
                    }
                ]
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ],
        where: { userId: req.user.id }
    })


    let dudesReviews = [];
    reviewList.forEach(review => {
        dudesReviews.push(review.toJSON())
        dudesReviews.forEach(review => {
            review.Spot.SpotImages.forEach(spotImage => {
                if (spotImage.preview) {
                    review.Spot.previewImage = spotImage.url
                }
            })
            delete review.Spot.SpotImages
        })

        res.json({ Reviews: dudesReviews })
    })
});


// Add image to Review based on reviews id
router.post('/:reviewId/images', requireAuth, fixErrorProb, async (req, res) => {
    const image = req.body.url;
    console.log("image: ", image);
    const review = await Review.findByPk(req.params.reviewId, {
        include: [
            {
                model: ReviewImage
            }
        ]
    });

    if (!review) {
        res.status(404).json({
            message: "Review couldn't be found"
        });
        return;
    }

    if (review.userId !== req.user.id) {
        res.status(403).json({
            message: 'Forbidden'
        });
        return;
    }

    if (review.ReviewImages.length > 10) {
        res.status(403).json({
            message: "Maximum number of images for this resource was reached"
        });
        return;
    }

    const reviewImage = await ReviewImage.create({
        reviewId: review.id,
        url: image,
    });

    res.json({ id: reviewImage.id, url: reviewImage.url });
});


//Edit a review
router.put('/:reviewId', requireAuth, fixErrorProb, validateReview, showValErr, async (req, res) => {
    const { review, stars } = req.body;

    const reviewId = req.params.reviewId;
    const reviews = await Review.findOne({ where: { id: reviewId } });
    if (!reviews) {
        return res.status(404).json({ message: "Review couldn't be found" });
    } else if (reviews && reviews.userId !== req.user.id) {
        next(err)
    }
    const updatedReview = await reviews.update({ review, stars });
    res.json(updatedReview);
}, authMeAuthMe);

// Delete a review
router.delete('/:reviewId', requireAuth, fixErrorProb, async (req, res) => {
    const reviewId = req.params.reviewId;
    const { user } = req;
    const reviewOwner = await Review.findByPk(reviewId)
    const deletedReview = await Review.destroy({
        where: {
            id: reviewId, userId: req.user.id
        }
    })
    if (!reviewOwner) return res.status(404).json({ message: " Review couldn't be found" })
    else if (deletedReview) {
        return res.status(200).json({ message: "Successfully deleted" })
    } else if (reviewOwner && reviewOwner.reviewId !== req.user.id) {
        next(err)
    }


}, authMeAuthMe);







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
