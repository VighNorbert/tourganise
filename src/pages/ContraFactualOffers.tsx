import React, {useEffect} from 'react';
import BackButton from "../components/BackButton";
import {useNavigate} from "react-router-dom";
import {LikedTrips, Recommendation, Tag} from "../utils/recommendationTypes";
import {getItineraries} from "../utils/openaiApiUtil";
import LoadingSpinner from "../components/LoadingSpinner";
import TourOffer from "../components/TourOffer";
import {getImageUrlFromGoogle} from "../utils/googleApiUtil";

export default function ContraFactualOffers(props: {
	contraFactualRecommendations: Recommendation[],
	setContraFactualRecommendations: React.Dispatch<React.SetStateAction<Recommendation[]>>,
	likedTrips: LikedTrips,
	refreshLikedTrips: () => void
}) {
	const recommendations = props.contraFactualRecommendations;
	const tourSettings = JSON.parse(localStorage.getItem('tourSettings') as string);
	const interests  = JSON.parse(localStorage.getItem('interests') as string);

	const navigate = useNavigate();

	function sumWeights(tags: Tag[]) {
		return tags.map((tag: Tag) => tag.weight).reduce((a, b) => a + b, 0);
	}


	useEffect(() => {
		if (localStorage.getItem('tourSettings') && !localStorage.getItem('contraFactualRecommendations')) {
			getItineraries(tourSettings.location, tourSettings.startDate, tourSettings.finishDate, tourSettings.intensity, interests, true).then((response) => {
				const recommendations = JSON.parse(response.choices[0].message.content as string) as Recommendation[];
				recommendations.forEach((recommendation) => {
					recommendation.tags.forEach((tag) => {
						tag.weight += Math.round(Math.random() * 10);
					});
					getImageUrlFromGoogle(recommendation.name + ", " + recommendation.location).then((imageUrl) => {
						if (imageUrl) {
							recommendation.imgUrl = imageUrl;
							localStorage.setItem('contraFactualRecommendations', JSON.stringify(recommendations));
							props.setContraFactualRecommendations(recommendations);
						}
					});
					recommendation.match = Math.round(sumWeights(recommendation.tags.filter((tag: Tag) => interests.includes(tag.name))) / sumWeights(recommendation.tags) * 50 + 40);
					recommendation.id = Math.floor(Math.random() * 1000000);
				});
				recommendations.sort((a, b) => b.match! - a.match!);

				localStorage.setItem('contraFactualRecommendations', JSON.stringify(recommendations));
				props.setContraFactualRecommendations(recommendations);
			})
		}
	}, [props, tourSettings.finishDate, tourSettings.intensity, tourSettings.location, tourSettings.startDate, interests]);

	return (
		<div className="container">
			<BackButton action={() => navigate('/tour-offers')}/>

			<div className="py-4 fs-5 px-2">
				Maybe you would like similar trips in different locations:
			</div>

			{recommendations.length === 0 && (
				<LoadingSpinner />
			)}

			{recommendations.length > 0 && recommendations.map((trip) => (
				<TourOffer key={trip.id} contrafactual={true} trip={trip} likedTrips={props.likedTrips} refreshLikedTrips={props.refreshLikedTrips} />
			))}

			{recommendations.length > 0 && (
				<div className="d-flex justify-content-center py-4">
					<button className="no-selection" onClick={() => navigate('/')}>I don't like these trips either</button>
				</div>
			)}
		</div>
	);
}

