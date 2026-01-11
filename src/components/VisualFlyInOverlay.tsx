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
        // OPTION B: Passive DOM Observation (Strict V2)
        // Watch for "Make This Blend" button or Result Card container
        let hasFired = false;

        const observer = new MutationObserver((mutations) => {
            if (hasFired) return;

            // Robust check for Result State
            // 1. Check for "Make This Blend" text
            const makeBlendBtn = document.evaluate(
                "//span[contains(text(), 'Make This Blend')]",
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            // 2. Check for "Make This Blend" button class if text fails (fallback)
            const makeBlendBtnClass = document.querySelector('button[class*="Make This Blend"]');

            if (makeBlendBtn || makeBlendBtnClass) {
                // Double check we haven't already fired effectively
                hasFired = true;
                handleTrigger();
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
                // Strict Visibility check: Must be in viewport and visible
                if (rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0) {
                    uniqueCards.set(card.getAttribute('data-strain-id') || '', card);
                }
            });

            if (uniqueCards.size === 0) return;

            // 2. Find Target Element (GO Logo)
            // Robust Selector: ID or Alt Text
            const logo = document.getElementById('go-logo') || document.querySelector('img[alt="GO LINE"]');
            if (!logo) return;

            const logoBounds = logo.getBoundingClientRect();
            setTargetRect(logoBounds);

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

        // Also support manual event trigger if needed later
        window.addEventListener('strain-math:trigger-fly-in', handleTrigger);

        return () => {
            observer.disconnect();
            window.removeEventListener('strain-math:trigger-fly-in', handleTrigger);
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
