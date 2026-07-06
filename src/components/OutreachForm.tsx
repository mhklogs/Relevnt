import { GeneratorInputs } from "../types";
import { PRESETS } from "../data/presets";
import { Sparkles, FileText, Zap } from "lucide-react";

interface OutreachFormProps {
  inputs: GeneratorInputs;
  setInputs: (inputs: GeneratorInputs) => void;
  onSubmit: () => void;
  isGenerating: boolean;
}

export default function OutreachForm({
  inputs,
  setInputs,
  onSubmit,
  isGenerating,
}: OutreachFormProps) {
  const handleInputChange = (value: string) => {
    setInputs({
      targetDescription: value,
    });
  };

  const isFormValid = inputs.targetDescription.trim() !== "";

  return (
    <div className="flex flex-col gap-6" id="outreach-form-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isFormValid && !isGenerating) onSubmit();
        }}
        className="flex flex-col gap-5"
        id="generator-form"
      >
        {/* Section 1: Messy Target Description */}
        <div className="bg-[#0c0a09] border border-[#292524] rounded-xl p-5 shadow-xs flex flex-col gap-4" id="target-section">
          <div className="flex items-center gap-2 border-b border-[#1c1917] pb-3">
            <div className="p-1.5 bg-[#1c1917] rounded-md text-[#fafaf9]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#fafaf9]">Messy Target Description</h3>
              <p className="text-[11px] text-[#a8a29e]">Describe the persona, locations, industry, and size details in plain text.</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] text-[#a8a29e] font-medium mr-1 self-center">Quick Presets:</span>
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleInputChange(preset.inputs.targetDescription)}
                  className="px-2 py-1 text-[10px] bg-[#1c1917] hover:bg-[#292524] border border-[#292524] rounded-md font-medium text-[#a8a29e] hover:text-[#fafaf9] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Zap className="w-2.5 h-2.5 text-amber-500" />
                  {preset.label}
                </button>
              ))}
            </div>
            <textarea
              id="targetDescription"
              rows={8}
              placeholder="e.g., I want to target engineering leaders like VPs, Directors of Engineering, or CTOs at early-stage AI/ML startups in SF Bay Area with 10-50 employees who focus on generative AI models..."
              value={inputs.targetDescription}
              onChange={(e) => handleInputChange(e.target.value)}
              className="px-4 py-3 text-sm bg-[#1c1917] border border-[#292524] text-[#fafaf9] rounded-lg focus:outline-none focus:border-[#44403c] focus:bg-black transition-colors font-sans leading-relaxed resize-y min-h-[150px]"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          id="generate-outreach-btn"
          disabled={!isFormValid || isGenerating}
          className={`w-full py-3.5 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
            isGenerating
              ? "bg-[#292524] text-[#78716c] cursor-not-allowed hover:scale-100 active:scale-100"
              : isFormValid
              ? "bg-[#fafaf9] text-[#1c1917] hover:bg-[#e7e5e4] shadow-md hover:shadow-lg active:scale-[0.99]"
              : "bg-[#1c1917] text-[#78716c] border border-[#292524] cursor-not-allowed hover:scale-100 active:scale-100"
          }`}
        >
          <Sparkles className={`w-4 h-4 ${isGenerating ? "animate-spin text-red-500" : "text-red-500"}`} />
          {isGenerating ? "Analyzing Target & Sourcing Parameters..." : "Generate Sourcing Parameters"}
        </button>
      </form>
    </div>
  );
}
