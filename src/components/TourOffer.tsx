import React from 'react';
import {ReactComponent as LikeSvg} from "../assets/icons/like.svg";
import {ReactComponent as DislikeSvg} from "../assets/icons/dislike.svg";
import {ReactComponent as RoutePlaceholder} from "../assets/illustrations/route_placeholder.svg";
import {Link} from "react-router-dom";
import {toggleTripInArray} from "../utils/utils";
import {LikedTrips, Recommendation} from "../utils/recommendationTypes";

export default function TourOffer(props: {
  trip: Recommendation,
  likedTrips: LikedTrips,
  refreshLikedTrips: () => void,
  contrafactual: boolean | null,
  saved?: boolean
}) {
    const tourSettings = JSON.parse(localStorage.getItem('tourSettings') as string);

    const start = new Date(tourSettings.startDate);
    const end = new Date(tourSettings.finishDate);

    const differenceInMs = end.getTime() - start.getTime();

    const daysDifference = differenceInMs / (1000 * 60 * 60 * 24);

    const dayCount = Math.ceil(daysDifference) + 1;

    function isTripLiked() {
      return props.likedTrips.liked.includes(props.trip.id);
    }

    function isTripDisliked() {
      return props.likedTrips.disliked.includes(props.trip.id);
    }

    function likeTrip(isLiked: boolean) {
      toggleTripInArray(isLiked, props.trip.id);
      props.refreshLikedTrips();
    }

    const confidenceDiff = Math.abs(props.trip.confidence - 10);

    return (
      <>
        {props.contrafactual === true && (
          <div className="ms-2 input-summary-tag">{props.trip.location}</div>
        )}
        <section className={'trip-wrapper mb-3 mx-2 ' + (props.contrafactual === true ? 'mt-1' : 'mt-2')}>
          <Link
            to={props.contrafactual === true ? '/tour-offer-contrafactual/' + props.trip.id : (props.contrafactual === false ? '/tour-offer/' + props.trip.id :  '/tour-detail/' + props.trip.id)}>
            <div className="m-0 trip-card bg-bglight text-white row">
              <div className="col-9 p-3">
                <h2 className="mb-2">{props.trip.name}</h2>
                {(props.saved === undefined || !props.saved) && (
                  <div className="d-flex mb-1">
                    <p className='col-5 mb-0 text-gray'>
                    <span
                      className={(props.trip.match! >= 80 ? 'text-primary' : 'text-white')}>{props.trip.match}%</span> match
                    </p>
                    <p className='col-7 mb-0 text-gray'>
                      {confidenceDiff < 3 ?
                        <><span className='text-primary'>High</span> confidence</>
                        : (confidenceDiff < 6 ?
                            <><span className='text-white'>Medium</span> confidence</>
                            :
                            <><span className="text-warning">Low</span> confidence</>
                        )}
                    </p>
                  </div>
                )}
                <p className="mb-0 text-gray">{dayCount} days, {props.trip.length} km</p>
              </div>
              <div className="col-3 p-0">
                {props.trip.imgUrl === undefined ?
                  <RoutePlaceholder />
                  :
                  <img src={props.trip.imgUrl} alt={props.trip.name} />
                }
              </div>
            </div>
          </Link>

          <LikeSvg
            className={'like-btn ' + (isTripLiked() ? 'active' : '')}
            onClick={() => likeTrip(true)}/>
          <DislikeSvg
            className={'dislike-btn ' + (isTripDisliked() ? 'active' : '')}
            onClick={() => likeTrip(false)}/>

        </section>
      </>
    );
}
