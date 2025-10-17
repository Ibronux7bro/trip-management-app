import PropTypes from 'prop-types';
import React from 'react';

const CircularButton = ({
  width = '1em',
  height = '1em',
  stroke = 'currentColor',
  strokeWidth = 1.5,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      className={className}
      {...props} // Spread additional props
    >
      <g
        fill="none"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      >
        <circle cx="12" cy="12" r="1" />
        <circle cx="12" cy="12" r="9" />
      </g>
    </svg>
  );
};

CircularButton.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  className: PropTypes.string,
};

export default CircularButton;
