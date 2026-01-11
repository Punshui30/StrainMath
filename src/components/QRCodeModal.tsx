import { X } from 'lucide-react';
import QRCode from 'react-qr-code';
import { motion, AnimatePresence } from 'framer-motion';
import type { BlendRecommendation } from '../types/blend';
import { encodeBlend } from '../utils/blendSerializer';
import logoImage from '../assets/logo.png';

interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    blend: BlendRecommendation;
}

export function QRCodeModal({ isOpen, onClose, blend }: QRCodeModalProps) {
    if (!isOpen) return null;

    // Generate URL
    const payload = encodeBlend(blend);
    // Construct full URL relative to current origin, assuming /blend route
    const shareUrl = `${window.location.protocol}//${window.location.host}/blend?b=${payload}`;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-sm bg-[#1C2023] border border-white/10 rounded-3xl p-8 flex flex-col items-center shadow-2xl"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    {/* QR Container */}
                    <div className="w-full aspect-square bg-[#0A0A0B] rounded-2xl p-6 flex items-center justify-center relative mb-6 border border-white/5">
                        <div className="relative w-full h-full bg-white/5 rounded-xl p-4 flex items-center justify-center overflow-hidden">
                            <QRCode
                                value={shareUrl}
                                size={256}
                                bgColor="#0A0A0B"
                                fgColor="#D4AF37" // Muted gold
                                level="Q" // Higher error correction for logo overlay
                                type="svg"
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            />

                            {/* Centered Logo Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-[20%] h-[20%] bg-[#0A0A0B] rounded-full flex items-center justify-center p-1 shadow-lg border border-[#D4AF37]/20">
                                    <img src={logoImage} alt="GO" className="w-full h-full object-contain opacity-90" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Caption */}
                    <h3 className="text-sm uppercase tracking-[0.3em] text-white/60 font-light">GO LINE™</h3>
                    <h3 className="text-white font-light text-lg mb-2">Scan to view strain math</h3>
                    <p className="text-white/40 text-xs uppercase tracking-widest font-medium">Verified Blend</p>

                    {/* Optional URL readout for verify */}
                    {/* <div className="mt-4 p-2 bg-black/50 rounded text-[10px] text-white/20 break-all w-full font-mono">{shareUrl}</div> */}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
