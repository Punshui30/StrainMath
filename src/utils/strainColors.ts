/**
 * Strain Color Tokens
 * 
 * One-to-one color mapping for visual traceability.
 * Each strain has a dedicated color used across:
 * - Strain cards (accent indicator)
 * - Blend ring segments
 * - Result cards
 */

export const strainColorMap: Record<string, string> = {
  // Primary strains - Electric/Neon colors
  'Blue Dream': '#00FFE5',        // Electric cyan (from #14B8A6)
  'Northern Lights': '#00FF88',   // Electric green (from #10B981)
  'Blueberry': '#00D4FF',         // Electric blue (from #0891B2)
  'Sour Diesel': '#FFB800',       // Electric amber (from #F59E0B)
  'OG Kush': '#FF6B00',           // Electric orange (from #D97706)
  'Girl Scout Cookies': '#FF0040', // Electric red (from #DC2626)
  'Granddaddy Purple': '#B400FF', // Electric purple (from #9333EA)
  'Jack Herer': '#FFE500',        // Electric yellow (from #EAB308)
  'White Widow': '#00B8FF',       // Electric sky (from #06B6D4)
  'Amnesia Haze': '#88FF00',      // Electric lime (from #84CC16)
};

/**
 * Get the accent color for a strain
 * Returns the solid color token for visual correlation
 */
export function getStrainColor(strainName: string): string {
  return strainColorMap[strainName] || '#D4AF37'; // Fallback to gold
}

/**
 * Get the gradient for blend ring segments
 * Creates a gradient from the base color
 */
export function getStrainGradient(strainName: string): string {
  const baseColor = getStrainColor(strainName);
  // Create a lighter variant for gradient end
  return `linear-gradient(135deg, ${baseColor}, ${baseColor}CC)`;
}

/**
 * Get the glow color for a strain (with alpha)
 */
export function getStrainGlow(strainName: string, alpha: number = 0.4): string {
  const baseColor = getStrainColor(strainName);
  // Convert hex to rgba
  const r = parseInt(baseColor.slice(1, 3), 16);
  const g = parseInt(baseColor.slice(3, 5), 16);
  const b = parseInt(baseColor.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
