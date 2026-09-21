import { OutreachInputs } from "../types";
import { Sparkles, User, Briefcase, FileText } from "lucide-react";
import type { ReactNode, ElementType } from "react";

interface EmailFormProps {
  inputs: OutreachInputs;
  setInputs: (inputs: OutreachInputs) => void;
  onSubmit: () => void;
  isGenerating: boolean;
}

export default function EmailForm({
  inputs,
  setInputs,
  onSubmit,
  isGenerating,
}: EmailFormProps) {
  const handleInputChange = (key: keyof OutreachInputs, value: string) => {
    setInputs({
      ...inputs,
      [key]: value,
    });
  };

  const isFormValid =
    inputs.prospectName.trim() !== "" &&
    inputs.prospectTitle.trim() !== "" &&
    inputs.companyName.trim() !== "" &&
    inputs.companyValueProp.trim() !== "" &&
    inputs.senderName.trim() !== "" &&
    inputs.senderCompany.trim() !== "" &&
    inputs.senderValueProp.trim() !== "" &&
    inputs.rawLinkedInActivity.trim() !== "" &&
    inputs.outreachGoal.trim() !== "";

  const Panel = ({ children }: { children: ReactNode }) => (
    <div className="field-card flex flex-col gap-4 p-5">{children}</div>
  );

  const Header = ({ icon: Icon, title, sub }: { icon: ElementType; title: string; sub: string }) => (
    <div className="flex items-center gap-3 border-b border-line/60 pb-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-volt/30 bg-volt/10 text-volt">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <h3 className="font-head text-sm font-semibold text-ink">{title}</h3>
        <p className="text-[11px] text-ink-soft">{sub}</p>
      </div>
    </div>
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isFormValid && !isGenerating) onSubmit();
      }}
      className="flex flex-col gap-5"
      id="email-generator-form"
    >
      {/* Section 0: Outreach Goal */}
      <Panel>
        <Header icon={Sparkles} title="Outreach Goal & Style" sub="Tell the AI what type of message to write based on this prospect." />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="outreachGoal" className="field-label">
            Outreach Goal / Message Type
          </label>
          <input
            type="text"
            id="outreachGoal"
            placeholder="e.g., A hyper-personalized B2B cold email under 100 words"
            value={inputs.outreachGoal}
            onChange={(e) => handleInputChange("outreachGoal", e.target.value)}
            className="input-field"
            required
          />
          <p className="text-[10px] text-ink-soft">
            Examples: "LinkedIn connection request under 300 chars", "Soft partnership inquiry", "Casual follow-up".
          </p>
        </div>
      </Panel>

      {/* Section 1: Prospect */}
      <Panel>
        <Header icon={User} title="Prospect Information" sub="Who are you sending this hyper-personalized email to?" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="prospectName" className="field-label">
              Prospect Full Name
            </label>
            <input
              type="text"
              id="prospectName"
              placeholder="e.g., Sarah Vance"
              value={inputs.prospectName}
              onChange={(e) => handleInputChange("prospectName", e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="prospectTitle" className="field-label">
              Prospect Title / Role
            </label>
            <input
              type="text"
              id="prospectTitle"
              placeholder="e.g., VP of Product"
              value={inputs.prospectTitle}
              onChange={(e) => handleInputChange("prospectTitle", e.target.value)}
              className="input-field"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-1.5 md:col-span-1">
            <label htmlFor="companyName" className="field-label">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              placeholder="e.g., Acme Corp"
              value={inputs.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label htmlFor="companyValueProp" className="field-label">
              What their company does (Value Proposition)
            </label>
            <input
              type="text"
              id="companyValueProp"
              placeholder="e.g., Offers dynamic cloud optimization tools for engineering fleets"
              value={inputs.companyValueProp}
              onChange={(e) => handleInputChange("companyValueProp", e.target.value)}
              className="input-field"
              required
            />
          </div>
        </div>
      </Panel>

      {/* Section 2: Sender */}
      <Panel>
        <Header icon={Briefcase} title="Your Information (The Sender)" sub="What specific B2B outcome do you deliver?" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="senderName" className="field-label">
              Your Name
            </label>
            <input
              type="text"
              id="senderName"
              placeholder="e.g., John Doe"
              value={inputs.senderName}
              onChange={(e) => handleInputChange("senderName", e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="senderCompany" className="field-label">
              Your Company Name
            </label>
            <input
              type="text"
              id="senderCompany"
              placeholder="e.g., LatencyX"
              value={inputs.senderCompany}
              onChange={(e) => handleInputChange("senderCompany", e.target.value)}
              className="input-field"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="senderValueProp" className="field-label">
            One Clear Outcome Delivered & Value Proof
          </label>
          <textarea
            id="senderValueProp"
            rows={2}
            placeholder="e.g., We help engineering leaders reduce AWS compute bills by 30% through automated instance termination metrics."
            value={inputs.senderValueProp}
            onChange={(e) => handleInputChange("senderValueProp", e.target.value)}
            className="input-field resize-none"
            required
          />
          <p className="text-[10px] text-ink-soft">
            Keep it concrete and data-backed (e.g., "reduce churn by 20%", "increase pipeline volume by 1.5x").
          </p>
        </div>
      </Panel>

      {/* Section 3: LinkedIn activity */}
      <Panel>
        <Header icon={FileText} title="Prospect Recent LinkedIn Activity (Keywords)" sub="Copy & paste a recent post, comment, or article written by the prospect." />
        <div className="flex flex-col gap-1.5">
          <textarea
            id="rawLinkedInActivity"
            rows={4}
            placeholder="Paste raw LinkedIn posts, updates, or comments here. The AI will extract deep hooks and react to their unique phrase or data point..."
            value={inputs.rawLinkedInActivity}
            onChange={(e) => handleInputChange("rawLinkedInActivity", e.target.value)}
            className="input-field leading-relaxed"
            required
          />
        </div>
      </Panel>

      {/* Submit */}
      <button
        type="submit"
        id="generate-email-btn"
        disabled={!isFormValid || isGenerating}
        className="btn-volt w-full px-4 py-3.5 text-sm"
      >
        <Sparkles className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
        {isGenerating ? "Analyzing Activity & Writing Email..." : "Generate Personalized Cold Email"}
      </button>
    </form>
  );
}