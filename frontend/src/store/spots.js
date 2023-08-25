import { csrfFetch } from "./csrf";



//                   ****types****

const GET_ALL_SPOTS = "/get_all_spots"; //read. // GET spots/
const GET_ALL_SPOTS_OF_CURRENT_USER = "/get_all_spots_of_user"; //read. // GET spots/
const GET_SPOT_DETAILS = "/spot_details"



//                   ****action creator****

const actionGetSpots = (spots) => ({ type: GET_ALL_SPOTS, spots });
const actionGetAllOwnerSpots = (spots) => ({ type: GET_ALL_SPOTS_OF_CURRENT_USER, spots });
const actionGetSpotDetails = (spot) => ({ type: GET_SPOT_DETAILS, spot })


//                   ****Thunks****


// ***************************getAllSpotsThunk**************************
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
    // do the thing with this data
    // console.log("Spots from getOwnerAllSpotsThunk:", Spots)
    dispatch(actionGetAllOwnerSpots(Spots));
    // dispatch(getAllSpots(Spots))
    return Spots;
  } else {
    const errors = await res.json();

    return errors;
  }
};

//getDetailsThunk
// export const getDetailsThunk = (spotId) => async (dispatch) => {
//   const res = await csrfFetch(`/api/spots/${spotId}`)

//   if (res.ok) {
//     const Spots = await res.json()
//     dispatch(actionGetSpotDetails(Spots));
//     return Spots;
//   } else {
//     const errors = await res.json();
//     return errors;
//   }
// };

export const getDetailsThunk = ( spotId ) => async (dispatch) => {
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


// ***************************normalizeArr**************************
function normalizeArr(spots) {
  const normalizedSpots = {};
  spots.forEach((spot) => (normalizedSpots[spot.id] = spot));
  return normalizedSpots;
}

// ************************************************
//                   ****Reducer****
// ************************************************
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
    default:
      return state;
  }
}
