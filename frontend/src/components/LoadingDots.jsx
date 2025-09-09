import React from 'react';

const LoadingDots = () => {
  const containerStyle = {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const dotStyle = {
    width: '8px',
    height: '8px',
    backgroundColor: '#000',
    borderRadius: '50%',
    animation: 'bounce 1.4s ease-in-out infinite both'
  };

  const dot1Style = {
    ...dotStyle,
    animationDelay: '0ms'
  };

  const dot2Style = {
    ...dotStyle,
    animationDelay: '160ms'
  };

  const dot3Style = {
    ...dotStyle,
    animationDelay: '320ms'
  };

  return (
    <>
      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
            }
            40% {
              transform: scale(1);
            }
          }
        `}
      </style>
      <div style={containerStyle}>
        <div style={dot1Style}></div>
        <div style={dot2Style}></div>
        <div style={dot3Style}></div>
      </div>
    </>
  );
};

export default LoadingDots;