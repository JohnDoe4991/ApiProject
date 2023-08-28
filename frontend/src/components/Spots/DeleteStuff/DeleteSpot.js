import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { thunkDeleteSpot } from "../../../store/spots";
import { getOwnerAllSpotsThunk } from "../../../store/spots";
import "../Spots.css/DeleteSpots.css"


export default function DeleteSpot({ spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const deleteSpotCallBack = async () => {
        await dispatch(thunkDeleteSpot(spotId));
        await dispatch(getOwnerAllSpotsThunk());
        closeModal();
    }

    return (
        <>
            <div className="delete-container">
                <h1 className="confirm-delete">Confirm Delete</h1>
                <p className="delete-writing">Are you sure you want to delete this spot from the listing? This action cannot be undone.</p>
                <button className="delete-da-bttn" onClick={deleteSpotCallBack}>Yes</button>
                <button className="cancel-delete" onClick={closeModal}>No</button>
            </div>
        </>
    );
}
