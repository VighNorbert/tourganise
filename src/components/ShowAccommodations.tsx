import React from "react";
import {useNavigate} from "react-router-dom";

export default function ShowAccommodations(props: { onShowAccommodationClosed: () => void, tripId: number }) {
	const navigate = useNavigate();

	const showTips = () => {
		props.onShowAccommodationClosed();
		navigate('/accommodation-offers/' + props.tripId);
	}

	return (
		<div className="show-accommodations p-3">
			<h2 className="fs-5 text-secondary fw-bold text-center mb-4">We might have some good accommodations for this trip</h2>
			<div className="mb-2">
				<button className="btn w-100 btn-show-accommodations" onClick={() => showTips()}>Perfect, show me some tips!</button>
			</div>
			<div className="d-flex justify-content-center">
				<button className="btn btn-link" onClick={() => props.onShowAccommodationClosed()}>Close</button>
			</div>
		</div>
	);
}