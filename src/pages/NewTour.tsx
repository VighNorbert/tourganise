import React, {FormEvent, useState} from 'react';
import {useNavigate} from "react-router-dom";
import BackButton from "../components/BackButton";
import {Recommendation} from "../utils/recommendationTypes";

export default function NewTour(props: {
  setRecommendations: React.Dispatch<React.SetStateAction<Recommendation[]>>
}) {
    const navigate = useNavigate();

    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState('');
    const [finishDate, setFinishDate] = useState('');
    const [intensity, setIntensity] = useState(1);

    const onSubmit = (event: FormEvent) => {
      event.preventDefault();

      const tourSettings = {
        location,
        startDate,
        finishDate,
        intensity
      };

      console.log(tourSettings);

      localStorage.setItem('tourSettings', JSON.stringify(tourSettings));
      if (localStorage.getItem('recommendations')) {
        localStorage.removeItem('recommendations');
      }
      if (localStorage.getItem('contraFactualRecommendations')) {
        localStorage.removeItem('contraFactualRecommendations');
      }
      props.setRecommendations([]);

      navigate('/tour-offers');
    };

    return (
      <div className="container">
        <BackButton action={() => navigate('/')} />
        <div className="row">
          <div className="col-12 pt-3">
            <h1 className="text-center">
              New Tour
            </h1>
            <form onSubmit={(event) => onSubmit(event)}>
              <div className="mb-3">
                <label htmlFor="location" className="form-label">Location</label>
                <input type="text" className="form-control" id="location" name="location" onChange={(event) => setLocation(event.target.value)}/>
              </div>
              <div className="mb-3">
                <label htmlFor="start" className="form-label">Start date</label>
                <input type="date" className="form-control" id="start" name="start" onChange={(event) => setStartDate(event.target.value)}/>
              </div>
              <div className="mb-4">
                <label htmlFor="finish" className="form-label">Finish date</label>
                <input type="date" className="form-control" id="finish" name="finish" onChange={(event) => setFinishDate(event.target.value)}/>
              </div>
              <div className="mb-3 px-3">
                <label htmlFor="intensity" className="form-label ps-0">Intensity</label>
                <input type="range" name="intensity" className="form-range" min="0" max="2" id="intensity" defaultValue={1} onChange={(event) => setIntensity(parseInt(event.target.value))}/>
                <div className="row justify-content-between mb-4">
                  <span className="col-4 text-start">Relaxed</span>
                  <span className="col-4 text-center">Balanced</span>
                  <span className="col-4 text-end">Fast-paced</span>
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100">Get tour options</button>
            </form>
          </div>
        </div>
      </div>
    );
}

