import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkDeleteReview } from "../../store/reviews";
import { getOwnerAllSpotsThunk } from "../../store/spots";
import { getAllReviewsThunk } from "../../store/reviews";



export default function DeleteReview({ reviewId, spotId, setReloadPage }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();



    const deleteReviewCallBack = async () => {
        await dispatch(thunkDeleteReview(reviewId));
        await dispatch(getAllReviewsThunk(spotId))
        closeModal();
        setReloadPage(prevState => !prevState);
    }

    return (
        <>
            <div className="delete-container">
                <h1 className="confirm-delete">Confirm Delete</h1>
                <p className="delete-writing">Are you sure you want to delete this review?</p>
                <button className="delete-da-bttn" onClick={deleteReviewCallBack}>Yes (Delete Review) </button>
                <button className="cancel-delete" onClick={closeModal}>No (Keep Review)</button>
            </div>
        </>
    );
}
