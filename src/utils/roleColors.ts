/**
 * Role-based color system for blend components
 * Provides consistent visual encoding of Driver/Modulator/Anchor roles
 */

export const ROLE_COLORS = {
    DRIVER: '#FFD700',      // Electric gold (from #D4AF37)
    MODULATOR: '#00FFE5',   // Electric cyan (from #14B8A6)
    ANCHOR: '#C77DFF',      // Electric purple (from #8B7BA8)
} as const;

export type BlendRole = 'Driver' | 'Modulator' | 'Anchor';

/**
 * Get the color for a given blend role
 */
export function getRoleColor(role: string): string {
    const normalizedRole = role.toLowerCase();

    if (normalizedRole.includes('driver')) {
        return ROLE_COLORS.DRIVER;
    }
    if (normalizedRole.includes('modulator')) {
        return ROLE_COLORS.MODULATOR;
    }
    if (normalizedRole.includes('anchor')) {
        return ROLE_COLORS.ANCHOR;
    }

    // Default to gold if role is unrecognized
    return ROLE_COLORS.DRIVER;
}

/**
 * Adjust color saturation based on confidence percentage
 * Higher confidence = more vivid color
 */
export function adjustSaturationByConfidence(color: string, confidencePercent: number): string {
    // Parse confidence (e.g., "92-98%" -> use midpoint 95)
    const match = confidencePercent.toString().match(/(\d+)/);
    if (!match) return color;

    const confidence = parseInt(match[1]);

    // Map 90-100% to 0.7-1.0 opacity multiplier
    const saturationMultiplier = 0.7 + ((confidence - 90) / 10) * 0.3;

    return color + Math.round(saturationMultiplier * 255).toString(16).padStart(2, '0');
}
