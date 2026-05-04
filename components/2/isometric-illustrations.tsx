export function IsometricBrowser() {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-[180px] mx-auto">
      {/* Base shadow */}
      <path d="M20 130 L100 170 L180 130 L100 90 Z" fill="currentColor" fillOpacity="0.04" />
      {/* Browser body */}
      <path d="M40 50 L100 20 L160 50 L100 80 Z" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <path d="M40 50 L40 110 L100 140 L100 80 Z" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <path d="M100 80 L100 140 L160 110 L160 50 Z" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      {/* Browser chrome */}
      <path d="M40 50 L100 20 L160 50 L100 80 Z" fill="currentColor" fillOpacity="0.08" />
      {/* Dots */}
      <circle cx="65" cy="52" r="2.5" fill="#EF4444" fillOpacity="0.8" />
      <circle cx="75" cy="47" r="2.5" fill="#F59E0B" fillOpacity="0.8" />
      <circle cx="85" cy="42" r="2.5" fill="#10B981" fillOpacity="0.8" />
      {/* Content lines */}
      <path d="M55 75 L85 60" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" />
      <path d="M55 85 L75 75" stroke="currentColor" strokeOpacity="0.12" strokeWidth="2" strokeLinecap="round" />
      <path d="M55 95 L70 87" stroke="currentColor" strokeOpacity="0.12" strokeWidth="2" strokeLinecap="round" />
      {/* Primary accent block */}
      <path d="M110 65 L140 50 L140 70 L110 85 Z" fill="#3B82F6" fillOpacity="0.2" />
      <path d="M110 85 L140 70 L140 90 L110 105 Z" fill="#3B82F6" fillOpacity="0.12" />
    </svg>
  );
}

export function IsometricForm() {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-[180px] mx-auto">
      {/* Base shadow */}
      <path d="M20 130 L100 170 L180 130 L100 90 Z" fill="currentColor" fillOpacity="0.04" />
      {/* Form card */}
      <path d="M50 60 L100 35 L150 60 L100 85 Z" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <path d="M50 60 L50 110 L100 135 L100 85 Z" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <path d="M100 85 L100 135 L150 110 L150 60 Z" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      {/* Input fields */}
      <path d="M60 78 L90 63 L90 73 L60 88 Z" fill="currentColor" fillOpacity="0.1" />
      <path d="M60 93 L85 80 L85 90 L60 103 Z" fill="currentColor" fillOpacity="0.06" />
      {/* Submit button */}
      <path d="M60 108 L95 90 L95 100 L60 118 Z" fill="#3B82F6" fillOpacity="0.25" />
      {/* Floating message bubble */}
      <path d="M120 45 L145 32 L145 52 L120 65 Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <path d="M120 45 L120 65 L105 72 L105 52 Z" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <path d="M125 52 L138 45" stroke="#3B82F6" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M125 58 L132 54" stroke="#3B82F6" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IsometricEmbed() {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-[180px] mx-auto">
      {/* Base shadow */}
      <path d="M20 130 L100 170 L180 130 L100 90 Z" fill="currentColor" fillOpacity="0.04" />
      {/* Code block */}
      <path d="M45 55 L100 27 L155 55 L100 83 Z" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <path d="M45 55 L45 105 L100 133 L100 83 Z" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <path d="M100 83 L100 133 L155 105 L155 55 Z" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      {/* Code lines */}
      <path d="M58 72 L78 62" stroke="#3B82F6" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
      <path d="M58 82 L88 67" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" strokeLinecap="round" />
      <path d="M58 92 L82 80" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" strokeLinecap="round" />
      <path d="M58 102 L72 95" stroke="#10B981" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
      {/* Brackets */}
      <path d="M115 65 L108 70 L115 75" stroke="#F59E0B" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M135 65 L142 70 L135 75" stroke="#F59E0B" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Floating widget */}
      <path d="M125 35 L150 22 L150 42 L125 55 Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <path d="M125 35 L125 55 L110 62 L110 42 Z" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <path d="M130 45 L142 38" stroke="#3B82F6" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
