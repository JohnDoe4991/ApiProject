import React, { useState, useEffect } from "react";
import "./review.css/CreateReview.css"
import { useSelector } from "react-redux";




export default function CreateReviewModal() {
    const sessionUser = useSelector((state) => state.session.user);
    const [review, setReview] = useState("")
    const [hoveredStars, setHoveredStars] = useState(0);
    const [selectedStars, setSelectedStars] = useState(0);
    const [validationObject, setValidationObject] = useState({})

    const handleMouseEnter = (stars) => {
        setHoveredStars(stars);
    };

    const handleMouseLeave = () => {
        setHoveredStars(0);
    };

    const handleStarClick = (stars) => {
        setSelectedStars(stars);
    };


    useEffect(() => {
        const errorsObject = {};

        if (review.length < 10) {
            errorsObject.review = "Review must be more than 10 characters."
        }

        if (sessionUser.review) {
            errorsObject.review = "Review already exists for this spot"
        }

        if (!selectedStars) {
            errorsObject.selectedStars = "Please select a star rating"
        }



        setValidationObject(errorsObject)
    }, [selectedStars, review])

    return (
        <>
            <div className="main-container-reviews">
                <h1 className="howty-stay">How was your stay?</h1>
                <div className="error-box">
                {validationObject.review && <p
                                className="errors-one"> {validationObject.review}</p>}
                                {validationObject.selectedStars && <p
                                className="errors-one"> {validationObject.selectedStars}</p>}
                                </div>
                <textarea
                    type="text"
                    name="review"
                    className="review-box"
                    placeholder="Leave your review here..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                />
                <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((stars) => (
                        <span
                            key={stars}
                            className={`star ${hoveredStars >= stars || selectedStars >= stars ? 'lit' : ''}`}
                            onMouseEnter={() => handleMouseEnter(stars)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleStarClick(stars)}
                        >
                            &#9733;
                        </span>
                    ))}
                    Stars
                </div>
                <button
                    type="submit"
                    className="submit-review"
                    disabled={Object.keys(validationObject).length > 0}
                >
                    Submit Your Review</button>
            </div>
        </>
    )
}
