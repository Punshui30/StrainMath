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
  'Blue Dream': '#00FFE5',        // Electric cyan
  'Northern Lights': '#00FF88',   // Electric green
  'Blueberry': '#00D4FF',         // Electric blue
  'Sour Diesel': '#FFB800',       // Electric amber
  'OG Kush': '#FF6B00',           // Electric orange
  'Girl Scout Cookies': '#FF0040', // Electric red
  'Granddaddy Purple': '#B400FF', // Electric purple
  'Jack Herer': '#FFE500',        // Electric yellow
  'White Widow': '#00B8FF',       // Electric sky
  'Amnesia Haze': '#88FF00',      // Electric lime
  
  // Additional strains - Electric/Neon colors
  'Green Crack': '#00FFAA',       // Electric green-cyan
  'Bubba Kush': '#FF00CC',        // Electric magenta
  'Durban Poison': '#FFAA00',    // Electric orange-yellow
  'Wedding Cake': '#FF00FF',      // Electric fuchsia
  'Gorilla Glue #4': '#FF6600',  // Electric deep orange
  'Pineapple Express': '#FFD400', // Electric yellow-gold
  'Strawberry Cough': '#FF0066',  // Electric pink-red
  'Purple Punch': '#CC00FF',      // Electric violet
  'AK-47': '#FF3300',            // Electric red-orange
  'Super Lemon Haze': '#FFFF00',  // Electric pure yellow
  'Gelato': '#FF00AA',           // Electric hot pink
  'Skywalker OG': '#AA00FF',     // Electric purple-blue
  'Trainwreck': '#FF8800',       // Electric bright orange
  'Cherry Pie': '#FF0066',       // Electric pink
  'Zkittlez': '#FF00DD',         // Electric magenta-pink
  'Maui Wowie': '#00FFDD',       // Electric cyan-green
  'Chemdawg': '#FF4400',         // Electric red-orange
  'LA Confidential': '#FF00BB',  // Electric hot pink
  'Tangie': '#FFAA00',           // Electric orange-yellow
  'Do-Si-Dos': '#FF00EE',        // Electric magenta
  'Harlequin': '#00FFBB',        // Electric cyan-green
  'Sunset Sherbet': '#FF0099',   // Electric pink-magenta
  'Bruce Banner': '#FF2200',     // Electric red
  'Purple Haze': '#DD00FF',      // Electric purple-pink
  'Runtz': '#FF00CC',            // Electric magenta
  'Critical Kush': '#FF00AA',    // Electric hot pink
  'Mango Kush': '#FF9900',       // Electric orange
  'Death Star': '#FF00DD',       // Electric magenta
  'Candyland': '#FFAA00',        // Electric orange-yellow
  'Headband': '#FF00BB',         // Electric hot pink
  'Mimosa': '#FFFF00',           // Electric pure yellow
  'Animal Cookies': '#FF0066',   // Electric pink-red
  'Tahoe OG': '#FF00AA',         // Electric hot pink
  'Acapulco Gold': '#FFD400',    // Electric yellow-gold
  'Lemon Haze': '#FFFF00',       // Electric pure yellow
  'Cookies and Cream': '#FF00EE', // Electric magenta
  'Master Kush': '#FF00CC',      // Electric magenta
  'Chem Dawg #4': '#FF4400',     // Electric red-orange
  'Biscotti': '#FF00DD',         // Electric magenta
  'Forbidden Fruit': '#FF00AA',   // Electric hot pink
  'Clementine': '#FFAA00',       // Electric orange-yellow
  'Slurricane': '#FF00BB',       // Electric hot pink
  'Sour Tangie': '#FFFF00',      // Electric pure yellow
  'MAC': '#FF00CC',              // Electric magenta
  'Ice Cream Cake': '#FF00EE',   // Electric magenta
  'Strawberry Banana': '#FF0066', // Electric pink-red
  'Platinum OG': '#FF00DD',      // Electric magenta
  'Lemon Kush': '#FFFF00',       // Electric pure yellow
  'Pink Kush': '#FF00AA',        // Electric hot pink
  'Chiesel': '#FF00BB',          // Electric hot pink
};

/**
 * Get the accent color for a strain
 * Returns the solid color token for visual correlation
 */
export function getStrainColor(strainName: string): string {
  const color = strainColorMap[strainName];
  if (!color) {
    console.error(`[strainColors] Missing color for strain: "${strainName}"`);
    return '#FFD700'; // Fallback only for missing mappings (should not happen)
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
