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
        <div className="field-card flex flex-col gap-4 p-5" id="target-section">
          <div className="flex items-center gap-3 border-b border-line/60 pb-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-volt/30 bg-volt/10 text-volt">
              <FileText className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-head text-sm font-semibold text-ink">Messy Target Description</h3>
              <p className="text-[11px] text-ink-soft">Describe the persona, locations, industry, and size details in plain text.</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-1.5">
              <span className="mr-1 self-center font-mono text-[10px] font-medium text-muted">Quick Presets:</span>
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleInputChange(preset.inputs.targetDescription)}
                  className="flex items-center gap-1 rounded-md border border-line bg-white/[0.03] px-2 py-1 text-[10px] font-medium text-ink-soft transition hover:border-volt/40 hover:text-ink cursor-pointer"
                >
                  <Zap className="h-2.5 w-2.5 text-amber" />
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
              className="input-field min-h-[150px] resize-y leading-relaxed"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          id="generate-outreach-btn"
          disabled={!isFormValid || isGenerating}
          className="btn-volt w-full px-4 py-3.5 text-sm"
        >
          <Sparkles className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
          {isGenerating ? "Analyzing Target & Sourcing Parameters..." : "Generate Sourcing Parameters"}
        </button>
      </form>
    </div>
  );
}