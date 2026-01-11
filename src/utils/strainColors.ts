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
  // Primary strains
  'Blue Dream': '#14B8A6',        // Teal
  'Northern Lights': '#10B981',   // Emerald
  'Blueberry': '#0891B2',         // Cyan
  'Sour Diesel': '#F59E0B',       // Amber
  'OG Kush': '#D97706',           // Orange
  'Girl Scout Cookies': '#DC2626', // Red
  'Granddaddy Purple': '#9333EA', // Purple
  'Jack Herer': '#EAB308',        // Yellow
  'White Widow': '#06B6D4',       // Sky
  'Amnesia Haze': '#84CC16',      // Lime
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
