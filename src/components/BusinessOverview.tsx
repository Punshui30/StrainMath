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
                Transform how your customers discover cannabis products through terpene-driven outcome guidance
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

        {/* What GO LINE Does */}
        <section className="mb-16">
          <h2 className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/70 mb-6 font-medium">
            What It Does
          </h2>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
            <p className="text-lg text-white/80 font-light leading-relaxed mb-6">
              GO LINE is a voice-driven guidance system that translates customer intent into terpene-based product recommendations.
            </p>
            <p className="text-base text-white/60 font-light leading-relaxed">
              Instead of asking customers "what strain do you want?", GO LINE asks "what outcome are you looking for?"
              — then uses your inventory's actual COA data to build precision blends that match their needs.
            </p>
          </div>
        </section>

        {/* Why Terpene-Driven Outcomes Beat Strain Menus */}
        <section className="mb-16">
          <h2 className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/70 mb-6 font-medium">
            Why Terpene-Driven Outcomes
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-base text-white/90 font-light mb-3">Traditional Strain Menus</h3>
              <ul className="space-y-2 text-sm text-white/50 font-light">
                <li className="flex gap-2">
                  <span className="text-white/30">—</span>
                  <span>Customers overwhelmed by choice</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-white/30">—</span>
                  <span>Staff struggle to guide meaningfully</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-white/30">—</span>
                  <span>Low basket size, high decision fatigue</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-white/30">—</span>
                  <span>Inconsistent experiences reduce trust</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/[0.05] border border-[#D4AF37]/20 rounded-2xl p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(212,175,55,0.1)]">
              <h3 className="text-base text-white/90 font-light mb-3">GO LINE Approach</h3>
              <ul className="space-y-2 text-sm text-white/60 font-light">
                <li className="flex gap-2">
                  <span className="text-[#D4AF37]/70">+</span>
                  <span>Voice-first removes decision paralysis</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#D4AF37]/70">+</span>
                  <span>Staff become trusted outcome advisors</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#D4AF37]/70">+</span>
                  <span>Multi-product blends increase basket size</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#D4AF37]/70">+</span>
                  <span>COA-grounded precision builds loyalty</span>
                </li>
              </ul>
            </div>
          </div>
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

        {/* Hardware + Workflow Compatibility */}
        <section className="mb-16">
          <h2 className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/70 mb-6 font-medium">
            Integration & Workflow
          </h2>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-base text-white/80 font-light mb-4">Compatible Hardware</h3>
                <ul className="space-y-2 text-sm text-white/50 font-light">
                  <li>• Any iPad or tablet (voice + touch)</li>
                  <li>• Desktop POS integration ready</li>
                  <li>• Mobile device support for field use</li>
                  <li>• No specialized equipment required</li>
                </ul>
              </div>
              <div>
                <h3 className="text-base text-white/80 font-light mb-4">Workflow Integration</h3>
                <ul className="space-y-2 text-sm text-white/50 font-light">
                  <li>• Scan COA → Auto-populate inventory</li>
                  <li>• Real-time stock updates</li>
                  <li>• Export blend ratios to fulfillment</li>
                  <li>• Staff presets for common outcomes</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance + COA Grounding */}
        <section className="mb-16">
          <h2 className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/70 mb-6 font-medium">
            Compliance & Data Grounding
          </h2>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
            <p className="text-base text-white/60 font-light leading-relaxed mb-6">
              Every recommendation is grounded in your actual Certificate of Analysis (COA) data, ensuring:
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-white/80 font-light mb-2">• Regulatory compliance</div>
                <div className="text-sm text-white/80 font-light mb-2">• Terpene accuracy to lab-tested levels</div>
                <div className="text-sm text-white/80 font-light">• No medical claims, only guidance</div>
              </div>
              <div>
                <div className="text-sm text-white/80 font-light mb-2">• Batch-specific precision</div>
                <div className="text-sm text-white/80 font-light mb-2">• Auto-flagging low stock</div>
                <div className="text-sm text-white/80 font-light">• Audit trail for every blend</div>
              </div>
            </div>
          </div>
        </section>

        {/* Differentiation */}
        <section className="mb-16">
          <h2 className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/70 mb-6 font-medium">
            What Makes GO LINE Different
          </h2>
          <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
            <div className="space-y-4 text-base text-white/70 font-light leading-relaxed">
              <p>
                <strong className="text-white/90 font-normal">Not a chatbot.</strong> GO LINE doesn't simulate conversation —
                it translates natural language into precision chemistry using your real inventory.
              </p>
              <p>
                <strong className="text-white/90 font-normal">Not a strain database.</strong> It doesn't rely on generic strain profiles.
                Every recommendation uses your exact COA data, making it batch-specific and trustworthy.
              </p>
              <p>
                <strong className="text-white/90 font-normal">Not dispensary software.</strong> GO LINE is a customer-facing guidance layer
                that sits alongside your existing POS, not a replacement.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}