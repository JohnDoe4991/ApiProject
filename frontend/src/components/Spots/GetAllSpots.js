import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpotsThunk, getOwnerAllSpotsThunk } from "../../store/spots";
import { Link, useHistory, NavLink } from "react-router-dom";
import './Spots.css/GetAllSpots.css'
import OpenModalButton from "../OpenModalButton";
import DeleteSpot from "./DeleteStuff/DeleteSpot"


export default function GetAllSpots({ userSpots = false }) {

    const allSpotzArr = Object.values(useSelector((state) => (state.spots.allSpots ? state.spots.allSpots : [])));
    const sessionUser = useSelector((state) => state.session.user);
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        if (userSpots) {
            dispatch(getOwnerAllSpotsThunk())
        } else {
            dispatch(getAllSpotsThunk())
        }
    }, [dispatch, userSpots])

    console.log("Session User", sessionUser)
    console.log("allSpotz", allSpotzArr)

    const spotShow = userSpots ? allSpotzArr.filter((spot) => sessionUser.id === spot.ownerId) : allSpotzArr;
    const noShow = userSpots ? allSpotzArr.filter((spot) => sessionUser.id === spot.ownerId) : null;

    if (!allSpotzArr || !spotShow) return null;

    return (
        <>
            <div>
                <div className="spots-main-container">
                    {(userSpots && sessionUser) && (noShow === null || noShow.length <= 0) && (
                        <div className="owner-div manage-create-a-new-spot">
                            <h2 className="manage-spots-h1-tag">Manage Your Spots</h2>
                            <button className="owner-btn create-new-spot-btn">
                                <NavLink to="/spots/new" className="create-new-spot-owner" style={{ textDecoration: "none", color: "black", fontWeight: "bold"  }}>Create a New Spot</NavLink>
                            </button>
                        </div>
                    )}
                    {spotShow && spotShow.map((spot) => (
                        <div>
                            {userSpots && (
                                <h1 className="manager-spot">Manage Your Spots</h1>
                            )}
                            <Link
                                key={spot.id}
                                to={`/spots/${spot.id}`}
                                style={{ textDecoration: "none", color: "var(--black)" }}
                            >
                                <div className={`spot-container ${userSpots ? "noShow" : ""}`} title={spot.name}>
                                    <img
                                        src={spot.previewImage}
                                        className="spot-img"
                                        alt={spot.name}
                                    />
                                    <div className="spot-info-flex">

                                        <div className="spot-city-state-rating">
                                            <p>{`${spot.city}, ${spot.state}`}</p>
                                            <p className="night-price">
                                                <span className="price">${spot.price}</span> <span className="night-text">night</span>
                                            </p>
                                        </div>
                                        {spot.avgRating > 0 && <p className="rating1">★{spot.avgRating.toFixed(1)}</p>}
                                        {!spot.avgRating && <p className="new1">★New</p>}
                                    </div>
                                </div>
                            </Link>
                            {userSpots && <div className="manage-buttons">
                                <div className="update-delete" >
                                <button onClick={(e) => { history.push(`/spots/edit/${spot.id}`) }}>Update</button>
                                <OpenModalButton className="delete-it" buttonText="Delete" modalComponent={<DeleteSpot spotId={spot.id} />} />
                                </div>
                            </div>}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
