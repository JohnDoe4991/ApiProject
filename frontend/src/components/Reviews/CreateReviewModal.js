import React, { useState, useEffect } from "react";
import "./review.css/CreateReview.css"
import { useDispatch, useSelector } from "react-redux";
import { createReviewThunk } from "../../store/reviews";
import { useModal } from "../../context/Modal"




export default function CreateReviewModal({ spotId, setReloadPage }) {
    const sessionUser = useSelector((state) => state.session.user);
    const { closeModal } = useModal();
    const dispatch = useDispatch()
    const [review, setReview] = useState("")
    const [stars, setStars] = useState(0)
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [disableSubmitButton, setdisableSubmitButton] = useState(true);
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
        setStars(stars)
        setSelectedStars(stars);
    };


    useEffect(() => {
        const errorsObject = {};

        if (review.length < 10) {
            errorsObject.review = "Review must be more than 10 characters."
        }

        if (!selectedStars) {
            errorsObject.selectedStars = "Please select a star rating"
        }



        setValidationObject(errorsObject)
    }, [selectedStars, review])

    useEffect(() => {
        setdisableSubmitButton(!(stars >= 1 && review.length >= 10));
    }, [stars, review]);



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await dispatch(createReviewThunk(spotId, review, stars));
            closeModal();
            setReloadPage(prevState => !prevState);
        } catch (error) {
            try {
                const data = await error.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                } else {
                    setMessage(data.message);
                }
            } catch (jsonError) {

                console.error('Error parsing JSON:', jsonError);
            }
        }
    };


    return (
        <>
            <form className="main-container-reviews"
                onSubmit={handleSubmit}>
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
            </form>
        </>
    )
}
