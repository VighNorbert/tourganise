import React from 'react';
import {Link} from "react-router-dom";
import {LikedTrips, Recommendation} from "../utils/recommendationTypes";
import TourOffer from "../components/TourOffer";

export default function Home(props: {
  savedTrips: Recommendation[],
  likedTrips: LikedTrips,
  refreshLikedTrips: () => void
}) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12 pt-4 px-0">
            {props.savedTrips.length !== 0 &&
              <div>
                <h2 className="mb-3 mx-3">Your saved trips</h2>
                {props.savedTrips.map((trip, index) =>
                  <TourOffer key={index} contrafactual={null} trip={trip} likedTrips={props.likedTrips} refreshLikedTrips={props.refreshLikedTrips} saved={true} />
                )}
              </div>
            }
            {props.savedTrips.length === 0 && (
              <p className="p-2 text-center">You don't have any tours yet.</p>
            )}
            <div className="text-center">
              <Link to="/new-tour" className="btn btn-primary px-4">Create a new one!</Link>
              <section id="performance" className="mx-2">
                <h2 className="mb-4">Our performance</h2>
                <p>Based on user reviews that we collected</p>
                <span className="fs-bigger pt-5 mb-0 d-block">80%</span>
                <p>of the trips that recommended were Well-paced</p>
                <span className="pt-5 mb-0 d-block">Only</span>
                <span className="fs-bigger mb-0">5%</span>
                <p className="mb-0">of the trips that recommended were Boring</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
}

