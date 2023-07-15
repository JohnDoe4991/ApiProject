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

const validateBooking = [
    check("startDate")
        .exists({ checkFalsy: true }),
    // .withMessage("Review text is required"),
    check("endDate")
        .isAfter(new Date().toISOString())
        .withMessage("endDate cannot come before startDate"),
    handleValidationErrors,
];

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
router.put("/:bookingId", async (req, res) => {
    const bookingId = req.params.bookingId;
    const { startDate, endDate } = req.body;
    const booking = await Booking.findByPk(bookingId);
    const updatedBooking = await booking.update({ startDate, endDate });

    if (booking && booking.userId !== req.user.id) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }
    if (!booking) return res.status(404).json({ message: "Booking couldn't be found" });
    let currentDate = new Date();
    if (new Date(booking.endDate).toISOString() < currentDate) {
        return res.status(403).json({ message: "Past bookings can't be modified" });
    }
    if (endDate < startDate) {
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                endDate: "endDate cannot come before startDate"
            }
        })
    }
    // const oldBooking = await Booking.findOne({
    //     where: {
    //         spotId: spotId,
    //         [Op.or]: [
    //             {
    //                 startDate: {
    //                     [Op.between]: [startDate, endDate],
    //                 },
    //             },
    //             {
    //                 endDate: {
    //                     [Op.between]: [startDate, endDate],
    //                 },
    //             },
    //             {
    //                 [Op.and]: [
    //                     { startDate: { [Op.lte]: startDate } },
    //                     { endDate: { [Op.gte]: endDate } },
    //                 ],
    //             },
    //         ],
    //     },
    // });
    // if (oldBooking) {
    //     return res.status(403).json({
    //         message: "Sorry, this spot is already booked for the specified dates",
    //         errors: {
    //             startDate: "Start date conflicts with an existing booking",
    //             endDate: "End date conflicts with an existing booking"
    //         }
    //     });
    // }



    res.json(updatedBooking);
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
