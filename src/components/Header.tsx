import React from 'react';
import {Link} from "react-router-dom";

export default function Header() {
    return (
      <header>
        <div style={{width: '48px'}}></div>

        <Link to="/" className="primary h2 m-0 logo text-decoration-none">
          Tourganise
        </Link>

        <div style={{width: '48px'}}>
          {window.location.pathname !== '/onboarding' &&
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list"
                 viewBox="0 0 16 16">
              <path fillRule="evenodd"
                    d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
            </svg>
          }
        </div>
      </header>
    );
}

