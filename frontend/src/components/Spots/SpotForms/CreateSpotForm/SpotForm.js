import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function SpotForm({ formtype, spotId }) {
    const history = useHistory();
    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("")
    const [title, setTitle] = useState("")
    const [price, setPrice] = useState(0)
    const [previewImg, setPreviewImg] = useState("")
    const [image, setImage] = useState("")


    return (
        <>
            <h1>Create a new Spot</h1>
            <h2>Where's your place located?</h2>
            <p>Guests will only get your exact address once they booked a reservation</p>
            <form>
                <div>
                    Country
                    <input
                    type="text"
                    name="country"
                    
                    ></input>
                </div>
            </form>
        </>
    )
};
