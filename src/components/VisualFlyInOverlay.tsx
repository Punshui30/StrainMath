import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Isolated Visual Animation Layer (V2)
// Listens for 'strain-math:trigger-fly-in' event OR observes result state
// Clones tray cards and flies them to the GO logo
// Fails silently if elements are missing

interface Flyer {
    id: string;
    rect: DOMRect;
    element: HTMLElement; // Clone of the element content
}

export const VisualFlyInOverlay = () => {
    const [flyers, setFlyers] = useState<Flyer[]>([]);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        // OPTION B: Passive DOM Observation - Watch for blend cards appearing
        let hasFired = false;

        const observer = new MutationObserver(() => {
            if (hasFired) return;

            // Check for BlendResultCard containers (they have specific classes)
            // Look for the "flex gap-6 justify-center" container that holds result cards
            const resultCards = document.querySelectorAll('[class*="BlendResultCard"], .blend-result-card, button[class*="max-w-\\[320px\\]"]');

            // More robust: look for the specific "Make This Blend" button which signals results are rendered
            const makeBlendBtn = Array.from(document.querySelectorAll('button')).find(btn =>
                btn.textContent?.includes('Make This Blend')
            );

            if (makeBlendBtn || resultCards.length >= 3) {
                hasFired = true;
                // Small delay to ensure cards are fully rendered  
                setTimeout(handleTrigger, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        const handleTrigger = () => {
            // 1. Find Source Elements (Strain Cards in Tray)
            const trayCards = document.querySelectorAll<HTMLElement>('[data-strain-id]');
            const uniqueCards = new Map<string, HTMLElement>();

            trayCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                // Strict Visibility check
                if (rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0) {
                    uniqueCards.set(card.getAttribute('data-strain-id') || '', card);
                }
            });

            if (uniqueCards.size === 0) return;

            // 2. Find Target Element (Center of screen where logo would be)
            // Since logo is now hidden in STATE_3, we'll animate to screen center
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            // Create a virtual target rect at screen center
            const targetRect = new DOMRect(centerX - 100, centerY - 100, 200, 200);
            setTargetRect(targetRect);

            // 3. Create Flyer Objects
            const newFlyers: Flyer[] = [];
            uniqueCards.forEach((card, id) => {
                newFlyers.push({
                    id,
                    rect: card.getBoundingClientRect(),
                    element: card.cloneNode(true) as HTMLElement
                });
            });

            // Limit to max 5
            setFlyers(newFlyers.slice(0, 5));

            // 4. Cleanup after animation
            setTimeout(() => {
                setFlyers([]);
            }, 2000);
        };

        // Also support manual event trigger
        window.addEventListener('strain-math:trigger-fly-in', handleTrigger);
        window.addEventListener('strain-math:blends-ready', handleTrigger);

        return () => {
            observer.disconnect();
            window.removeEventListener('strain-math:trigger-fly-in', handleTrigger);
            window.removeEventListener('strain-math:blends-ready', handleTrigger);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            <AnimatePresence>
                {targetRect && flyers.map((flyer, index) => (
                    <motion.div
                        key={flyer.id + index}
                        initial={{
                            position: 'absolute',
                            top: flyer.rect.top,
                            left: flyer.rect.left,
                            width: flyer.rect.width,
                            height: flyer.rect.height,
                            opacity: 1,
                            scale: 1,
                        }}
                        animate={{
                            top: targetRect.top + targetRect.height / 2 - flyer.rect.height / 2,
                            left: targetRect.left + targetRect.width / 2 - flyer.rect.width / 2,
                            scale: 0.2, // Shrink into logo
                            opacity: 0,
                        }}
                        transition={{
                            duration: 0.8,
                            ease: [0.22, 1, 0.36, 1],
                            delay: index * 0.08, // Tight stagger
                        }}
                        dangerouslySetInnerHTML={{ __html: flyer.element.innerHTML }}
                        // Styles to match the card look but be "ghostly"
                        className="strain-card-clone origin-center"
                        style={{
                            // Ensure clones don't capture pointer events
                            pointerEvents: 'none',
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};
