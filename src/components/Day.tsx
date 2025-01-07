import React from "react";
import {DayItinerary} from "../utils/recommendationTypes";

export default function Day(props: { iDay: number; day: DayItinerary }) {
	return (
		<div className="day d-flex align-items-baseline">
			<span className="pe-2 fw-bolder">Day {props.iDay}</span>
			<span className="day-date">{new Date(props.day.date).toLocaleDateString("en-UK")}</span>
		</div>
	);
}