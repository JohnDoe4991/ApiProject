const express = require("express");
const router = express.Router();

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, User, Review, SpotImage, sequelize, ReviewImage, Booking } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const spot = require("../../db/models/spot");
const { json } = require("sequelize");
const { application } = require("express");



const authorizationCatch = (err, req, res, next) => {
    res.status(403)
        .setHeader('Content-Type', 'application/json')
        .json({
            message: 'Forbidden'
        })
}

///Get all bookings
router.get("/current", requireAuth, async (req, res) => {
    const allBookings = await Booking.findAll({
        where: { userId: req.user.id },
        include: [
            {
                model: Spot,
                attributes: { exclude: ["createdAt", "updatedAt"] },
                include: [
                    {
                        model: SpotImage,
                    },
                ],
            },
        ],
    });

    const bookings = allBookings.map((booking) => {
        const bookingJSON = booking.toJSON();

        const previewImage = bookingJSON.Spot.SpotImages.find((spotImage) => spotImage.preview);
        bookingJSON.Spot.previewImage = previewImage ? previewImage.url : null;

        delete bookingJSON.Spot.SpotImages;

        return {
            id: bookingJSON.id,
            spotId: bookingJSON.spotId,
            Spot: bookingJSON.Spot,
            userId: bookingJSON.userId,
            startDate: bookingJSON.startDate,
            endDate: bookingJSON.endDate,
            createdAt: bookingJSON.createdAt,
            updatedAt: bookingJSON.updatedAt,
        };
    });

    res.json({Bookings: bookings});
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
