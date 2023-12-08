import React from 'react';
import './Loading.scss';

const Loading = () => {
  const text = 'Loading...';

  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">
        {text.split('').map((char, index) => (
          <span key={index}>{char}</span>
        ))}
      </p>
    </div>
  );
};

export default Loading;
