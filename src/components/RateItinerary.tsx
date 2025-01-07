import React, {FormEvent, useState} from "react";
import {ReactComponent as Winners} from "../assets/illustrations/winners.svg";
import {Recommendation} from "../utils/recommendationTypes";
import {useNavigate} from "react-router-dom";

export default function RateItinerary(props: { tripId: number, setRecommendations: React.Dispatch<React.SetStateAction<Recommendation[]>>, contrafactual: boolean | null }) {
	const ratingOptions = [
		"Too busy 😰",
		"Not interested 🥱",
		"Entertaining 🤩",
		"Well-paced 😊"
	];

	const onSubmit = (event: FormEvent) => {
		event.preventDefault();

		console.log(selectedRatingOptions);
		console.log(feedbackOptional);

		setFeedbackSent(true);
	}

	const navigate = useNavigate();

	const [selectedRatingOptions, setSelectedRatingOptions] = useState<string[]>([]);

	const negativeFeedback = (selectedRatingOptions.includes(ratingOptions[0]) || selectedRatingOptions.includes(ratingOptions[1]));

	const closeRateItinerary = () => {
		localStorage.setItem("rateItineraryClosed-" + props.tripId.toString(), "true");
		if (negativeFeedback) {
			const recommendations = JSON.parse(localStorage.getItem("recommendations")!) as Recommendation[];
			const updatedRecommendations = recommendations.filter((r) => r.id !== props.tripId);
			localStorage.setItem("recommendations", JSON.stringify(updatedRecommendations));
			props.setRecommendations(updatedRecommendations);
		}
		setClosed(true);
		if (negativeFeedback) {
			navigate(props.contrafactual ? '/contrafactual-offers' : '/tour-offers');
		}
	}

	const [feedbackOptional, setFeedbackOptional] = useState('');
	const [closed, setClosed] = useState(window.localStorage.getItem("rateItineraryClosed-" + props.tripId.toString()) === "true");
	const [feedbackSent, setFeedbackSent] = useState(false);
	const [showFeedback] = useState(Math.random() < 1);  // TODO


	return (
		<>
			{showFeedback && !closed && (
				<div className="rate-itinerary">
					{!feedbackSent && (
						<div>
							<div className="position-relative p-3">
								<h2 className="fs-5 text-secondary fw-bold">Rate this itinerary</h2>
									<button type="button" className=" close fs-5" onClick={() => closeRateItinerary()}>
										<i className="bi bi-x-lg"></i>
									</button>
							</div>
							<div className="px-3 pb-3">
								<form onSubmit={(event) => onSubmit(event)}>
									<div className="d-flex flex-wrap">
										{ratingOptions.map((ratingOption, index) =>
											<div key={index} className="pb-2 pe-2">
												<input type="checkbox"
															 className="btn-check"
															 checked={selectedRatingOptions.includes(ratingOption)}
															 onChange={(e) => {
																 if (e.target.checked) {
																	 setSelectedRatingOptions([...selectedRatingOptions, ratingOption])
																 } else {
																	 setSelectedRatingOptions(selectedRatingOptions.filter((ro) => ro !== ratingOption))
																 }
															 }}
															 id={"btn-check-" + index} autoComplete="off"
												/>
												<label className="btn btn-sm me-1 mb-1" style={{fontSize: "0.9rem"}} htmlFor={"btn-check-" + index}>{ratingOption}</label>
											</div>
										)}
									</div>
									{selectedRatingOptions.length !== 0 && (
										<div>
										<textarea
											name="feedback-optional"
											id="feedback-optional"
											className="my-3 w-100"
											placeholder={'Tell us more...(optional)'}
											onChange={(event) => setFeedbackOptional(event.target.value)}
											rows={4}/>
											<button type="submit" className="btn send-feedback w-100">Send feedback</button>
										</div>
									)}
								</form>
							</div>
						</div>
					)}
					{feedbackSent && (
						<div className="px-3 pb-3 pt-2 text-center">
							<Winners />
							<h2 className="fs-5 text-secondary fw-bold mt-3">Thank you for your feedback!</h2>
							{negativeFeedback && (
								<p>We're sorry that this trip didn't impress you. We will adjust the recommendations.</p>
							)}
							{!negativeFeedback && (
								<p>It will help us improve future recommendations.</p>
							)}
							<button type="submit" className="btn done w-100" onClick={() => closeRateItinerary()}>Done</button>
						</div>
					)}
				</div>
			)}
		</>
	);
}