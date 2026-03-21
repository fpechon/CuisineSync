export default function Logo({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M 25.5 21.5 A 11 11 0 0 1 5 16" stroke="#C4451A" strokeWidth="2" strokeLinecap="round"/>
      <path d="M 3.5 18.5 L 5 16 L 6.5 18.5" stroke="#C4451A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 6.5 10.5 A 11 11 0 0 1 27 16" stroke="#C4451A" strokeWidth="2" strokeLinecap="round"/>
      <path d="M 25.5 13.5 L 27 16 L 28.5 13.5" stroke="#C4451A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="12.75" y="10" width="1.5" height="5" rx="0.75" fill="#C4451A"/>
      <rect x="15.25" y="10" width="1.5" height="5" rx="0.75" fill="#C4451A"/>
      <rect x="17.75" y="10" width="1.5" height="5" rx="0.75" fill="#C4451A"/>
      <rect x="14.5" y="15" width="3" height="7" rx="1.5" fill="#C4451A"/>
    </svg>
  );
}
