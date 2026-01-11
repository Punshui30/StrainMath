import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CameraScanner } from './CameraScanner';
import logoImage from '../assets/logo.png';
import type { IntentVectors } from '../engine/scoring'; // Import type if needed

interface AdminOverlayProps {
  mode?: string; // Added to match usage in AppShell
  onClose?: () => void;
  onShowBusinessOverview?: () => void;
  onPresetSelect?: (intent: any) => void; // Loose type for now to avoid import hell if type not exported
}

interface InventoryItem {
  strain: string;
  qty: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const DEMO_STEPS = [
  { target: 'header', text: 'Welcome to the GO Operator Console.\nCommand center for manufacturing logic.' },
  { target: 'modes', text: 'System Modes\nSwitch between Standard, Precision, and Experimental inference models.' },
  { target: 'stats', text: 'Live Telemetry\nReal-time tracking of session efficacy and throughput.' },
  { target: 'inventory', text: 'Inventory Awareness\nLive stock tracking with automatic status updates.' },
  { target: 'ingest', text: 'Dual Ingestion\nScan physical COAs or upload digital certificates instantly.' },
  { target: 'presets', text: 'Production Presets\nOne-click targeting for popular effect profiles.' },
];

export function AdminOverlay({ mode, onShowBusinessOverview, onPresetSelect }: AdminOverlayProps) {
  const [isScanning, setIsScanning] = useState(false);

  // Interactive Inventory State
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { strain: 'Green Crack', qty: 245, status: 'In Stock' },
    { strain: 'Durban Poison', qty: 180, status: 'In Stock' },
    { strain: 'Jack Herer', qty: 95, status: 'Low Stock' },
    { strain: 'OG Kush', qty: 310, status: 'In Stock' },
    { strain: 'Blue Dream', qty: 0, status: 'Out of Stock' },
  ]);

  // Demo State
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Demo Auto-Advance
  useEffect(() => {
    if (!isDemoRunning) return;

    const timer = setTimeout(() => {
      if (demoStep < DEMO_STEPS.length - 1) {
        setDemoStep(prev => prev + 1);
      } else {
        setIsDemoRunning(false); // End demo
      }
    }, 3000); // 3 seconds per step

    return () => clearTimeout(timer);
  }, [isDemoRunning, demoStep]);

  const startDemo = () => {
    setDemoStep(0);
    setIsDemoRunning(true);
  };

  const skipDemo = () => {
    setIsDemoRunning(false);
  };

  // Inventory Logic
  const updateStatus = (qty: number) => {
    if (qty === 0) return 'Out of Stock';
    if (qty < 100) return 'Low Stock';
    return 'In Stock';
  };

  const handleManualEntry = () => {
    const strain = prompt("Enter Strain Name:");
    if (!strain) return;
    const qtyStr = prompt("Enter Quantity (g):");
    const qty = parseInt(qtyStr || '0');
    setInventory(prev => [{ strain, qty, status: updateStatus(qty) }, ...prev]);
  };

  const handleEditQty = (index: number) => {
    const item = inventory[index];
    const newQtyStr = prompt(`Update quantity for ${item.strain}:`, item.qty.toString());
    if (newQtyStr === null) return;
    const newQty = parseInt(newQtyStr);
    if (isNaN(newQty)) return;

    const newInv = [...inventory];
    newInv[index] = { ...item, qty: newQty, status: updateStatus(newQty) };
    setInventory(newInv);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock Parse
      const strainName = file.name.split('.')[0] || "Unknown Import";
      setInventory(prev => [{ strain: strainName, qty: 500, status: 'In Stock' }, ...prev]);
    }
  };

  // Presets Logic
  const handlePreset = (preset: string) => {
    if (!onPresetSelect) return;

    // Mock mapping
    const intents: Record<string, any> = {
      'Morning Energy': { energy: 0.9, focus: 0.7, creativity: 0.5, relaxation: 0.1 },
      'Evening Calm': { relaxation: 0.9, pain_relief: 0.7, anti_anxiety: 0.8, energy: 0.1 },
      'Focus Session': { focus: 0.9, creativity: 0.6, energy: 0.4, relaxation: 0.2 },
      'Social Mode': { creativity: 0.8, energy: 0.6, anti_anxiety: 0.6, relaxation: 0.3 },
    };

    onPresetSelect(intents[preset] || {});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full h-full bg-[#0A0A0B] overflow-y-auto relative"
    >
      {/* Demo Overlay */}
      <AnimatePresence>
        {isDemoRunning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[999] bg-black/60 backdrop-blur-sm pointer-events-auto flex flex-col items-center justify-center text-center p-8"
            onClick={skipDemo} // Click anywhere to skip
          >
            <motion.div
              key={demoStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-xl"
            >
              <div className="text-[#D4AF37] text-xs uppercase tracking-[0.2em] mb-4">
                Step {demoStep + 1} / {DEMO_STEPS.length}
              </div>
              <h2 className="text-3xl font-light text-white mb-4 whitespace-pre-line">
                {DEMO_STEPS[demoStep].text.split('\n')[0]}
              </h2>
              <p className="text-white/60 text-lg font-light leading-relaxed">
                {DEMO_STEPS[demoStep].text.split('\n')[1]}
              </p>
            </motion.div>

            <button onClick={skipDemo} className="absolute bottom-12 text-white/30 hover:text-white transition-colors text-xs uppercase tracking-widest border border-white/10 px-4 py-2 rounded-full">
              Skip Demo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto p-8">
        {/* Header with Business Overview link */}
        <div className="mb-6 pb-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={logoImage}
              alt="GO LINE"
              className="w-10 h-auto"
              style={{
                filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.4))'
              }}
            />
            <div>
              <h1 className="text-xl font-light text-white/90 mb-1">Operator Console</h1>
              <p className="text-sm text-white/40">Inventory, system modes, and operations</p>
            </div>
          </div>
          <button
            onClick={startDemo}
            disabled={isDemoRunning}
            className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-sm text-white/80 hover:text-white transition-all disabled:opacity-50"
          >
            {isDemoRunning ? 'Demo Running...' : 'Business Overview'}
          </button>
        </div>

        <div className={`grid grid-cols-2 gap-6 transition-opacity duration-300 ${isDemoRunning ? 'opacity-20' : 'opacity-100'}`}>
          {/* System Mode */}
          <div className={`border border-white/20 bg-black/40 p-6 ${isDemoRunning && demoStep === 1 ? 'ring-2 ring-[#D4AF37] opacity-100 !bg-white/5' : ''}`}>
            <div className="text-xs uppercase tracking-widest text-white/40 mb-4">System Mode</div>
            <div className="grid grid-cols-3 gap-2">
              <button className="py-2 px-3 bg-white/10 border border-white/20 text-sm hover:bg-white/15 transition-colors text-white">
                Standard
              </button>
              <button className="py-2 px-3 border border-white/20 text-sm hover:bg-white/5 transition-colors text-white/60">
                Precision
              </button>
              <button className="py-2 px-3 border border-white/20 text-sm hover:bg-white/5 transition-colors text-white/60">
                Experimental
              </button>
            </div>
          </div>

          {/* System Stats */}
          <div className={`border border-white/20 bg-black/40 p-6 ${isDemoRunning && demoStep === 2 ? 'ring-2 ring-[#D4AF37] opacity-100 !bg-white/5' : ''}`}>
            <div className="text-xs uppercase tracking-widest text-white/40 mb-4">Statistics</div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/40">Sessions Today</span>
                <span className="text-white/90">47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Avg Confidence</span>
                <span className="text-white/90">92.3%</span>
              </div>
            </div>
          </div>

          {/* Inventory - Full Width */}
          <div className={`col-span-2 border border-white/20 bg-black/40 p-6 ${isDemoRunning && (demoStep === 3 || demoStep === 4) ? 'ring-2 ring-[#D4AF37] opacity-100 !bg-white/5' : ''}`}>
            {/* Header with COA Ingestion Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-xs uppercase tracking-widest text-white/40">Inventory</div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsScanning(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-sm text-white/80 hover:text-white transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white/60">
                    <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  Scan COA
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.png"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-sm text-white/80 hover:text-white transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white/60">
                    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Upload COA
                </button>
                <button
                  onClick={handleManualEntry}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-sm text-white/80 hover:text-white transition-all"
                >
                  Manual Entry
                </button>
              </div>
            </div>

            <div className="space-y-1">
              {/* Header */}
              <div className="grid grid-cols-4 gap-4 pb-2 border-b border-white/10 text-xs text-white/40">
                <div>Strain</div>
                <div>Quantity</div>
                <div>Status</div>
                <div></div>
              </div>
              {/* Rows */}
              <div className="max-h-64 overflow-y-auto pr-2">
                {inventory.map((item, idx) => (
                  <div
                    key={`${item.strain}-${idx}`}
                    className="grid grid-cols-4 gap-4 py-2 border-b border-white/5 hover:bg-white/5 transition-colors text-sm items-center"
                  >
                    <div className="text-white/90">{item.strain}</div>
                    <div className="text-white/60">{item.qty}g</div>
                    <div>
                      <span
                        className={
                          item.status === 'In Stock'
                            ? 'text-[#4ADE80]/80'
                            : item.status === 'Low Stock'
                              ? 'text-[#D4A574]'
                              : 'text-red-400/80'
                        }
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleEditQty(idx)}
                        className="text-white/40 hover:text-white transition-colors text-xs border border-white/10 px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Presets */}
          <div className={`col-span-2 border border-white/20 bg-black/40 p-6 ${isDemoRunning && demoStep === 5 ? 'ring-2 ring-[#D4AF37] opacity-100 !bg-white/5' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs uppercase tracking-widest text-white/40">Presets</div>
              <button className="text-xs text-white/40 hover:text-white transition-colors">+ New</button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {['Morning Energy', 'Evening Calm', 'Focus Session', 'Social Mode'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePreset(preset)}
                  className="border border-white/20 p-4 hover:bg-white/5 transition-colors text-left group"
                >
                  <div className="text-sm text-white/80 group-hover:text-white mb-1">{preset}</div>
                  <div className="text-[10px] text-white/40 group-hover:text-[#D4AF37]">Active profile</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isScanning && (
          <CameraScanner
            onClose={() => setIsScanning(false)}
            onCapture={(data) => {
              console.log("Captured COA Image data length:", data.length);
              // Mock scan result
              setInventory(prev => [{ strain: "Scanned Sample #092", qty: 250, status: 'In Stock' }, ...prev]);
              setIsScanning(false);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}