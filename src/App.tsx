import React, {useEffect, useState} from 'react';
import Header from "./components/Header";
import {Route, Routes, useNavigate} from "react-router-dom";
import Home from "./pages/Home";
import NewTour from "./pages/NewTour";
import Onboarding from "./pages/Onboarding/Onboarding";
import TourOffers from "./pages/TourOffers";
import TourOfferDetail from "./pages/TourOfferDetail";
import {LikedTrips, Recommendation} from "./utils/recommendationTypes";
import ContraFactualOffers from "./pages/ContraFactualOffers";
import AccommodationOffers from "./pages/AccommodationOffers";
import Booked from "./pages/Booked";


export default function App() {

  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    localStorage.getItem('recommendations') ? JSON.parse(localStorage.getItem('recommendations') as string) as Recommendation[] : []
  );

  const [contraFactualRecommendations, setContraFactualRecommendations] = useState<Recommendation[]>(
    localStorage.getItem('contraFactualRecommendations') ? JSON.parse(localStorage.getItem('contraFactualRecommendations') as string) as Recommendation[] : []
  );

  const [likedTrips, setLikedTrips] = useState(
    localStorage.getItem('likedTrips') ? JSON.parse(localStorage.getItem('likedTrips')!) as LikedTrips : {liked: [], disliked: []} as LikedTrips
  );

  const [savedTrips, setSavedTrips] = useState(
    localStorage.getItem('savedTrips') ? JSON.parse(localStorage.getItem('savedTrips')!) as Recommendation[] : []
  );

  function refreshLikedTrips() {
    setLikedTrips(JSON.parse(localStorage.getItem('likedTrips')!) as LikedTrips);
  }

  function refreshSavedTrips() {
    setSavedTrips(JSON.parse(localStorage.getItem('savedTrips')!) as Recommendation[]);
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (!(localStorage.getItem('hasOnboarded') === 'true') && window.location.pathname !== '/onboarding') {
      navigate('/onboarding');
    }
  }, [navigate]);

  return (
    <div className="App">
      <Header />

      <Routes>
        <Route path="/onboarding" element={<Onboarding />}></Route>
        <Route path="/" element={<Home likedTrips={likedTrips} refreshLikedTrips={refreshLikedTrips} savedTrips={savedTrips} />}></Route>
        <Route path="/new-tour" element={<NewTour setRecommendations={setRecommendations} />} />
        <Route path="/tour-offers" element={<TourOffers likedTrips={likedTrips} refreshLikedTrips={refreshLikedTrips} recommendations={recommendations} setRecommendations={setRecommendations} />} />
        <Route path="/tour-detail/:id" element={<TourOfferDetail savedTrips={savedTrips} refreshSavedTrips={refreshSavedTrips} contrafactual={null} likedTrips={likedTrips} refreshLikedTrips={refreshLikedTrips} recommendations={savedTrips} setRecommendations={setRecommendations} />} />
        <Route path="/tour-offer/:id" element={<TourOfferDetail savedTrips={savedTrips} refreshSavedTrips={refreshSavedTrips} contrafactual={false} likedTrips={likedTrips} refreshLikedTrips={refreshLikedTrips} recommendations={recommendations} setRecommendations={setRecommendations} />} />
        <Route path="/tour-offer-contrafactual/:id" element={<TourOfferDetail savedTrips={savedTrips} refreshSavedTrips={refreshSavedTrips} contrafactual={true} likedTrips={likedTrips} refreshLikedTrips={refreshLikedTrips} recommendations={contraFactualRecommendations} setRecommendations={setContraFactualRecommendations} />} />
        <Route path="/contrafactual-offers" element={<ContraFactualOffers likedTrips={likedTrips} refreshLikedTrips={refreshLikedTrips} contraFactualRecommendations={contraFactualRecommendations} setContraFactualRecommendations={setContraFactualRecommendations} />} />
        <Route path="/accommodation-offers/:id" element={<AccommodationOffers savedTrips={savedTrips} refreshSavedTrips={refreshSavedTrips} />} />
        <Route path="/booked/:id" Component={Booked} />
      </Routes>
    </div>
  );
}

