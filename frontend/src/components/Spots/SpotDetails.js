import React, { useEffect, useState, } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDetailsThunk } from "../../store/spots";


export default function SpotDetails() {
    const { spotId } = useParams();
    const dispatch = useDispatch()
    const thisSpot = useSelector((state) => state.spots.singleSpot ? state.spots.singleSpot : null);
    console.log("This Spot    ", thisSpot)

    useEffect(() => {
        dispatch(getDetailsThunk(spotId));

    }, [dispatch, spotId]);

    if (!thisSpot) {
        return null;
    }


    if (!thisSpot.id) {
        return null;
    }

    return (
        <>
            <div className="name+city">
                <h1>{thisSpot.name}</h1>
                <h2>{thisSpot.city}, {thisSpot.state}, {thisSpot.country}</h2>
            </div>
            <div className="photos">
                <div className="preview">
                    <img src={thisSpot.SpotImages[0].url} alt="Preview" />
                </div>
                {thisSpot.SpotImages.slice(1, 5).map((image, index) => (
                    <div className="other-photos" key={index}>
                        <img src={image.url} alt={`Image ${index}`} />
                    </div>
                ))}
            </div>
            <div className="footer">
                <div className="hosted-by">
                    <h3>Hosted by {thisSpot.User.firstName}{" "}{thisSpot.User.lastName}</h3>
                </div>
                <p>{thisSpot.description}</p>
                <div className="pay-me-container">
                    
                    <h3>{thisSpot.price}</h3>
                </div>
            </div>

        </>
    );
}
