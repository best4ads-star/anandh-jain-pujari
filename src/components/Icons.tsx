import React from 'react';

export function GoldLeafBranch({ className = "w-10 h-10 text-[#B58A3C]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20,80 C35,65 50,45 80,20 C70,35 60,60 20,80 Z"
        opacity="0.2"
      />
      <path
        d="M20,80 C32,68 45,52 75,25"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Leaves branching left and right */}
      <path
        d="M32,68 C22,64 18,52 25,46 C32,46 34,56 32,68 Z"
        fill="currentColor"
      />
      <path
        d="M42,56 C46,46 42,34 50,30 C56,34 52,48 42,56 Z"
        fill="currentColor"
      />
      <path
        d="M48,50 C38,44 36,32 44,28 C50,30 50,42 48,50 Z"
        fill="currentColor"
      />
      <path
        d="M58,38 C62,28 60,18 68,16 C73,20 68,32 58,38 Z"
        fill="currentColor"
      />
      <path
        d="M62,34 C54,26 55,16 63,14 C68,18 66,28 62,34 Z"
        fill="currentColor"
      />
      <path
        d="M75,25 C78,16 85,12 88,14 C88,20 82,24 75,25 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TempleIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Temple Gopuram / Shikhara layered silhouette */}
      <path d="M12 2L15 6H9L12 2Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M7 6H17L18 9H6L7 6Z" />
      <path d="M5 9H19L20 13H4L5 9Z" />
      <path d="M3 13H21V21H3V13Z" />
      <path d="M9 21V16H15V21" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <circle cx="12" cy="1.5" r="0.8" fill="currentColor" />
    </svg>
  );
}
