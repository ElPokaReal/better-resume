interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 32, className = '' }: LogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background - solid blue */}
      <rect width="32" height="32" rx="7" fill="#3B82F6"/>
      
      {/* Document icon */}
      <rect x="7" y="5" width="18" height="22" rx="2" fill="white"/>
      
      {/* Document fold corner */}
      <path d="M 20 5 L 20 10 L 25 10 L 20 5 Z" fill="#E5E7EB"/>
      
      {/* Header line (name) */}
      <rect x="10" y="9" width="10" height="2" rx="1" fill="#1F2937"/>
      
      {/* Content lines */}
      <rect x="10" y="13" width="12" height="1.5" rx="0.75" fill="#9CA3AF"/>
      <rect x="10" y="16" width="11" height="1.5" rx="0.75" fill="#9CA3AF"/>
      <rect x="10" y="19" width="13" height="1.5" rx="0.75" fill="#9CA3AF"/>
      <rect x="10" y="22" width="9" height="1.5" rx="0.75" fill="#9CA3AF"/>
    </svg>
  );
}
