const express = require("express");
const router = express.Router();

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, User, Review, SpotImage, sequelize, ReviewImage, Booking } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const spot = require("../../db/models/spot");
const { json } = require("sequelize");
const { application } = require("express");
const { Op } = require('sequelize');



const authorizationCatch = (err, req, res, next) => {
    res.status(403)
        .setHeader('Content-Type', 'application/json')
        .json({
            message: 'Forbidden'
        })
}

const validateBooking = [
    check("startDate")
        .exists({ checkFalsy: true }),
    // .withMessage("Review text is required"),
    check("endDate")
        .isAfter(new Date().toISOString())
        .withMessage("endDate cannot come before startDate"),
    handleValidationErrors,
];

const catchErrors = (statusCode, message, data = {}, res) => {
    return res.status(statusCode).json({ message, ...data });
};

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

    res.json({ Bookings: bookings });
});

//Edit a Booking
router.put("/:bookingId", requireAuth, async (req, res, next) => {
    const { startDate, endDate } = req.body;

    const bookingId = req.params.bookingId;
    const spotId = req.params.spotId;
    const userId = req.user.id;

    const booking = await Booking.findByPk(bookingId);
    if (!booking) return catchErrors(404, "Booking couldn't be found", {}, res);


    const checkingPreviousStartDate = await Booking.findAll({
        where: {
            spotId: booking.spotId,
            startDate: { [Op.between]: [startDate, endDate] }
        }
    })
    const checkingPreviousEndDate = await Booking.findAll({
        where: {
            spotId: booking.spotId,
            endDate: { [Op.between]: [startDate, endDate] }
        }
    })
    const currentDate = new Date();


    if (booking.userId != req.user.id) return catchErrors(403, 'Forbidden', {}, res);
    if (new Date(booking.endDate) < currentDate) return catchErrors(403, "Past bookings can't be modified", {}, res);
    if (endDate < startDate) return catchErrors(400, 'Bad Request', { errors: { endDate: "endDate cannot come before startDate" } }, res);




    if (checkingPreviousStartDate.length > 0 && checkingPreviousEndDate.length === 0) {
        return catchErrors(403, 'Sorry, this spot is already booked for the specified dates', { errors: { endDate: "End date conflicts with an existing booking" } }, res);
    }
    else if (checkingPreviousStartDate.length === 0 && checkingPreviousEndDate.length > 0) {
        return catchErrors(403, 'Sorry, this spot is already booked for the specified dates', { errors: { startDate: "Start date conflicts with an existing booking" } }, res);
    }
    else if (checkingPreviousStartDate.length === 0 && checkingPreviousEndDate.length === 0) {
        const updatedBooking = await booking.update({ startDate, endDate });
        return res.json(updatedBooking);
    }
    else {
        return catchErrors(403, 'Sorry, this spot is already booked for the specified dates', { errors: { startDate: "Start date conflicts with an existing booking", endDate: "End date conflicts with an existing booking" } }, res);
    }
});

router.delete('/:bookingid', requireAuth, async (req, res) => {
    const bookingId = req.params.bookingId;
    const { user } = req;
    

})




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
