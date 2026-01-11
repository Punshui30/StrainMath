interface PromptsSidebarProps {
  onPromptSelect: () => void;
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
      <div className="mb-12">
        <h2 className="text-sm font-medium text-white/60 mb-3 leading-relaxed">
          Describe the outcome<br />you're looking for
        </h2>
        <p className="text-xs text-white/30 leading-relaxed font-light">
          There's no right way to ask
        </p>
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
