import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ReactComponent as LikeSvg} from "../assets/icons/like.svg";
import {ReactComponent as DislikeSvg} from "../assets/icons/dislike.svg";
import {ReactComponent as RoutePlaceholder} from "../assets/illustrations/route_placeholder.svg";
import {useNavigate, useParams} from "react-router-dom";
import BackButton from "../components/BackButton";
import {toggleTripInArray} from "../utils/utils";
import Day from "../components/Day";
import Location from "../components/Location";
import RateItinerary from "../components/RateItinerary";
import {DayItinerary, LikedTrips, Recommendation, Tag} from "../utils/recommendationTypes";
import {getItineraryPlan} from "../utils/openaiApiUtil";
import LoadingSpinner from "../components/LoadingSpinner";
import ShowAccommodations from "../components/ShowAccommodations";
import AccommodationOffer from "../components/AccommodationOffer";

export default function TourOfferDetail(props: {
  recommendations: Recommendation[],
  setRecommendations: React.Dispatch<React.SetStateAction<Recommendation[]>>,
  likedTrips: LikedTrips,
  refreshLikedTrips: () => void,
  contrafactual: boolean | null,
  savedTrips: Recommendation[],
  refreshSavedTrips: () => void
}) {

    const {id} = useParams();
    const tripId = id !== undefined ? parseInt(id) : 0;
    const navigate = useNavigate();

    const trip = props.recommendations.find((trip) => trip.id === tripId);

    const interests  = JSON.parse(localStorage.getItem('interests') as string);

    const key = props.contrafactual === true ? 'contraFactualRecommendations' : 'recommendations';

    useEffect(() => {
      if (trip && trip?.days === undefined) {
        const tourSettings = JSON.parse(localStorage.getItem('tourSettings') as string);

        const interests  = JSON.parse(localStorage.getItem('interests') as string);

        getItineraryPlan(trip!.location!, tourSettings.startDate, tourSettings.finishDate, tourSettings.intensity, interests, trip!.name).then((response) => {
          const itinerary = JSON.parse(response.choices[0].message.content as string) as {days: DayItinerary[]};
          trip.days = itinerary.days;
          let recommendations = JSON.parse(localStorage.getItem(key) as string) as Recommendation[];
          recommendations = recommendations.map((r) => r.id === trip.id ? trip : r);
          localStorage.setItem(key, JSON.stringify(recommendations));

          props.setRecommendations(recommendations);
        });
      }
    }, [props, trip, key]);

    const [showAccommodationsClosedOnIds, setShowAccommodationsClosedOnIds] = useState<number[]>(JSON.parse(localStorage.getItem("showAccommodationsClosedOnIds") ?? '[]'));

    let showAccommodationsClosed = showAccommodationsClosedOnIds.includes(tripId);

    function onShowAccommodationsClosed() {
      console.log("lojzo");
      showAccommodationsClosed = true;
      if (!(JSON.parse(localStorage.getItem("showAccommodationsClosedOnIds") ?? '[]') as number[]).includes(tripId)) {
        const ids = [...showAccommodationsClosedOnIds, tripId];
        localStorage.setItem("showAccommodationsClosedOnIds", JSON.stringify(ids));
        setShowAccommodationsClosedOnIds(ids);
      }
    }

    function isTripLiked() {
      return props.likedTrips.liked.includes(tripId);
    }

    function isTripDisliked() {
      return props.likedTrips.disliked.includes(tripId);
    }

    function likeTrip(isLiked: boolean) {
      toggleTripInArray(isLiked, tripId);
      props.refreshLikedTrips();
    }

    const tags = trip?.tags.sort((a, b) =>
      (interests.includes(b.name) ? 1000 : 1) * b.weight
      - (interests.includes(a.name) ? 1000 : 1) * a.weight
    ) ?? [];

    const [showTagDetails, setShowTagDetails] = useState(false);

    const tourSettings = JSON.parse(localStorage.getItem('tourSettings') as string);

    const start = new Date(tourSettings.startDate);
    const end = new Date(tourSettings.finishDate);

    const differenceInMs = end.getTime() - start.getTime();

    const daysDifference = differenceInMs / (1000 * 60 * 60 * 24);

    const dayCount = Math.ceil(daysDifference) + 1;

    const confidenceDiff = Math.abs(trip!.confidence - 10);

    const isSaved = useMemo(() => isSavedTrip(props.savedTrips, tripId), [props, tripId]);

    const loadingOverride = !!localStorage.getItem('itineraryLoadingOverride');

    function isSavedTrip(savedTrips: Recommendation[], id: number) {
      return savedTrips.filter((t) => t.id === id).length > 0;
    }

    const [menuShown, setMenuShown] = useState(false);

    function toggleMenu() {
      setMenuShown(!menuShown);
    }

    function save() {
      const savedTrips = localStorage.getItem('savedTrips') ? JSON.parse(localStorage.getItem('savedTrips') as string) as Recommendation[] : [];
      savedTrips.push(trip!);
      localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
      props.refreshSavedTrips();
    }

    function unsave() {
      console.log("unsaving");
      let savedTrips = localStorage.getItem('savedTrips') ? JSON.parse(localStorage.getItem('savedTrips') as string) as Recommendation[] : [];
      savedTrips = savedTrips.filter((t) => t.id !== tripId);
      localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
      props.refreshSavedTrips();
      navigate('/');
    }

    const [accommodationsInboarded, setAccommodationsInboarded] = useState(localStorage.getItem("accommodationsInboarded") && localStorage.getItem("accommodationsInboarded") === "true");

    function useOutsideAlerter(ref: React.MutableRefObject<HTMLDivElement | null>) {
      useEffect(() => {
        function handleClickOutside(event: any) {
          if (ref.current && !ref.current.contains(event.target)) {
            setMenuShown(false);
          }
        }

        document.addEventListener("click", handleClickOutside);
        return () => {
          document.removeEventListener("click", handleClickOutside);
        };
      }, [ref]);
    }

    const menuRef = useRef(null);
    useOutsideAlerter(menuRef);

    if (tripId === 0) return (
      <div className="text-center pt-5"></div>
    );

    const showTips = () => {
      onShowAccommodationsClosed();
      navigate('/accommodation-offers/' + tripId);
    }

    function onAccommodationsInboarded() {
      setAccommodationsInboarded(true);
      localStorage.setItem("accommodationsInboarded", "true");
    }

    return (
      <>
        <BackButton action={() => navigate(props.contrafactual === true ? '/contrafactual-offers' : (props.contrafactual === false ? '/tour-offers' : '/'))}/>
        <section className="trip-detail-wrapper mt-2 mb-5 mx-2">
          <div className="trip-detail-title-wrapper mb-4 position-relative">
            {isSaved && (
              <div className="saved-trip">
                <i className="bi bi-star-fill fs-2"></i>
              </div>
            )}
            {trip?.imgUrl === undefined ?
              <RoutePlaceholder />
              :
              <img src={trip?.imgUrl} alt={trip?.name ?? ''} />
            }
            <div className="m-0 trip-card bg-bglight text-white row">
              <div className="col-12 p-3">
                <div className="row">
                  <div className="col-10">
                    <h1 className="fs-5 fw-bolder mb-2">{trip?.name ?? ''}</h1>
                    <div className="mb-0">
                        <span className='text-gray me-4'>
                          <span className={(trip?.match! >= 80 ? 'text-primary' : 'text-white')}>{trip?.match}%</span> match
                        </span>
                      <span className='text-gray'>
                          {confidenceDiff < 3 ?
                            <><span className='text-primary'>High</span> confidence</>
                            : (confidenceDiff < 6 ?
                                <><span className='text-white'>Medium</span> confidence</>
                                :
                                <><span className="text-warning">Low</span> confidence</>
                            )}
                        </span>
                    </div>
                  </div>
                  <div className="col-2 p-0 position-relative d-flex justify-content-end">
                    {isSaved && showAccommodationsClosed && !accommodationsInboarded && (
                      <div className="accommodations-inboarding">
                        <p className="text-center">You can still get accommodation tips here.</p>
                        <div className="d-flex justify-content-center">
                          <button className="btn" onClick={onAccommodationsInboarded}>OK</button>
                        </div>
                      </div>
                    )}
                    <div className="dropdown" ref={menuRef}>
                      <button type="button" className="btn btn-link text-decoration-none text-white p-0" onClick={toggleMenu} style={{marginTop: '-10px'}}>
                        <i className="bi bi-three-dots-vertical fs-3 three-dots-menu-button"></i>
                      </button>
                      {menuShown && (
                        <ul className="dropdown-menu bg-bgdark dropdown-menu-end d-block" style={{'right': '.5rem'}}>
                          {trip!.bookedAccommodation === undefined && (
                            <li><button className="dropdown-item text-white bg-bgdark" onClick={showTips}>Get accommodation tips</button></li>
                          )}
                          {isSaved && (
                            <li><button className="dropdown-item text-white bg-bgdark" onClick={unsave}>Delete this trip</button></li>
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                <p className="mb-0 text-gray">{dayCount} days, {trip?.length} km</p>
                  <div>
                    <LikeSvg
                      className={'like-btn ' + (isTripLiked() ? 'active' : '')}
                      onClick={() => likeTrip(true)}/>
                    <DislikeSvg
                      className={'dislike-btn ' + (isTripDisliked() ? 'active' : '')}
                      onClick={() => likeTrip(false)}/>
                  </div>
                </div>
                {showTagDetails ? (
                  <div className="d-flex flex-column">
                      <span
                        className="mb-2 small">This roadtrip was suggested for you based on the following interests:</span>
                    {tags.filter((t) => interests.includes(t.name)).map((tag: Tag, index: number) => (
                      <div key={index} className="row m-0">
                        <div className="col-7 p-0">
                          <div className={"input-summary-tag" + (interests.includes(tag.name) ? " chosen" : "")}
                               key={index}>
                            {tag.name}
                          </div>
                        </div>
                        <div className="col-5 p-0 d-flex flex-column justify-content-center">
                          <div className="progress mb-1">
                            <div className="progress-bar bg-secondary text-end p-1" role="progressbar"
                                 style={{width: tag.weight + '%'}}>
                              {tag.weight.toFixed(0) + '%'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {tags.filter((t) => !interests.includes(t.name)).length > 0 && (
                      <>
                        <span className="my-2 small">Other interests matching this trip:</span>
                        {tags.filter((t) => !interests.includes(t.name)).map((tag: Tag, index: number) => (
                          <div key={index} className="row m-0">
                            <div className="col-7 p-0">
                              <div className={"input-summary-tag" + (interests.includes(tag.name) ? " chosen" : "")}
                                   key={index}>
                                {tag.name}
                              </div>
                            </div>
                            <div className="col-5 p-0 d-flex flex-column justify-content-center">
                              <div className="progress mb-1">
                                <div className="progress-bar bg-secondary text-end p-1" role="progressbar"
                                     style={{width: tag.weight + '%'}}>
                                  {tag.weight.toFixed(0) + '%'}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                    <span className='my-2 small'>
                        This result has {confidenceDiff < 3 ?
                      <span className='text-primary'>High</span>
                      : (confidenceDiff < 6 ?
                          <span className='text-white'>Medium</span>
                          :
                          <span className="text-warning">Low</span>
                      )} confidence thanks to the training dataset containing <span
                      className='text-primary'>{trip?.confidence}%</span> of similar trips.
                        Percentages close to 10% are most likely to be accurate.
                      </span>
                    <div className="col-12">
                      <button className="input-summary-tags-show-all ps-0" type="button"
                              onClick={() => setShowTagDetails(false)}>
                        Hide details
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex flex-wrap">
                    {tags.map((tag: Tag, index: number) => (
                      <div className={"input-summary-tag" + (interests.includes(tag.name) ? " chosen" : "")}
                           key={index}>
                        {tag.name}
                      </div>
                    ))}
                    <div className="col-12">
                      <button className="input-summary-tags-show-all" type="button"
                              onClick={() => setShowTagDetails(true)}>
                        About this result
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {!loadingOverride && !isSaved && trip?.days &&
            <div className="save-trip-btn-wrapper mb-4">
              <button className="save-trip-btn" onClick={save}>
                <i className="bi bi-star me-2"></i>
                Save this itinerary
              </button>
            </div>
          }

          {trip?.bookedAccommodation !== undefined &&
            <div className="day ps-0">
              <span className="ps-3 fw-bolder">Booked accommodation</span>
              <AccommodationOffer offer={trip?.bookedAccommodation} trip={trip!} refreshSavedTrips={props.refreshSavedTrips} booked={true} />
            </div>
          }

          {!loadingOverride && trip?.days && trip.days.map((day, dIndex) =>
            <section key={dIndex}>
              <Day key={dIndex} iDay={dIndex + 1} day={day}/>
              {day.attractions.map((attraction, aIndex) => (
                <Location key={aIndex} attraction={attraction}/>
              ))}
            </section>
          )}
          {(loadingOverride || trip?.days === undefined) && (
            <LoadingSpinner/>
          )}
        </section>
        {!loadingOverride && !isSaved && trip?.days !== undefined && (
          <RateItinerary setRecommendations={props.setRecommendations} tripId={tripId} contrafactual={props.contrafactual} />
        )}
        {!loadingOverride && isSaved && !showAccommodationsClosed && trip?.bookedAccommodation === undefined && (
          <ShowAccommodations onShowAccommodationClosed={onShowAccommodationsClosed} tripId={tripId} />
        )}
      </>
    );
}
