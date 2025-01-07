import React from "react";
import {Accommodation, Recommendation} from "../utils/recommendationTypes";
import {useNavigate} from "react-router-dom";

export default function AccommodationOffer(props: {
	offer: Accommodation,
	trip: Recommendation,
	refreshSavedTrips: () => void,
	booked: boolean
}) {

	const trip = props.trip

	const navigate = useNavigate();

	function book(offer: Accommodation) {
		trip.bookedAccommodation = offer;
		let savedTrips = (JSON.parse(localStorage.getItem('savedTrips')!) as Recommendation[]).filter(t => t.id !== trip.id);
		savedTrips.push(trip!);
		localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
		props.refreshSavedTrips();

		navigate('/booked/' + trip.id);

	}

	return (
		<div key={props.offer.id} className="my-3">
			<div className="accommodation-offer">
				<h2 className="fs-5 mb-1">{props.offer.name}</h2>
				<div className="row align-items-baseline">
					<div className="col-7 pe-0 accommodation-offer-location">
						{props.offer.location}
					</div>
					<div className="col-5 text-end ps-0">
						<span className="fw-bold">{props.offer.pricePerNight}</span><small>&nbsp;{props.offer.currency}&nbsp;/&nbsp;night</small>
					</div>
				</div>
				{!props.booked && (
					<>
						<div className="d-flex flex-wrap mt-2 mb-2">
							{props.offer.tags.map((tag: string, index: number) => (
								<div className="input-summary-tag chosen" key={index}>
									{tag}
								</div>
							))}
						</div>
						<div className="col-12 small text-gray">
							<p>{props.offer.description}</p>
						</div>
						<div className="d-flex justify-content-center mt-3">
							<button className="btn btn-link text-primary text-decoration-none p-1 fs-6" onClick={() => book(props.offer)}>
								Book this accommodation
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}