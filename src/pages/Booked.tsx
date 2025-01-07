import React from "react";
import {ReactComponent as BookingSvg} from "../assets/illustrations/booking.svg";
import BackButton from "../components/BackButton";
import {Link, useNavigate, useParams} from "react-router-dom";

export default function Booked() {
	const navigate = useNavigate();
	const {id} = useParams();

	return (
		<>
			<BackButton action={() => navigate('/tour-detail/' + id)} />
			<div className="container">
				<div className="row">
					<div className="col-12 py-5">
						<div className="px-5">
							<BookingSvg className="w-100 h-auto py-4" />
						</div>
						<h1 className="text-center">Your stay was successfully booked.</h1>
					</div>
					<div className="d-flex justify-content-center">
						<Link to={'/'} className="btn btn-primary px-3">Return to home page</Link>
					</div>
				</div>
			</div>
		</>
	);
}