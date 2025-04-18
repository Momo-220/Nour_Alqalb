import Link from 'next/link';

interface LogoProps {
  href?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'light' | 'dark';
}

export default function Logo({ 
  href = '/', 
  showText = true, 
  size = 'md',
  className = '',
  variant = 'light'
}: LogoProps) {
  // Déterminer la taille du logo en fonction de la prop size
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  // Déterminer la taille du texte en fonction de la prop size
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  // Couleurs en fonction de la variante
  const colors = {
    light: {
      primary: '#BD8C27',     // Ambre doré
      secondary: '#FFFFFF',   // Blanc
      tertiary: '#BD8C2730',  // Ambre doré semi-transparent
      text: 'text-amber-500', // Texte ambre
      textSecondary: 'text-white' // Texte blanc
    },
    dark: {
      primary: '#BD8C27',     // Ambre doré
      secondary: '#1A0F02',   // Fond foncé
      tertiary: '#BD8C2730',  // Ambre doré semi-transparent
      text: 'text-amber-500', // Texte ambre
      textSecondary: 'text-amber-200' // Texte ambre clair
    }
  };

  const currentColors = colors[variant];

  const logoContent = (
    <div className={`flex items-center ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Logo SVG minimaliste mais plus islamique */}
        <svg 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Cercle extérieur */}
          <circle cx="20" cy="20" r="19" stroke={currentColors.primary} strokeWidth="1.5" fill="none" />
          
          {/* Motif islamique - forme octogonale */}
          <path 
            d="M20 6l8.5 3.5L32 18l-3.5 8.5L20 34l-8.5-3.5L8 18l3.5-8.5L20 6z" 
            stroke={currentColors.primary} 
            strokeWidth="0.75" 
            fill="none" 
            opacity="0.5"
          />
          
          {/* Dôme de mosquée stylisé */}
          <path 
            d="M20 9c-4.4 0-8 3.6-8 8 0 4.4 3.6 6 8 6s8-1.6 8-6c0-4.4-3.6-8-8-8z" 
            fill={currentColors.primary} 
          />
          
          {/* Minaret stylisé */}
          <rect x="19" y="23" width="2" height="7" fill={currentColors.primary} />
          
          {/* Croissant de lune */}
          <path 
            d="M25.5 15c-1.4-2.5-4-4-7-4-4.4 0-8 3.6-8 8 0 1.4 0.5 2.7 1 4 0.5-4.4 4.3-7 8.5-7 2.2 0 4.2 0.6 5.5 2 0 0 0-2 0-3z" 
            fill={currentColors.secondary} 
            strokeWidth="0.5"
            stroke={currentColors.primary}
          />
          
          {/* Étoile à 8 branches - design islamique */}
          <path 
            d="M20 12l1 2.3h2.3l-1.9 1.4 0.7 2.3-2.1-1.5-2.1 1.5 0.7-2.3-1.9-1.4h2.3z" 
            fill={currentColors.primary} 
            opacity="0.9" 
          />
          
          {/* Points cardinaux ornementaux */}
          <path d="M20 4l0.5 2h-1l0.5-2z" fill={currentColors.primary} />
          <path d="M20 34l0.5 2h-1l0.5-2z" fill={currentColors.primary} />
          <path d="M4 20l2 0.5v-1l-2 0.5z" fill={currentColors.primary} />
          <path d="M34 20l2 0.5v-1l-2 0.5z" fill={currentColors.primary} />
        </svg>
      </div>
      
      {showText && (
        <div className={`ml-3 font-medium ${textSizeClasses[size]}`}>
          <span className={`${currentColors.text} font-semibold font-amiri`}>Nour</span>{' '}
          <span className={`${currentColors.textSecondary} font-normal`}>Al-Qalb</span>
        </div>
      )}
    </div>
  );

  // Si un href est fourni, englober le contenu dans un Link
  if (href) {
    return (
      <Link href={href}>
        {logoContent}
      </Link>
    );
  }

  // Sinon, retourner simplement le contenu
  return logoContent;
} 