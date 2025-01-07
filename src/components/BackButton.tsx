import React from 'react';

export default function BackButton(props: {action: () => void}) {
    return (
      <div>
        <button className="back-button fs-1" onClick={() => props.action()}>
          <i className="bi bi-arrow-left"></i>
        </button>
      </div>
    );
}

