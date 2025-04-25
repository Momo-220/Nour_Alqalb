import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // SVG XML minifié de icon.svg
      <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" stroke="#BD8C27" strokeWidth="2" fill="none" />
        <path 
          d="M50 15l21.5 9L89 50l-9 21.5L50 89l-21.5-9L15 50l9-21.5L50 15z" 
          stroke="#BD8C27" 
          strokeWidth="1.5" 
          fill="none" 
          opacity="0.5"
        />
        <path 
          d="M50 22.5c-11 0-20 9-20 20 0 11 9 15 20 15s20-4 20-15c0-11-9-20-20-20z" 
          fill="#BD8C27" 
        />
        <rect x="47.5" y="57.5" width="5" height="17.5" fill="#BD8C27" />
        <path 
          d="M63.75 37.5c-3.5-6.25-10-10-17.5-10-11 0-20 9-20 20 0 3.5 1.25 6.75 2.5 10 1.25-11 10.75-17.5 21.25-17.5 5.5 0 10.5 1.5 13.75 5 0 0 0-5 0-7.5z" 
          fill="#FFFFFF" 
          strokeWidth="1"
          stroke="#BD8C27"
        />
        <path 
          d="M50 30l2.5 5.75h5.75l-4.75 3.5 1.75 5.75-5.25-3.75-5.25 3.75 1.75-5.75-4.75-3.5h5.75z" 
          fill="#BD8C27" 
          opacity="0.9" 
        />
      </svg>
    ),
    { ...size }
  );
} 