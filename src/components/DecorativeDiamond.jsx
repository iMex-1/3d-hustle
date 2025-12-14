import React from 'react';

/**
 * Decorative Diamond Component
 * A reusable Moroccan-style diamond/lozenge shape for filling gaps and adding visual interest
 */
const DecorativeDiamond = ({ 
  size = 'md', 
  variant = 'outline', 
  className = '', 
  animated = false,
  nested = false 
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6', 
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24',
    '3xl': 'w-32 h-32'
  };

  const variantClasses = {
    outline: 'border-2 border-accent/30 bg-transparent',
    filled: 'bg-accent border-2 border-accent',
    gradient: 'bg-gradient-to-br from-accent to-terracotta border-2 border-accent/50',
    subtle: 'border border-accent/20 bg-accent/5',
    gold: 'border-2 border-gold/40 bg-gold/10'
  };

  const baseClasses = `
    ${sizeClasses[size]} 
    ${variantClasses[variant]}
    rotate-45 
    relative 
    ${animated ? 'animate-pulse' : ''}
    ${className}
  `;

  return (
    <div className={baseClasses}>
      {nested && (
        <div className="absolute inset-2 border border-accent/20 rotate-0" />
      )}
    </div>
  );
};

/**
 * Decorative Diamond Group
 * Multiple diamonds arranged in patterns
 */
export const DecorativeDiamondGroup = ({ 
  pattern = 'line', 
  count = 3, 
  size = 'sm',
  className = '' 
}) => {
  const patterns = {
    line: 'flex items-center gap-4',
    grid: 'grid grid-cols-3 gap-2',
    cluster: 'flex flex-wrap items-center justify-center gap-2'
  };

  return (
    <div className={`${patterns[pattern]} ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <DecorativeDiamond 
          key={i} 
          size={size}
          variant={i === Math.floor(count / 2) ? 'filled' : 'outline'}
          animated={i === Math.floor(count / 2)}
        />
      ))}
    </div>
  );
};

/**
 * Section Divider with Decorative Elements
 * Perfect for filling gaps between sections
 */
export const DecorativeSectionDivider = ({ 
  showDiamonds = true, 
  showLines = true,
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center gap-6 py-8 ${className}`}>
      {showLines && <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent max-w-24" />}
      
      {showDiamonds && (
        <div className="flex items-center gap-3">
          <DecorativeDiamond size="xs" variant="outline" />
          <DecorativeDiamond size="sm" variant="filled" animated />
          <DecorativeDiamond size="xs" variant="outline" />
        </div>
      )}
      
      {showLines && <div className="flex-1 h-px bg-gradient-to-l from-transparent via-accent/30 to-transparent max-w-24" />}
    </div>
  );
};

/**
 * Corner Ornament
 * Decorative corner elements for cards and sections
 */
export const CornerOrnament = ({ 
  position = 'top-right', 
  size = 'md',
  className = '' 
}) => {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4', 
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  return (
    <div className={`absolute ${positionClasses[position]} ${className}`}>
      <DecorativeDiamond size={size} variant="subtle" nested />
    </div>
  );
};

/**
 * Floating Decorative Elements
 * For background decoration and visual interest
 */
export const FloatingDecorations = ({ density = 'low', className = '' }) => {
  const densityConfig = {
    low: { count: 3, sizes: ['xs', 'sm', 'xs'] },
    medium: { count: 5, sizes: ['xs', 'sm', 'md', 'sm', 'xs'] },
    high: { count: 8, sizes: ['xs', 'sm', 'xs', 'md', 'xs', 'sm', 'xs', 'sm'] }
  };

  const config = densityConfig[density];

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {Array.from({ length: config.count }, (_, i) => (
        <div
          key={i}
          className="absolute opacity-20"
          style={{
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
            animationDelay: `${Math.random() * 3}s`
          }}
        >
          <DecorativeDiamond 
            size={config.sizes[i]} 
            variant="outline"
            animated={Math.random() > 0.7}
          />
        </div>
      ))}
    </div>
  );
};

export default DecorativeDiamond;