import { csrfFetch } from "./csrf";



// types

const GET_ALL_SPOTS = "/get_all_spots"; //read. // GET spots/
const GET_ALL_SPOTS_OF_CURRENT_USER = "/get_all_spots_of_user"; //read. // GET spots/
const GET_SPOT_DETAILS = "/spot_details"
const CREATE_SPOT = "/create_spot"
const DELETE_SPOT = "/delete_spot"
const UPDATE_SPOT = "/update_spot"



//action creator

const actionGetSpots = (spots) => ({ type: GET_ALL_SPOTS, spots });
const actionGetAllOwnerSpots = (spots) => ({ type: GET_ALL_SPOTS_OF_CURRENT_USER, spots });
const actionGetSpotDetails = (spot) => ({ type: GET_SPOT_DETAILS, spot })
const actionCreateSpot = (spot) => ({ type: CREATE_SPOT, spot })
const actionDeleteSpot = (id) => ({ type: DELETE_SPOT, id })


//Thunks


//getAllSpotsThunk
// these functions hit routes
export const getAllSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  // const res = await fetch("/api/spots");

  if (res.ok) {
    const { Spots } = await res.json(); // { Spots: [] }
    // do the thing with this data
    dispatch(actionGetSpots(normalizeArr(Spots)));
    // dispatch(getAllSpots(Spots))
    return Spots;
  } else {
    const errors = await res.json();
    return errors;
  }
};
// getOwnerAllSpotsThunk
// these functions hit routes
export const getOwnerAllSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots/current");

  if (res.ok) {
    const Spots = await res.json(); // { Spots: [] }
    dispatch(actionGetAllOwnerSpots(Spots));
    return Spots;
  } else {
    const errors = await res.json();

    return errors;
  }
};


export const getDetailsThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);

  if (res.ok) {
    const Spot = await res.json();
    dispatch(actionGetSpotDetails(Spot));

    return Spot;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const createSpotThunk = (newSpot, newSpotImage, sessionUser) => async (dispatch) => {

  const res = await csrfFetch("/api/spots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newSpot),
  })

  if (res.ok) {
    const newlyCreateSpot = await res.json();

    const newImagesRes = await Promise.all(newSpotImage.map(async (imageObj) => {
      const imageRes = await csrfFetch(`/api/spots/${newlyCreateSpot.id}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(imageObj),
      });
      if (imageRes.ok) {
        const imageData = await imageRes.json();
        return imageData;
      }
    }));
    newlyCreateSpot.SpotImages = newImagesRes;
    newlyCreateSpot.creatorName = sessionUser.username;
    dispatch(actionCreateSpot(newlyCreateSpot));
    return newlyCreateSpot;
  } else {
    const errors = res.json();
    return errors;
  }
}

//Delete Thunk

export const thunkDeleteSpot =
  (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      const data = res.json();

      const action = actionDeleteSpot(data);
      dispatch(action);
      return data;
    } else {
      console.warn("res in error: ", res)
      const errors = res.json();
      return errors;
    }
  };

// Update Thunk

export const updateThunker = (spot) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spot.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot),
  });
  if (response.ok) {
    const data = await response.json();
    const action = getDetailsThunk(data.id);
    dispatch(action);
    return data;
  } else {
    console.warn("res in error: ", response)
    const errors = response.json();
    return errors;
  }
}


// normalizeArr

function normalizeArr(spots) {
  const normalizedStuff = {};
  spots.forEach((spot) => (normalizedStuff[spot.id] = spot));
  return normalizedStuff;
}


//Reducer

const initialState = { allSpots: {}, singleSpot: {} };

export default function spotReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case GET_ALL_SPOTS:
      newState = { ...state, allSpots: {} };
      newState.allSpots = action.spots;
      return newState;
    case GET_ALL_SPOTS_OF_CURRENT_USER:
      newState = { ...state, allSpots: {} };
      newState.allSpots = action.spots;
      return newState;
    case GET_SPOT_DETAILS:
      newState = { ...state, singleSpot: {} };
      newState.singleSpot = action.spot
      return newState;
    case CREATE_SPOT:
      newState = { ...state };
      newState.singleSpot = action.spot
      return newState;
    case DELETE_SPOT:
      newState = {
        ...state,
        allSpots: { ...state.allSpots },
        spotDetails: {},
      };
      delete newState.allSpots[action.id];
      return newState;
    case UPDATE_SPOT:
      newState = { ...state, singleSpot: {} };
      newState.singleSpot = action.spot
      return newState;
    default:
      return state;
  }
}
