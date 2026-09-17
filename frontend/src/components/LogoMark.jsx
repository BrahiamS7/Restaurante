export default function LogoMark({ size = 42 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Logo de La Brasa"
    >
      <rect x="4" y="4" width="92" height="92" rx="20" fill="#241512" />

      <path
        d="M50 20 C58 28 62 36 58 44 C56 48 52 49 51 46 C53 41 51 37 48 35 C49 40 46 44 42 46 C36 49 33 56 37 63 C40 68 46 70 51 68 C58 65 62 58 59 51 C63 54 66 59 65 65 C63 74 54 80 45 78 C35 76 28 66 31 56 C33 49 39 45 42 40 C38 42 34 46 33 51 C30 46 31 39 35 34 C39 29 45 24 50 20 Z"
        fill="#E8763C"
      />
      <path
        d="M50 33 C54 38 56 43 53 47 C52 49 49 49 49 47 C50 44 49 42 47 40 C48 44 45 47 42 49 C38 51 36 56 39 60 C41 63 45 64 48 62 C52 60 54 56 52 52 C55 54 57 58 55 62 C53 67 47 70 42 68 C36 66 33 60 35 54 C37 50 41 47 43 44 C40 45 38 48 37 51 C35 47 36 43 39 39 C42 36 46 34 50 33 Z"
        fill="#F7B23B"
      />

      <g stroke="#F5F0E8" strokeWidth="4.4" strokeLinecap="round">
        <line x1="27" y1="58" x2="70" y2="72" />
        <circle cx="33.5" cy="60" r="4.6" fill="#F5F0E8" stroke="none" />
        <circle cx="44" cy="63.3" r="4.6" fill="#F5F0E8" stroke="none" />
        <circle cx="54.5" cy="66.6" r="4.6" fill="#F5F0E8" stroke="none" />
      </g>

      <g stroke="#F5F0E8" strokeWidth="4.4" strokeLinecap="round">
        <line x1="30" y1="74" x2="73" y2="60" />
        <circle cx="39.5" cy="70.6" r="4.6" fill="#F5F0E8" stroke="none" />
        <circle cx="50" cy="67.3" r="4.6" fill="#F5F0E8" stroke="none" />
        <circle cx="60.5" cy="64" r="4.6" fill="#F5F0E8" stroke="none" />
      </g>
    </svg>
  );
}
