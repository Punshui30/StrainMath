import { useState } from 'react';
import { Mic, Sparkles, Fingerprint } from 'lucide-react';

interface PromptsSidebarProps {
  onPromptSelect: (text: string) => void;
  onTextSubmit?: (text: string) => void;
  onVoiceActivate?: () => void;
  onStrainChase?: (strainName: string, lovedEffects: string) => void;
}

export function PromptsSidebar({
  onPromptSelect,
  onTextSubmit,
  onVoiceActivate,
  onStrainChase
}: PromptsSidebarProps) {
  const [strainName, setStrainName] = useState('');
  const [lovedEffects, setLovedEffects] = useState('');
  const [mode, setMode] = useState<'outcome' | 'strain-chase'>('outcome');

  const prompts = [
    'Relaxed but alert',
    'Pain relief & calm',
    'Focused & Creative',
    'Sleep aid support',
  ];

  return (
    <div className="w-full h-full px-12 py-20 flex flex-col bg-[#0A0A0B]">
      {/* Mode Selector - Subtle */}
      <div className="flex gap-8 mb-16 px-1">
        <button
          onClick={() => setMode('outcome')}
          className={`text-[10px] uppercase tracking-[0.3em] font-medium transition-all ${mode === 'outcome' ? 'text-[#D4AF37]' : 'text-white/20 hover:text-white/40'
            }`}
        >
          Outcome Search
        </button>
        <button
          onClick={() => setMode('strain-chase')}
          className={`text-[10px] uppercase tracking-[0.3em] font-medium transition-all ${mode === 'strain-chase' ? 'text-[#D4AF37]' : 'text-white/20 hover:text-white/40'
            }`}
        >
          Strain Chaser
        </button>
      </div>

      {mode === 'outcome' ? (
        <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
          {/* Large Typography Input */}
          <div className="relative mb-20">
            <input
              type="text"
              placeholder="What are you looking to feel?"
              className="w-full bg-transparent border-b border-white/10 py-4 text-3xl font-light text-white 
                         placeholder:text-white/10 focus:outline-none focus:border-[#D4AF37]/40 transition-all
                         selection:bg-[#D4AF37]/30"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && onTextSubmit) {
                  onTextSubmit((e.target as HTMLInputElement).value);
                }
              }}
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-4">
              <button
                onClick={onVoiceActivate}
                className="p-3 rounded-full hover:bg-white/5 text-white/20 hover:text-[#D4AF37] transition-all group"
              >
                <Mic className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Presets - Premium Layout */}
          <div className="space-y-8">
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-medium mb-6">Popular Outcomes</h3>
            <div className="grid grid-cols-1 gap-4">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => onPromptSelect(prompt)}
                  className="group flex items-center justify-between py-4 text-lg font-medium text-white/40 hover:text-white transition-all border-b border-transparent hover:border-white/5"
                >
                  <span>{prompt}</span>
                  <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 text-[#D4AF37]/40 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="mb-12">
            <h1 className="text-4xl font-light text-white mb-4">Recreate a memory.</h1>
            <p className="text-white/40 font-medium text-lg">Enter the strain you loved and any specific effects you want to favor.</p>
          </div>

          <div className="space-y-12">
            <div className="space-y-2 border-b border-white/10 focus-within:border-[#D4AF37]/40 transition-all pb-2">
              <label className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-medium">The Reference Strain</label>
              <div className="relative">
                <input
                  type="text"
                  value={strainName}
                  onChange={(e) => setStrainName(e.target.value)}
                  placeholder='Name and Brand (if known)'
                  className="w-full bg-transparent py-4 text-2xl font-light text-white placeholder:text-white/10 focus:outline-none"
                />
                <button
                  onClick={() => {
                    const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                    if (!Recognition) return;
                    const recognition = new Recognition();
                    recognition.lang = 'en-US';
                    recognition.onresult = (event: any) => {
                      const transcript = event.results[0][0].transcript;
                      setStrainName(transcript);
                    };
                    recognition.start();
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-[#D4AF37] transition-all"
                >
                  <Mic className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2 border-b border-white/10 focus-within:border-[#D4AF37]/40 transition-all pb-2">
              <label className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-medium">Favor Specific Effects (Optional)</label>
              <input
                type="text"
                value={lovedEffects}
                onChange={(e) => setLovedEffects(e.target.value)}
                placeholder='e.g. Euphoric, Calm'
                className="w-full bg-transparent py-4 text-2xl font-light text-white placeholder:text-white/10 focus:outline-none"
              />
            </div>

            <button
              onClick={() => onStrainChase && onStrainChase(strainName, lovedEffects)}
              disabled={!strainName.trim()}
              className="group flex items-center justify-between w-full py-6 mt-8 text-black bg-[#D4AF37] px-8 rounded-2xl font-bold uppercase tracking-[0.2em] text-sm hover:bg-[#E5C05B] transition-all active:scale-95 disabled:opacity-20 translate-y-0 hover:-translate-y-1"
            >
              <span>Match Profile</span>
              <Fingerprint className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Footer / Branding */}
      <div className="mt-auto pt-12 border-t border-white/5 opacity-20 hover:opacity-40 transition-opacity">
        <p className="text-[9px] uppercase tracking-[0.5em] text-white font-medium">Advanced Outcome Guidance System</p>
      </div>
    </div>
  );
}
