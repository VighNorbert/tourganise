import React from 'react';
import {ReactComponent as WorldSvg} from "../../assets/illustrations/world.svg";
import {useNavigate} from "react-router-dom";


export default function OnboardingFinished() {
  const navigate = useNavigate();

  function handleDashboard() {
    localStorage.setItem('hasOnboarded', 'true');
    navigate("/");
  }

  return (
    <div className="container">
      <div className="text-center">
        <WorldSvg style={{width: '80%', height: '80%'}}/>
        <h2 className="h1 text-center mt-5 mb-4 font-madimione text-secondary">You're all set!</h2>
        <p className="py-3 fs-5 px-2">
          Now you can start creating your first tour. Enjoy your journey!
        </p>
        <button className="btn btn-lg btn-primary mb-4" onClick={handleDashboard}>Finish</button>
      </div>
    </div>
  );
}

