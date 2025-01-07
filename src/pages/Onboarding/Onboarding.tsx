import React, {useState} from 'react';
import {ReactComponent as TripSvg} from "../../assets/illustrations/trip.svg";
import AccommodationPreferences from "./AccommodationPreferences";
import OnboardingFinished from "./OnboardingFinished";
import Interests from "./Interests";
import BackButton from "../../components/BackButton";

export default function Onboarding() {
    const [step, setStep] = useState(1);

    return (
        <div className="container onboarding-container">
            <div className="onboarding-card">
              {step !== 1 && (
                <BackButton action={() => setStep(step - 1)}/>
              )}
              {step === 1 && (
                  <div className="text-center">
                    <TripSvg style={{width: '80%', height: '80%'}} />
                      <h1 className="font-madimione mt-5 text-secondary">Welcome to Tourganise!</h1>
                      <p className="py-4 fs-5 px-2">
                        With Tourganise, you can turn your travels into unforgettable experiences.
                        Based on your interests, our personalized route planner will help you create tailor-made itineraries in 98% of the globe.
                      </p>
                      <button className="btn btn-lg btn-primary" onClick={() => setStep(2)}>Get started</button>
                  </div>
              )}

              {step === 2 && (
                  <Interests onContinue={() => setStep(3)} />
              )}

              {step === 3 && (
                  <AccommodationPreferences onContinue={() => setStep(4)} />
              )}

              {step === 4 && (
                  <OnboardingFinished />
              )}
              {step !== 1 &&
                <div id="onboarding-steps" className="d-flex flex-column align-items-center">
                  <div className="mt-2 d-flex">
                    <div className={step === 2 ? 'active' : ''}></div>
                    <div className={step === 3 ? 'active' : ''}></div>
                    <div className={step === 4 ? 'active' : ''}></div>
                  </div>
                </div>}
            </div>
        </div>
    );
}

