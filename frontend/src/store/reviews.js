import { csrfFetch } from "./csrf";



//types

const GET_ALL_REVIEWS = "reviews/GET_REVIEWS"
const POST_REVIEW = "reviews/POST_REVIEW"


//action creator

const actionGetReview = (reviews) => ({ type: GET_ALL_REVIEWS, reviews });
const actionCreateReview = (review) => ({ type: POST_REVIEW, review })


//Thunks

export const getAllReviewsThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)


    if (res.ok) {
        const Reviews = await res.json(); // { Spots: [] }
        // do the thing with this data
        dispatch(actionGetReview((Reviews)));

        return Reviews;
    } else {
        const errors = await res.json();
        return errors;
    }
};

export const createReviewThunk = (spotId, review, stars) => async (dispatch) => {
    const req = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ review, stars })
    });
    const data = await req.json();
    dispatch(actionCreateReview(data.review));
    return data;
};


// normalizeArr


//Reducer

const initialState = { allSpots: {}, singleSpot: {}, reviews: { spot: {}, user: {} }, isLoading: true };

export default function reviewReducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case GET_ALL_REVIEWS:
            newState = { ...state, reviews: { spot: {}, user: {} } }
            newState.reviews.spot = action.reviews
            return newState;
        case POST_REVIEW:
            newState = { ...state, reviews: { ...state.reviews, spot: { ...state.reviews.spot } } };
            newState.reviews.spot[action.review.id] = action.review;
            return newState;
        default:
            return state;
    }
}
