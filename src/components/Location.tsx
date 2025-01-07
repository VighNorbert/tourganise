import React from "react";
import {Attraction} from "../utils/recommendationTypes";

export default function Location(props: { attraction: Attraction }) {
	return (
		<div className="location-wrapper">
			<p>{props.attraction.time}</p>
			<h2 className="fw-bolder">{props.attraction.name}</h2>
			<p>{props.attraction.description}</p>
		</div>
	);
}