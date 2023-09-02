import React, { useState, useEffect } from "react";
import { useHistory, } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSpotThunk, getDetailsThunk, updateThunker } from "../../../../store/spots";
import "./spotform.css";

export default function SpotForm({ formType, spotId }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector((state) => state.session.user);
    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [lat, setLat] = useState(1);
    const [lng, setLng] = useState(1);
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [previewImg, setPreviewImg] = useState("");
    const [image1, setImage1] = useState("");
    const [image2, setImage2] = useState("");
    const [image3, setImage3] = useState("");
    const [image4, setImage4] = useState("");
    const [validationObject, setValidationObject] = useState({});


    useEffect(() => {
        if (formType === 'Edit' && spotId) {
            dispatch(getDetailsThunk(spotId))
                .then(data => {

                    setAddress(data.address);
                    setCity(data.city);
                    setState(data.state);
                    setCountry(data.country);
                    setLat(data.lat);
                    setLng(data.lng);
                    setName(data.name);
                    setDescription(data.description);
                    setPrice(data.price);
                })
        }
    }, [spotId, formType]);



    const validateCommonFields = () => {
        const errors = {};

        if (!address) errors.address = "Address is required";
        if (!country) errors.country = "Country is required";
        if (!city) errors.city = "City is required";
        if (!state) errors.state = "State is required";
        // if (!lat) errors.lat = "Latitude is required";
        // if (!lng) errors.lng = "Longitude is required";
        if (!name) errors.name = "Name is required";
        if (description.length < 30) errors.description = "Description needs a minimum of 30 characters";
        if (!price) errors.price = "Price is required";

        return errors;
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        let errorsObj = validateCommonFields();
        if (formType === "Create" && !previewImg)
            errorsObj.previewImg = "Preview Image is required";

        if (Object.keys(errorsObj).length) {
            setValidationObject(errorsObj);
            return;
        }



        // const errorsObject = {};

        // if (!address) {
        //     errorsObject.address = "Address is required"
        // }
        // if (!city) {
        //     errorsObject.city = "City is required"
        // }
        // if (!state) {
        //     errorsObject.state = "State is required"
        // }
        // // if (!lng) {
        // //     errorsObject.lng = "Long required"
        // // }
        // // if (!lat) {
        // //     errorsObject.lat = "Lat required"
        // // }
        // if (!country) {
        //     errorsObject.country = "Country is required"
        // }
        // if (!name) {
        //     errorsObject.name = "Name is required"
        // }
        // if (description.length < 30) {
        //     errorsObject.description = "Description needs a minimum of 30 characters"
        // }
        // if (!price) {
        //     errorsObject.price = "Price is required"
        // }
        // if (formType === "Create") {

        //     if (!previewImg) {
        //         errorsObject.previewImg = "Preview Image is required"
        //     }
        // }
        // if (Object.keys(errorsObject).length) {
        //     setValidationObject(errorsObject)
        //     return;
        // }


        const imageUrls = [previewImg, image1, image3, image4];
        const imageExtensionsRegex = /\.(png|jpe?g)$/i;
        const invalidImages = imageUrls.filter((url) => url && !imageExtensionsRegex.test(url));
        if (invalidImages.length > 0) {
            const errorsObj = { ...validationObject };
            invalidImages.forEach((url, index) => {
                const fieldName = index === 0 ? 'previewImg' : `imageUrl${index}`;
                errorsObj[fieldName] = 'Image URL must end in .png, .jpg, or .jpeg';
            });
            setValidationObject(errorsObj);
            return;
        }

        const createdSpot = { id: spotId, address, city, state, country, lat, lng, name, description, price };

        let newSpotImage = [];
        const tempNewSpotImage = [
            { url: previewImg, preview: true },
            { url: image1, preview: false },
            { url: image2, preview: false },
            { url: image3, preview: false },
            { url: image4, preview: false },
        ];

        tempNewSpotImage.forEach((image) => { if (image.url) newSpotImage.push(image); });

        if (formType === "Create") {
            try {
                const freshSpot = await dispatch(createSpotThunk(createdSpot, newSpotImage, sessionUser));

                if (freshSpot.id) {
                    const newSpotAdded = await dispatch(getDetailsThunk(freshSpot.id))

                    history.push(`/spots/${newSpotAdded.id}`);
                } else {
                    return null;
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }

        if (formType === "Edit") {
            try {
                const fixedSpot = { id: spotId, address, city, state, country, lat, lng, name, description, price };
                const freshSpot = await dispatch(updateThunker(fixedSpot));
                console.log((`/spots/${freshSpot.id}`))
                if (freshSpot.id) {
                    history.push(`/spots/${freshSpot.id}`);
                } else {
                    return null;
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
    };


    const clearImageError = (fieldName) => {
        if (validationObject[fieldName]) {
            setValidationObject((prevState) => ({ ...prevState, [fieldName]: '' }));
        }
    };

    const solveError = (validationField) => {
        setValidationObject((prev) => {
            const newObj = { ...prev };
            delete newObj[validationField];
            return newObj;
        });
    };

    const handleInputChange = (setterFunction, validationField) => (e) => {
        setterFunction(e.target.value);
        solveError(validationField);
    };

    return (
        <div className="form-page-container">
            <form className="form-one-container"
                onSubmit={handleSubmit}>
                <div className="set-straight">
                    <h1>
                        {formType === "Create" ? "Create a new Spot" : "Update your Spot"}
                    </h1>
                    <h2>Where's your place located?</h2>
                    <p className="boo-guests">Guests will only get your exact address once they booked a reservation</p>
                    <label>
                        <div className="error">
                            <p>Country</p>
                            {validationObject.country && <p
                                className="errors"> {validationObject.country}</p>}
                        </div>
                        <input
                            type="text"
                            name="country"
                            className="fix-width"
                            placeholder="Country"
                            value={country}
                            // onChange={(e) => setCountry(e.target.value)}
                            onChange={handleInputChange(setCountry, "country")}
                            pattern="[^0-9]*"
                            title="Country should only contain letters"
                        />
                    </label>
                    <label>
                        <div className="error">
                            <p>Street Address</p>
                            {validationObject.address && <p
                                className="errors"> {validationObject.address}</p>}
                        </div>
                        <input
                            type="text"
                            name="address"
                            className="fix-width"
                            placeholder="Address"
                            value={address}
                            // onChange={(e) => setAddress(e.target.value)}
                            onChange={handleInputChange(setAddress, "address")}

                        />
                    </label>
                    <div className="city-state-inputs">
                        <label>
                            <div className="error">
                                <p>City</p>
                                {validationObject.city && <p
                                    className="errors"> {validationObject.city}</p>}
                            </div>
                            <input
                                type="text"
                                name="city"
                                className="city-city-bang-bang"
                                placeholder="City"
                                value={city}
                                // onChange={(e) => setCity(e.target.value)}
                                onChange={handleInputChange(setCity, "city")}
                                pattern="[^0-9]*"
                                title="City should only contain letters"
                            />
                        </label>
                        <label>
                            <div className="error">
                                <p> State</p>
                                {validationObject.address && <p
                                    className="errors"> {validationObject.address}</p>}
                            </div>
                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                className="state-input"
                                value={state}
                                // onChange={(e) => setState(e.target.value)}
                                onChange={handleInputChange(setState, "state")}
                                pattern="[^0-9]*"
                                title="State should only contain letters"
                            />
                        </label>
                    </div>
                    {/* <div className="city-state-inputs">
                        <label>
                            <div className="error">
                                <p>Latitude</p>
                                {validationObject.lat && <p
                                    className="errors"> {validationObject.lat}</p>}
                            </div>
                            <input
                                type="number"
                                name="lat"
                                className="city-city-bang-bang"
                                placeholder="Latitude"
                                value={lat}
                                onChange={(e) => setLat(e.target.value)}
                            />
                        </label>
                        <label>
                            <div className="error">
                                <p> Longitude</p>
                                {validationObject.lng && <p
                                    className="errors"> {validationObject.lng}</p>}
                            </div>
                            <input
                                type="number"
                                name="lng"
                                placeholder="Longitude"
                                value={lng}
                                onChange={(e) => setLng(e.target.value)}
                            />
                        </label>
                    </div> */}
                    <div className="describe-guests">
                        <hr></hr>
                        <h2>Describe your place to guests</h2>
                        <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
                        <textarea
                            type="text"
                            name="description"
                            placeholder="Please write at least 30 characters"
                            value={description}
                            // onChange={(e) => setDescription(e.target.value)}
                            onChange={handleInputChange(setDescription, "description")}
                        />
                        {validationObject.description && <p
                            className="desc-errors"> {validationObject.description}</p>}
                    </div>
                    <div className="make-title">
                        <hr></hr>
                        <h2>Create a title for your spot</h2>
                        <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                        <input
                            type="text"
                            name="name"
                            className="fix-width-one"
                            placeholder="Name of your spot"
                            value={name}
                            // onChange={(e) => setName(e.target.value)}
                            onChange={handleInputChange(setName, "name")}
                        />
                        {validationObject.name && <p
                            className="name-errors"> {validationObject.name}</p>}
                    </div>
                    <div className="set-price">
                        <hr></hr>
                        <h2>Set a base price for your spot</h2>
                        <p>Competitive pricing can help your listing stand out and ranck higher in search results.</p>
                        <div className="flex-it">
                            <div>$</div>
                            <input
                                type="number"
                                name="price"
                                className="fix-width"
                                placeholder="Price per night (USD)"
                                value={price}
                                // onChange={(e) => setPrice(e.target.value)}
                                onChange={handleInputChange(setPrice, "price")}
                            />
                        </div>
                        {validationObject.price && <p
                            className="price-errors"> {validationObject.price}</p>}
                        <hr></hr>
                    </div>
                    {formType === 'Create' && (

                        <div className="photo-url">
                            <h2>Liven up your spot with photos</h2>
                            <p>Submit a link to at least one photo to publish your spot</p>
                            <input
                                type="url"
                                name="previewImg"
                                placeholder="Preview image URL"
                                value={previewImg}
                                // onChange={(e) => {
                                //     setPreviewImg(e.target.value);
                                //     clearImageError('previewImg');
                                // }}
                                onChange={handleInputChange(setPreviewImg, "previewImg")}
                            />
                            {validationObject.previewImg && <p
                                className="photo-errors"> {validationObject.previewImg}</p>}
                            <input
                                type="url"
                                name="image1"
                                placeholder="Image URL"
                                value={image1}
                                // onChange={(e) => {
                                //     setImage1(e.target.value);
                                //     clearImageError('image1');
                                // }}
                                onChange={handleInputChange(setImage1, "image1")}
                            />
                            {validationObject.image1 && <p
                                className="photo-errors"> {validationObject.image1}</p>}
                            <input
                                type="url"
                                name="image2"
                                placeholder="Image URL"
                                value={image2}
                                // onChange={(e) => {
                                //     setImage2(e.target.value);
                                //     clearImageError('image2');
                                // }}
                                onChange={handleInputChange(setImage2, "image2")}
                            />
                            {validationObject.image2 && <p
                                className="photo-errors"> {validationObject.image2}</p>}
                            <input
                                type="url"
                                name="image3"
                                placeholder="Image URL"
                                value={image3}
                                // onChange={(e) => {
                                //     setImage3(e.target.value);
                                //     clearImageError('image3');
                                // }}
                                onChange={handleInputChange(setImage3, "image3")}
                            />
                            {validationObject.image3 && <p
                                className="photo-errors"> {validationObject.image3}</p>}
                            <input
                                type="url"
                                name="image4"
                                placeholder="Image URL"
                                value={image4}
                                // onChange={(e) => {
                                //     setImage4(e.target.value);
                                //     clearImageError('image4');
                                // }}
                                onChange={handleInputChange(setImage4, "image4")}
                            />
                            {validationObject.image4 && <p
                                className="photo-errors"> {validationObject.image4}</p>}
                        </div>
                    )}
                    <div className="create-ittt">
                        {"   "}
                        <hr></hr>
                        <button
                            type="submit"
                            disabled={Object.keys(validationObject).length > 0}
                        >
                            Create spot</button>
                    </div>
                </div>
            </form >
        </div >
    );
}
