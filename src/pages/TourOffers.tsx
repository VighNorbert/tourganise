import React, {useEffect, useState} from 'react';
import TourOffer from "../components/TourOffer";
import { getItineraries } from "../utils/openaiApiUtil";
import {LikedTrips, Recommendation, Tag} from "../utils/recommendationTypes";
import LoadingSpinner from "../components/LoadingSpinner";
import {intensityToString} from "../utils/utils";
import {useNavigate} from "react-router-dom";
import {getImageUrlFromGoogle} from "../utils/googleApiUtil";

export default function TourOffers(props: {
  recommendations: Recommendation[],
  setRecommendations: React.Dispatch<React.SetStateAction<Recommendation[]>>,
  likedTrips: LikedTrips,
  refreshLikedTrips: () => void
}) {

  const recommendations = props.recommendations;
  const tourSettings = JSON.parse(localStorage.getItem('tourSettings') as string);
  const interests  = JSON.parse(localStorage.getItem('interests') as string);

  const [showTags, setShowTags] = useState(false);

  const navigate = useNavigate();

  function sumWeights(tags: Tag[]) {
    return tags.map((tag: Tag) => tag.weight).reduce((a, b) => a + b, 0);
  }

  const loadingOverride = !!localStorage.getItem('offerLoadingOverride');

  console.log('loadingOverride', loadingOverride);

  useEffect(() => {
    if (localStorage.getItem('tourSettings') && !localStorage.getItem('recommendations')) {
      getItineraries(tourSettings.location, tourSettings.startDate, tourSettings.finishDate, tourSettings.intensity, interests).then((response) => {
        const recommendations = JSON.parse(response.choices[0].message.content as string) as Recommendation[];
        recommendations.forEach((recommendation) => {
          recommendation.tags.forEach((tag) => {
            tag.weight += Math.round(Math.random() * 10);
          });
          getImageUrlFromGoogle(recommendation.name + ", " + recommendation.location).then((imageUrl) => {
            if (imageUrl) {
              recommendation.imgUrl = imageUrl;
              localStorage.setItem('recommendations', JSON.stringify(recommendations));
              props.setRecommendations([...recommendations]);
            }
          });
          recommendation.match = Math.round(sumWeights(recommendation.tags.filter((tag: Tag) => interests.includes(tag.name))) / sumWeights(recommendation.tags) * 50 + 50);
          recommendation.id = Math.floor(Math.random() * 1000000);
        });
        recommendations.sort((a, b) => b.match! - a.match!);

        localStorage.setItem('recommendations', JSON.stringify(recommendations));
        props.setRecommendations(recommendations);
      })
    }
  }, [props, tourSettings.finishDate, tourSettings.intensity, tourSettings.location, tourSettings.startDate, interests]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="input-summary mb-4 mt-2 px-2">
            <div className="d-flex justify-content-between">
              <div><i className="bi bi-geo-alt me-2"></i>{tourSettings.location}</div>
              <div>{intensityToString(tourSettings.intensity)}</div>
            </div>
            <div className="d-flex justify-content-between align-items-center my-2">
              <div>{new Date(tourSettings.startDate).toLocaleDateString()}&nbsp;-&nbsp;{new Date(tourSettings.finishDate).toLocaleDateString()}</div>
              <button className="input-summary-tags-show-all" type="button"
                      onClick={() => setShowTags(!showTags)}>
                {showTags ? 'Hide interests' : 'Show interests'}
              </button>
            </div>
            <div className="d-flex flex-wrap">
              {showTags && interests.map((interest: string, index: number) => (
                <div className="input-summary-tag" key={index}>{interest}</div>
              ))}
            </div>
          </div>

          {(loadingOverride || recommendations.length === 0) && (
            <LoadingSpinner />
          )}

          {!loadingOverride && recommendations.length > 0 && recommendations.map((trip) => (
              <TourOffer key={trip.id} contrafactual={false} trip={trip} likedTrips={props.likedTrips} refreshLikedTrips={props.refreshLikedTrips} />
          ))}

          {!loadingOverride && recommendations.length > 0 && (
            <div className="d-flex justify-content-center py-4">
              <button className="no-selection" onClick={() => navigate('/contrafactual-offers')}>I am not satisfied with these results</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

