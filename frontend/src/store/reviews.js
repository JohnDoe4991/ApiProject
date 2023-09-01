import { csrfFetch } from "./csrf";



//types

const GET_ALL_REVIEWS = "reviews/GET_REVIEWS"
const POST_REVIEW = "reviews/POST_REVIEW"
const DELETE_REVIEW = "reviews/DELETE_REVIEWS"


//action creator

const actionGetReview = (reviews) => ({ type: GET_ALL_REVIEWS, reviews });
const actionCreateReview = (review) => ({ type: POST_REVIEW, review });
const actionDeleteReview = (reviewId) => ({ type: DELETE_REVIEW, reviewId });


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

export const thunkDeleteReview =
    (reviewId) => async (dispatch) => {
        const res = await csrfFetch(`/api/reviews/${reviewId}`, {
            method: "DELETE",
        });

        if (res.ok) {
            const data = res.json();

            const action = actionDeleteReview(data);
            dispatch(action);
            return data;
        } else {
            console.warn("res in error: ", res)
            const errors = res.json();
            return errors;
        }
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
        case DELETE_REVIEW:
            newState = {
                ...state,
                reviews: {
                    ...state.reviews,
                    spot: { ...state.reviews.spot },
                    user: { ...state.reviews.user },
                },
            };
            delete newState.reviews.spot[action.reviewId];
            return newState;
        default:
            return state;
    }
}
