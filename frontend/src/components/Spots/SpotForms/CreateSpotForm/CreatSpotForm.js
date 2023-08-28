
import SpotForm from './SpotForm';

export default function CreateSpotForm() {
    return (
        <SpotForm
            formType="Create"
        />

import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";


export default function CreateSpotForm({ spots }) {
    const history = useHistory()


    return (
        <>
        <h1>Create a new Spot</h1>
        <h2>Where's your place located?</h2>
        <p>Guests will only get your exact address once they have booked a reservation.</p>
            <form
                className="create-form">

            </form>
        </>

    )
}
