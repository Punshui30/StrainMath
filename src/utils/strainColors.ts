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
  // Original palette with increased intensity (hue preserved)
  'Blue Dream': '#16CAB7',        // from #14B8A6 (hue preserved, +intensity)
  'Northern Lights': '#12CC8E',   // from #10B981
  'Blueberry': '#09A0C4',         // from #0891B2
  'Sour Diesel': '#FFAE0C',       // from #F59E0B (capped at 255)
  'OG Kush': '#EF8307',           // from #D97706
  'Girl Scout Cookies': '#F22A2A', // from #DC2626
  'Granddaddy Purple': '#A238FF', // from #9333EA
  'Jack Herer': '#FFC509',        // from #EAB308 (capped at 255)
  'White Widow': '#07C8E9',       // from #06B6D4
  'Amnesia Haze': '#91E018',      // from #84CC16
};

/**
 * Get the accent color for a strain
 * Returns the solid color token for visual correlation
 */
export function getStrainColor(strainName: string): string {
  const color = strainColorMap[strainName];
  if (!color) {
    console.error(`[strainColors] Missing color for strain: "${strainName}"`);
    return '#E9C13D'; // Fallback to driver gold (original hue, intensity up)
  }
  return color;
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
