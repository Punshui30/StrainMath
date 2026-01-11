import type { BlendRecommendation } from '../types/blend';
import { getStrainColor } from './strainColors';

/**
 * Minified Blend Schema for URL encoding
 * n: Name
 * d: Driver [name, %]
 * m: Modulator [name, %]
 * a: Anchor [name, %]
 * c: Confidence Range
 * i: Vibes/Intent string
 */
interface MinifiedBlend {
    n: string;
    d: [string, number];
    m: [string, number];
    a: [string, number];
    c: string;
    i: string;
}

/**
 * Serializes a BlendRecommendation into a URL-safe string.
 */
export function encodeBlend(blend: BlendRecommendation): string {
    if (!blend || !blend.components || blend.components.length < 3) return '';

    const driver = blend.components.find(c => c.role === 'Driver')!;
    const modulator = blend.components.find(c => c.role === 'Modulator')!;
    const anchor = blend.components.find(c => c.role === 'Anchor')!;

    const minified: MinifiedBlend = {
        n: blend.name,
        d: [driver.name, driver.percentage],
        m: [modulator.name, modulator.percentage],
        a: [anchor.name, anchor.percentage],
        c: blend.confidenceRange,
        i: blend.vibeEmphasis
    };

    try {
        return encodeURIComponent(JSON.stringify(minified));
    } catch (e) {
        console.error('Failed to encode blend', e);
        return '';
    }
}

/**
 * Deserializes a URL string back into a BlendRecommendation.
 * Re-hydrates colors and other UI properties.
 */
export function decodeBlend(payload: string): BlendRecommendation | null {
    try {
        const minified: MinifiedBlend = JSON.parse(decodeURIComponent(payload));

        // Validate schema basic shape
        if (!minified.n || !Array.isArray(minified.d)) return null;

        const components = [
            {
                name: minified.d[0],
                role: 'Driver',
                percentage: minified.d[1],
                type: 'Hybrid', // Default, logic could be improved if strain map available
                description: 'Driver strain',
                terpenes: []
            },
            {
                name: minified.m[0],
                role: 'Modulator',
                percentage: minified.m[1],
                type: 'Hybrid',
                description: 'Modulator strain',
                terpenes: []
            },
            {
                name: minified.a[0],
                role: 'Anchor',
                percentage: minified.a[1],
                type: 'Hybrid',
                description: 'Anchor strain',
                terpenes: []
            }
        ];

        return {
            id: 999, // Ephemeral ID
            name: minified.n,
            vibeEmphasis: minified.i,
            confidenceRange: minified.c || '90-95%',
            isPrimary: true,
            components: components.map(c => ({
                ...c,
                arcColor: getArcColor(c.role),
                // Note: getArcColor might not be exported, we might need a local helper or import
            })) as any,
            targets: {} // Empty for view-only
        };
    } catch (e) {
        console.error('Failed to decode blend', e);
        return null;
    }
}

/**
 * Helper to get arc colors for re-hydration
 */
function getArcColor(role: 'Driver' | 'Modulator' | 'Anchor'): string {
    switch (role) {
        case 'Driver': return 'from-[#14B8A6] to-[#5EEAD4]';
        case 'Modulator': return 'from-[#10B981] to-[#6EE7B7]';
        case 'Anchor': return 'from-[#0891B2] to-[#67E8F9]';
        default: return 'from-gray-500 to-gray-300';
    }
}
