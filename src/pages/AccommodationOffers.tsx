import React, {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Accommodation, Attraction, Recommendation} from "../utils/recommendationTypes";
import BackButton from "../components/BackButton";
import {getAccommodations} from "../utils/openaiApiUtil";
import LoadingSpinner from "../components/LoadingSpinner";
import AccommodationOffer from "../components/AccommodationOffer";

export default function AccommodationOffers(props: {
	savedTrips: Recommendation[],
	refreshSavedTrips: () => void
}) {

	const {id} = useParams();
	const tripId = id !== undefined ? parseInt(id) : 0;
	const navigate = useNavigate();

	const trip = props.savedTrips.find((trip) => trip.id === tripId);
	const interests  = JSON.parse(localStorage.getItem('interests') as string);
	const accommodationPreferences  = JSON.parse(localStorage.getItem('accommodation') as string);


	useEffect(() => {
		if (trip?.accommodationOffers === undefined) {
			let attractions: Attraction[] = [];

			trip?.days?.forEach((day) => {
				attractions = attractions.concat(day.attractions);
			});

			getAccommodations(trip?.location!, trip?.name!, attractions.map(a => a.name), accommodationPreferences).then((response) => {
				const accommodations = JSON.parse(response.choices[0].message.content as string) as Accommodation[];
				console.log(accommodations);
				accommodations.forEach((accommodation) => {
					accommodation.id = Math.floor(Math.random() * 1000000);
				});
				trip!.accommodationOffers = accommodations;
				let savedTrips = (JSON.parse(localStorage.getItem('savedTrips')!) as Recommendation[]).filter(t => t.id !== tripId);
				savedTrips.push(trip!);
				localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
				props.refreshSavedTrips();
			})
		}
	}, [props, trip, interests, accommodationPreferences, tripId]);

	return (
		<>
		  <BackButton action={() => navigate('/tour-detail/' + tripId)} />
			<div className="container">
				<div className="row">
					<div className="col-12">
						<h1 className="h2 pt-3 px-1">Recommended accommodation for your upcoming trip</h1>
						<p className="px-1 py-2">
							Based on your preferences, we have prepared a list of accommodations that you might like.
						</p>
						{(trip?.accommodationOffers === undefined || trip.accommodationOffers.length === 0) && (
              <LoadingSpinner />
						)}

						{trip?.accommodationOffers && (
              trip.accommodationOffers.map((offer) => (
								<AccommodationOffer key={offer.id} offer={offer} trip={trip!} refreshSavedTrips={props.refreshSavedTrips} booked={false} />
							))
						)}
					</div>
				</div>

			</div>
		</>
	);
}