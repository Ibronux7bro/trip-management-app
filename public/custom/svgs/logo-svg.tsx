import React from 'react';

const LogoSVG = ({
  width = 28,
  height = 28,
  fill = '#006C35', // Saudi Green default
  title = 'أسطول المملكة - الشعار',
  className,
  ...props
}: {
  width?: number;
  height?: number;
  fill?: string;
  className?: string;
  title?: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={width}
      height={height}
      role="img"
      aria-labelledby="logo-title"
      className={className}
      {...props}
    >
      <title id="logo-title">{title}</title>
      {/* Green roundel background */}
      <circle cx="32" cy="32" r="30" fill={fill} />
      {/* Thin golden ring */}
      <circle cx="32" cy="32" r="30" fill="none" stroke="#CBB26A" strokeWidth="2" />
      {/* Arabic monogram 'شه' simplified */}
      <g fill="#FFFFFF" transform="translate(14,14)">
        {/* ش shape */}
        <path d="M8 12c0-4 3-7 7-7h10c2 0 3 1 3 3v2c0 1-.9 2-2 2h-9c-2 0-3 1-3 3v12c0 1.1-.9 2-2 2h-2c-1.1 0-2-.9-2-2V12z" />
        {/* ه shape (rounded square with notch) */}
        <path d="M26 12h8c2.2 0 4 1.8 4 4v8c0 2.2-1.8 4-4 4h-8c-2.2 0-4-1.8-4-4v-8c0-2.2 1.8-4 4-4zm0 6v4c0 .6.4 1 1 1h6c.6 0 1-.4 1-1v-4c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1z" />
        {/* three diacritics dots for ش */}
        <circle cx="17" cy="6" r="1.4" />
        <circle cx="20" cy="5" r="1.4" />
        <circle cx="23" cy="6" r="1.4" />
      </g>
    </svg>
  );
};

export default LogoSVG;
