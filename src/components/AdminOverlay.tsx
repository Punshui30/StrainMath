import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CameraScanner } from './CameraScanner';
import logoImage from '../assets/logo.png';

interface AdminOverlayProps {
  mode?: string;
  onClose?: () => void;
  onShowBusinessOverview?: () => void;
  onPresetSelect?: (intent: any) => void;
  inventory: any[];
  onUpdateInventory: (inv: any[]) => void;
}

const DEMO_STEPS = [
  { target: 'header', text: 'Welcome to the GO Operator Console.\nCommand center for manufacturing logic.' },
  { target: 'modes', text: 'System Modes\nSwitch between Standard, Precision, and Experimental inference models.' },
  { target: 'stats', text: 'Live Telemetry\nReal-time tracking of session efficacy and throughput.' },
  { target: 'inventory', text: 'Inventory Awareness\nLive stock tracking with automatic status updates.' },
  { target: 'ingest', text: 'Dual Ingestion\nScan physical COAs or upload digital certificates instantly.' },
  { target: 'presets', text: 'Production Presets\nOne-click targeting for popular effect profiles.' },
];

export function AdminOverlay({ mode, onShowBusinessOverview, onPresetSelect, inventory, onUpdateInventory }: AdminOverlayProps) {
  const [isScanning, setIsScanning] = useState(false);

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
    }, 4000); // 4 seconds per step for better reading

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
    // We assume MOCK format or simple format.
    // If inventory items are full COAs, we might be pushin a partial object.
    // But since display is just Strain/Qty/Status, we can push a partial.
    // For scoring, "scoreStrain" needs "terpenes".
    // If we push a manual entry without terpenes, the engine might choke.
    // [SAFETY] For manual entry in this demo, let's clone an existing terpene profile randomly so it works in engine.
    const template = inventory[0] || {};

    onUpdateInventory([{
      ...template, // Clone mock data structure
      name: strain, // Override name
      strain: strain,
      qty: qty,
      status: updateStatus(qty)
    }, ...inventory]);
  };

  const handleEditQty = (index: number) => {
    const item = inventory[index];
    const newQtyStr = prompt(`Update quantity for ${item.strain || item.name}:`, item.qty.toString());
    if (newQtyStr === null) return;
    const newQty = parseInt(newQtyStr);
    if (isNaN(newQty)) return;

    const newInv = [...inventory];
    newInv[index] = { ...item, qty: newQty, status: updateStatus(newQty) };
    onUpdateInventory(newInv);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock Parse
      const strainName = file.name.split('.')[0] || "Unknown Import";
      // Clone template for engine safety
      const template = inventory[0] || {};
      onUpdateInventory([{ ...template, name: strainName, strain: strainName, qty: 500, status: 'In Stock' }, ...inventory]);
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
      {/* Visual-Only Demo Banner (Non-Blocking) */}
      <AnimatePresence>
        {isDemoRunning && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center"
          >
            <div className="bg-[#D4AF37] text-black px-6 py-3 rounded-full shadow-[0_0_40px_rgba(212,175,55,0.4)] flex items-center gap-4 border border-white/20">
              <span className="font-bold text-xs tracking-wider">DEMO {demoStep + 1}/{DEMO_STEPS.length}</span>
              <div className="w-px h-4 bg-black/10" />
              <span className="font-medium text-sm">{DEMO_STEPS[demoStep].text.split('\n')[0]}</span>
              <button
                onClick={skipDemo}
                className="ml-2 w-6 h-6 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <div className="mt-2 text-[10px] text-[#D4AF37]/80 uppercase tracking-widest font-medium bg-black/80 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
              Visual Walkthrough Active
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto p-8">
        {/* Header with Business Overview link */}
        <div className={`mb-6 pb-4 border-b border-white/10 flex items-center justify-between transition-all duration-300 ${isDemoRunning && demoStep === 0 ? 'scale-[1.02] origin-left bg-white/[0.03] p-4 rounded-xl ring-1 ring-[#D4AF37]/50' : ''}`}>
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

        <div className={`grid grid-cols-2 gap-6 transition-all duration-500 ${isDemoRunning ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'}`}>
          {/* System Mode */}
          <div className={`border border-white/20 bg-black/40 p-6 transition-all duration-300 ${isDemoRunning && demoStep === 1 ? '!opacity-100 !grayscale-0 ring-2 ring-[#D4AF37] scale-[1.02] bg-white/[0.08] relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]' : ''}`}>
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
          <div className={`border border-white/20 bg-black/40 p-6 transition-all duration-300 ${isDemoRunning && demoStep === 2 ? '!opacity-100 !grayscale-0 ring-2 ring-[#D4AF37] scale-[1.02] bg-white/[0.08] relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]' : ''}`}>
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
          <div className={`col-span-2 border border-white/20 bg-black/40 p-6 transition-all duration-300 ${isDemoRunning && (demoStep === 3 || demoStep === 4) ? '!opacity-100 !grayscale-0 ring-2 ring-[#D4AF37] scale-[1.01] bg-white/[0.08] relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]' : ''}`}>
            {/* Header with COA Ingestion Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-xs uppercase tracking-widest text-white/40">Inventory</div>
              <div className={`flex items-center gap-3 transition-opacity duration-300 ${isDemoRunning && demoStep === 4 ? 'animate-pulse' : ''}`}>
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
                    key={`${item.strain || item.name}-${idx}`}
                    className="grid grid-cols-4 gap-4 py-2 border-b border-white/5 hover:bg-white/5 transition-colors text-sm items-center"
                  >
                    <div className="text-white/90">{item.strain || item.name}</div>
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
          <div className={`col-span-2 border border-white/20 bg-black/40 p-6 transition-all duration-300 ${isDemoRunning && demoStep === 5 ? '!opacity-100 !grayscale-0 ring-2 ring-[#D4AF37] scale-[1.01] bg-white/[0.08] relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]' : ''}`}>
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
              // Clone template for safety
              const template = inventory[0] || {};
              onUpdateInventory([{ ...template, strain: "Scanned Sample #092", name: "Scanned Sample #092", qty: 250, status: 'In Stock' }, ...inventory]);
              setIsScanning(false);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}