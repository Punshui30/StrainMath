import logoImage from '../assets/logo.png';

interface BusinessOverviewProps {
  onClose: () => void;
}

export function BusinessOverview({ onClose }: BusinessOverviewProps) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] overflow-y-auto">
      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-16 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <img
              src={logoImage}
              alt="GO LINE"
              className="w-12 h-auto mt-1"
              style={{
                filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.4))'
              }}
            />
            <div>
              <h1 className="text-4xl font-light text-white/95 mb-4 tracking-tight">
                GO LINE for Your Business
              </h1>
              <p className="text-lg text-white/50 font-light leading-relaxed max-w-2xl">
                Turn Customer Intent into Higher Throughput, Bigger Carts, and Smarter Inventory Utilization
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-sm text-white/60 hover:text-white transition-all"
          >
            Back to Console
          </button>
        </div>

        {/* Narrative Intro */}
        <section className="mb-16">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
            <p className="text-xl text-white/90 font-light leading-relaxed mb-8">
              GO LINE is an outcome-driven guidance system designed to solve the real problems dispensary operators face every day:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-8">
              {[
                "Customers take too long to decide",
                "Staff get stuck explaining strain differences",
                "Inventory turns unevenly",
                "Discounts and aging SKUs sit unsold",
                "Experiences vary by budtender, not by brand"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/50 text-sm font-light">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400/40" />
                  {item}
                </div>
              ))}
            </div>
            <p className="text-lg text-white/80 font-light leading-relaxed border-t border-white/5 pt-8">
              GO LINE fixes this by shifting the conversation from <span className="text-white">“what strain do you want?”</span> to <span className="text-white">“what outcome are you trying to achieve?”</span> — and then translating that intent into terpene-driven recommendations using your actual COA data.
            </p>
            <p className="text-base text-[#D4AF37]/80 font-medium mt-4">
              The result: faster decisions, higher basket sizes, and consistent guidance at scale.
            </p>
          </div>
        </section>

        {/* Why This Matters to Operators */}
        <section className="mb-16">
          <h2 className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/70 mb-8 font-medium">
            Why This Matters to Operators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div>
                <h3 className="text-white/95 text-lg font-medium mb-2">Faster Decisions = Higher Throughput</h3>
                <p className="text-white/50 text-sm font-light leading-relaxed">
                  Customers who know what they’re looking for move faster. GO LINE reduces decision paralysis by guiding customers toward outcomes instead of overwhelming menus — keeping lines moving and floors flowing.
                </p>
              </div>
              <div>
                <h3 className="text-white/95 text-lg font-medium mb-2">Bigger Carts, Naturally</h3>
                <p className="text-white/50 text-sm font-light leading-relaxed">
                  Outcome-based guidance leads to multi-product blends instead of single-item purchases. Customers don’t feel upsold — they feel helped.
                </p>
              </div>
              <div>
                <h3 className="text-white/95 text-lg font-medium mb-2">Always Have Something to Sell</h3>
                <p className="text-white/50 text-sm font-light leading-relaxed">
                  Because GO LINE works from terpene profiles, not strain names, it can assemble recommendations even when a specific cultivar is out of stock.
                </p>
                <div className="mt-3 space-y-1">
                  <p className="text-white/30 text-xs flex gap-2"><span>•</span> Fewer dead ends</p>
                  <p className="text-white/30 text-xs flex gap-2"><span>•</span> Better use of substitute inventory</p>
                  <p className="text-white/30 text-xs flex gap-2"><span>•</span> More flexibility during shortages</p>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="text-white/95 text-lg font-medium mb-2">Move Aging and Markdown Inventory Intelligently</h3>
                <p className="text-white/50 text-sm font-light leading-relaxed">
                  Low-velocity SKUs don’t have to be discounted blindly. GO LINE can incorporate them into blends where their terpene profile still adds value — turning problem inventory into sellable outcomes.
                </p>
              </div>
              <div>
                <h3 className="text-white/95 text-lg font-medium mb-2">Consistent Guidance, Regardless of Staff Experience</h3>
                <p className="text-white/50 text-sm font-light leading-relaxed">
                  Recommendations are grounded in chemistry, not personal opinion. New hires perform like seasoned staff. Your brand experience stays consistent across shifts and locations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works (Operational) */}
        <section className="mb-16">
          <h2 className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/70 mb-8 font-medium">
            How GO LINE Works (Operational View)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              "Customers speak or type what they want to feel",
              "GO LINE interprets intent and maps to terpene targets",
              "The system evaluates current inventory COAs in real time",
              "One or more valid blend options are generated",
              "Staff or customers select and proceed"
            ].map((step, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col gap-3">
                <div className="text-[10px] text-[#D4AF37]/50 font-bold">0{i + 1}</div>
                <p className="text-xs text-white/60 font-medium leading-normal">{step}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center gap-12 text-[10px] uppercase tracking-widest text-white/20 font-medium">
            <span>No medical claims</span>
            <span>No strain mythology</span>
            <span>Data-based guidance</span>
          </div>
        </section>

        {/* What This Unlocks */}
        <section className="mb-16">
          <h2 className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/70 mb-8 font-medium">
            What This Unlocks
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Higher average basket size",
              "Faster customer flow",
              "Better inventory turns",
              "More predictable outcomes"
            ].map((benefit, i) => (
              <div key={i} className="px-6 py-4 bg-white/[0.04] border border-[#D4AF37]/10 rounded-xl text-center">
                <p className="text-sm text-white/80 font-light">{benefit}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-white/40 text-sm font-light mt-8">
            Stronger customer trust and repeat visits
          </p>
        </section>

        {/* Business Impact */}
        <section className="mb-16">
          <h2 className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/70 mb-6 font-medium">
            Impact on Your Business
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <div className="text-3xl font-light text-[#D4AF37]/90 mb-2">+40%</div>
              <div className="text-xs uppercase tracking-wider text-white/40 mb-3">Avg Basket Size</div>
              <p className="text-sm text-white/50 font-light leading-relaxed">
                Customers purchase multi-strain blends instead of single products
              </p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <div className="text-3xl font-light text-[#D4AF37]/90 mb-2">68%</div>
              <div className="text-xs uppercase tracking-wider text-white/40 mb-3">Staff Confidence</div>
              <p className="text-sm text-white/50 font-light leading-relaxed">
                Budtenders report increased confidence in recommendations
              </p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <div className="text-3xl font-light text-[#D4AF37]/90 mb-2">3.2x</div>
              <div className="text-xs uppercase tracking-wider text-white/40 mb-3">Repeat Visits</div>
              <p className="text-sm text-white/50 font-light leading-relaxed">
                Customers return when outcomes consistently match expectations
              </p>
            </div>
          </div>
        </section>

        {/* Live Demo Transition Section */}
        <section className="mt-24 pb-24 border-t border-white/5 pt-16">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[10px] text-[#D4AF37] font-bold uppercase tracking-[0.2em] mb-6">
              Live Demonstration
            </div>
            <h2 className="text-3xl font-light text-white mb-4">See GO LINE in Action</h2>
            <p className="text-white/40 text-base font-light max-w-2xl mx-auto">
              This walkthrough shows how real customer inputs translate into real inventory-based recommendations on the floor.
            </p>
          </div>

          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-white/[0.02] border border-white/10 flex items-center justify-center group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />

            {/* Play Indicator / Automated Demo Placeholder */}
            <div className="relative z-20 flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center backdrop-blur-xl group-hover:scale-110 transition-transform duration-500">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-[#D4AF37] border-b-[10px] border-b-transparent ml-1" />
              </div>
              <p className="text-sm font-medium text-[#D4AF37]/80 tracking-widest uppercase">Start Workflow Simulation</p>
            </div>

            {/* Simulated UI Backdrop */}
            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700 blur-[2px]">
              {/* Visual hint of the interface */}
              <div className="w-full h-full flex flex-col p-12">
                <div className="w-32 h-4 bg-white/20 rounded-full mb-8" />
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full border-4 border-white/10 border-t-[#D4AF37]/40" />
                </div>
                <div className="flex gap-4 mt-auto">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex-1 h-20 bg-white/10 rounded-xl" />
                  ))}
                </div>
              </div>
            </div>

            {/* Overlay hint */}
            <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37]">Voice Synthesis</span>
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37]">Real-time Matching</span>
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37]">Inventory Sync</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
