import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { thunkDeleteSpot } from "../../../store/spots";
import { getOwnerAllSpotsThunk } from "../../../store/spots";


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
            <div>
                <h1>Confirm Delete</h1>
                <p>This action cannot be undone.</p>
                <button onClick={deleteSpotCallBack}>Delete</button>
                <button onClick={closeModal}>Cancel</button>
            </div>
        </>
    );
}
