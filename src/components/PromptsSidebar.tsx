import { Mic, Keyboard } from 'lucide-react';

interface PromptsSidebarProps {
  onPromptSelect: () => void;
  onTextSubmit?: (text: string) => void;
  onVoiceActivate?: () => void;
}

export function PromptsSidebar({ onPromptSelect }: PromptsSidebarProps) {
  const prompts = [
    '"Relaxed but alert, no anxiety"',
    '"Pain relief and anti-nausea, but no jitters"',
    '"Something like Blue Dream, but calmer"',
    '"Focused and creative without racing thoughts"',
  ];

  return (
    <div className="w-full h-full px-8 py-12 flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-white/60 mb-3 leading-relaxed">
          Describe the outcome<br />you're looking for
        </h2>

        {/* New Input Controls */}
        <div className="space-y-3 mt-6">
          <div className="relative group">
            <input
              type="text"
              placeholder="Type your desired outcome..."
              className="w-full px-10 py-3 rounded-xl bg-white/[0.03] border border-white/10 
                         text-sm text-white/80 placeholder:text-white/20
                         focus:bg-white/[0.05] focus:border-[#D4AF37]/30 focus:outline-none 
                         transition-all duration-300"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && onTextSubmit) {
                  onTextSubmit((e.target as HTMLInputElement).value);
                }
              }}
            />
            <Keyboard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#D4AF37]/40 transition-colors" />
          </div>

          <button
            onClick={onVoiceActivate}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 
                       bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 border border-[#D4AF37]/10 
                       hover:border-[#D4AF37]/30 rounded-xl transition-all duration-300 group"
          >
            <Mic className="w-4 h-4 text-[#D4AF37]/60 group-hover:text-[#D4AF37] transition-colors" />
            <span className="text-xs uppercase tracking-widest text-[#D4AF37]/60 group-hover:text-[#D4AF37]">
              Voice Input
            </span>
          </button>
        </div>

        <div className="mt-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-medium">
            Preset Prompts
          </p>
        </div>
      </div>

      {/* Prompts */}
      <div className="flex-1 space-y-3">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={onPromptSelect}
            className="w-full text-left px-5 py-4 text-sm text-white/60 hover:text-white/90 
                       bg-white/[0.02] hover:bg-white/[0.06] backdrop-blur-2xl
                       rounded-xl transition-all duration-200 ease-out
                       shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]
                       hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]
                       hover:-translate-y-0.5"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
