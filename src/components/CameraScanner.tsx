import { useEffect, useRef, useState } from 'react';
import { X, Camera, ScanLine } from 'lucide-react';

interface CameraScannerProps {
    onClose: () => void;
    onCapture: (imageData: string) => void;
}

export function CameraScanner({ onClose, onCapture }: CameraScannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string>('');
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        let mounted = true;

        async function startCamera() {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });

                if (mounted) {
                    setStream(mediaStream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = mediaStream;
                    }
                }
            } catch (err) {
                if (mounted) {
                    console.error("Camera Access Error:", err);
                    setError('Unable to access camera. Please check permissions.');
                }
            }
        }

        startCamera();

        return () => {
            mounted = false;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Cleanup stream on unmount specifically if state wasn't captured in cleanup above
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        }
    }, [stream]);

    const handleCapture = () => {
        if (videoRef.current) {
            // Create canvas to capture image
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0);
                const imageData = canvas.toDataURL('image/jpeg');
                onCapture(imageData);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-50"
            >
                <X className="w-6 h-6 text-white" />
            </button>

            {error ? (
                <div className="text-center p-8">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Camera className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-white/80">{error}</p>
                </div>
            ) : (
                <div className="relative w-full max-w-lg aspect-[3/4] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    {/* Camera Feed */}
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />

                    {/* Overlay UI */}
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Scanning Frame */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[40%] border-2 border-[#D4AF37]/50 rounded-lg">
                            {/* Corners */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37] -mt-0.5 -ml-0.5" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37] -mt-0.5 -mr-0.5" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37] -mb-0.5 -ml-0.5" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37] -mb-0.5 -mr-0.5" />

                            {/* Scanning Animation */}
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="w-full h-0.5 bg-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,1)] animate-[scan_2s_ease-in-out_infinite]" />
                            </div>
                        </div>

                        <div className="absolute bottom-12 left-0 right-0 flex justify-center pointer-events-auto">
                            <button
                                onClick={handleCapture}
                                className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                            >
                                <div className="w-12 h-12 bg-white rounded-full" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <p className="mt-8 text-white/40 text-sm font-medium tracking-wider uppercase">
                Position QR Code or Label within frame
            </p>
        </div>
    );
}
