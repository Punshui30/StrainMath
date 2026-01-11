import logoImage from 'figma:asset/f7eabe4467f2f507507acb041076599c4b9fae68.png';

interface AdminOverlayProps {
  onClose?: () => void;
  onShowBusinessOverview?: () => void;
}

export function AdminOverlay({ onClose, onShowBusinessOverview }: AdminOverlayProps) {
  const inventory = [
    { strain: 'Green Crack', qty: 245, status: 'In Stock' },
    { strain: 'Durban Poison', qty: 180, status: 'In Stock' },
    { strain: 'Jack Herer', qty: 95, status: 'Low Stock' },
    { strain: 'OG Kush', qty: 310, status: 'In Stock' },
    { strain: 'Blue Dream', qty: 0, status: 'Out of Stock' },
  ];

  return (
    <div className="w-full h-full bg-[#0A0A0B] overflow-y-auto">
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
            onClick={onShowBusinessOverview}
            className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-sm text-white/80 hover:text-white transition-all"
          >
            Business Overview
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* System Mode */}
          <div className="border border-white/20 bg-black/40 p-6">
            <div className="text-xs uppercase tracking-widest text-white/40 mb-4">System Mode</div>
            <div className="grid grid-cols-3 gap-2">
              <button className="py-2 px-3 bg-white/10 border border-white/20 text-sm hover:bg-white/15 transition-colors">
                Standard
              </button>
              <button className="py-2 px-3 border border-white/20 text-sm hover:bg-white/5 transition-colors">
                Precision
              </button>
              <button className="py-2 px-3 border border-white/20 text-sm hover:bg-white/5 transition-colors">
                Experimental
              </button>
            </div>
          </div>

          {/* System Stats */}
          <div className="border border-white/20 bg-black/40 p-6">
            <div className="text-xs uppercase tracking-widest text-white/40 mb-4">Statistics</div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/40">Sessions Today</span>
                <span>47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Avg Confidence</span>
                <span>92.3%</span>
              </div>
            </div>
          </div>

          {/* Inventory - Full Width */}
          <div className="col-span-2 border border-white/20 bg-black/40 p-6">
            {/* Header with COA Ingestion Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-xs uppercase tracking-widest text-white/40">Inventory</div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-sm text-white/80 hover:text-white transition-all">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white/60">
                    <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Scan COA
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-sm text-white/80 hover:text-white transition-all">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white/60">
                    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Upload COA
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-sm text-white/80 hover:text-white transition-all">
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
              {inventory.map((item) => (
                <div
                  key={item.strain}
                  className="grid grid-cols-4 gap-4 py-2 border-b border-white/5 hover:bg-white/5 transition-colors text-sm"
                >
                  <div>{item.strain}</div>
                  <div className="text-white/60">{item.qty}g</div>
                  <div>
                    <span
                      className={
                        item.status === 'In Stock'
                          ? 'text-white/60'
                          : item.status === 'Low Stock'
                          ? 'text-[#D4A574]'
                          : 'text-white/30'
                      }
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <button className="text-white/40 hover:text-white transition-colors">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Presets */}
          <div className="col-span-2 border border-white/20 bg-black/40 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs uppercase tracking-widest text-white/40">Presets</div>
              <button className="text-xs text-white/40 hover:text-white transition-colors">+ New</button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {['Morning Energy', 'Evening Calm', 'Focus Session', 'Social Mode'].map((preset) => (
                <div
                  key={preset}
                  className="border border-white/20 p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="text-sm">{preset}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}