import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Share, RefreshCw } from 'lucide-react';
import { BlendResultCard } from '../components/BlendResultCard';
import { decodeBlend } from '../utils/blendSerializer';
import type { BlendRecommendation } from '../types/blend';

export function MobileBlendView() {
    const [blend, setBlend] = useState<BlendRecommendation | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Basic query param parsing to avoid router dependencies
        const params = new URLSearchParams(window.location.search);
        const payload = params.get('b');

        if (payload) {
            const decoded = decodeBlend(payload);
            if (decoded) {
                setBlend(decoded);
            } else {
                setError("Invalid blend data.");
            }
        } else {
            setError("No blend specified in URL.");
        }
    }, []);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: blend?.name || 'Strain Math',
                    text: `Check out this ${blend?.name} blend: ${blend?.vibeEmphasis}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.error("Share failed", err);
            }
        } else {
            alert("Use browser menu to share URL.");
        }
    };

    const handleRecreate = () => {
        window.location.href = '/';
    };

    if (error) {
        return (
            <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-8 text-center text-white">
                <div>
                    <h1 className="text-xl mb-2">Error</h1>
                    <p className="text-white/50">{error}</p>
                    <button onClick={handleRecreate} className="mt-8 px-6 py-3 bg-white/10 rounded-full text-sm">
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    if (!blend) {
        return (
            <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center text-white/30">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0B] overflow-y-auto pb-24">
            <header className="p-6 flex justify-center border-b border-white/5">
                <div className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">Strain Math</div>
            </header>

            <main className="p-6 flex flex-col items-center">
                {/* Reuse existing card */}
                <BlendResultCard
                    blend={blend}
                    isSelected={true}
                    onSelect={() => { }}
                    index={0}
                />

                <div className="w-full max-w-[320px] mt-8 grid grid-cols-2 gap-4">
                    <button
                        onClick={handleRecreate}
                        className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 text-center"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60">
                            <RefreshCw size={20} />
                        </div>
                        <div>
                            <div className="text-sm text-white font-medium">Recreate</div>
                        </div>
                    </button>

                    <button
                        onClick={handleShare}
                        className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-center"
                    >
                        <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                            <Share size={20} />
                        </div>
                        <div>
                            <div className="text-sm text-[#D4AF37] font-medium">Share</div>
                        </div>
                    </button>
                </div>
            </main>
        </div>
    );
}
