import { Mail, MessageSquare } from 'lucide-react';
import type { BlendRecommendation } from '../types/blend';

interface ShareActionsProps {
    blend: BlendRecommendation;
    userText?: string;
}

export function ShareActions({ blend, userText }: ShareActionsProps) {
    const generateSharePayload = () => {
        const payload = {
            blendName: blend.name,
            ratios: blend.components.map(c => `${c.name}: ${c.percentage}%`).join(', '),
            terpenes: blend.components.flatMap(c => c.terpenes).slice(0, 5).join(', '),
            userRequest: userText || 'Custom blend',
            timestamp: new Date().toISOString(),
        };
        return payload;
    };

    const handleEmail = () => {
        const payload = generateSharePayload();
        const subject = encodeURIComponent(`Your Custom Blend: ${payload.blendName}`);
        const body = encodeURIComponent(
            `Blend: ${payload.blendName}\n\nRatios:\n${payload.ratios}\n\nKey Terpenes: ${payload.terpenes}\n\nBased on: "${payload.userRequest}"\n\nPrepared using available inventory at time of recommendation.`
        );
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    const handleText = () => {
        const payload = generateSharePayload();
        const message = encodeURIComponent(
            `${payload.blendName}: ${payload.ratios}. Key terpenes: ${payload.terpenes}`
        );
        window.location.href = `sms:?body=${message}`;
    };

    return (
        <div className="flex gap-3 mt-6">
            <button
                onClick={handleEmail}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 
                   bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 
                   hover:border-[#D4AF37]/30 rounded-xl transition-all duration-300 group"
            >
                <Mail className="w-4 h-4 text-white/40 group-hover:text-[#D4AF37]/80 transition-colors" />
                <span className="text-xs text-white/60 group-hover:text-white/90 transition-colors">
                    Email Blend
                </span>
            </button>

            <button
                onClick={handleText}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 
                   bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 
                   hover:border-[#D4AF37]/30 rounded-xl transition-all duration-300 group"
            >
                <MessageSquare className="w-4 h-4 text-white/40 group-hover:text-[#D4AF37]/80 transition-colors" />
                <span className="text-xs text-white/60 group-hover:text-white/90 transition-colors">
                    Text Blend
                </span>
            </button>
        </div>
    );
}
