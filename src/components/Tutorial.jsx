import { useState } from "react";

const STEPS = [
  {
    id: "welcome",
    title: "welcome 🌱",
    content: "This is your personal wellness companion. It's here to help you understand and care for your emotional state — not to diagnose or replace professional support.",
    disclaimer: true,
  },
  {
    id: "checkin",
    title: "check-in tab",
    content: "The center button (🌱) is your check-in. Tap the words that describe how you're feeling — as many as you need. Then rate your stress level from 1 to 5.",
    highlight: "check-in",
  },
  {
    id: "adjectives",
    title: "choosing words",
    content: "Words are organized into four categories based on how stress shows up in your body and mind. You can also type your own. The more honest you are, the more tailored your plan will be.",
    highlight: "check-in",
  },
  {
    id: "results",
    title: "your wellness plan",
    content: "After check-in, you'll receive a personalized affirmation and four evidence-based activity suggestions matched to exactly how you're feeling right now.",
    highlight: "check-in",
  },
  {
    id: "exercises",
    title: "guided exercises",
    content: "Each check-in also suggests one guided exercise — breathing, grounding, body scan, muscle relaxation, bilateral tapping, visualization, yoga, or a sensory reset. These are research-backed techniques.",
    highlight: "check-in",
  },
  {
    id: "journal",
    title: "journal tab",
    content: "The journal tab (📓) lets you write every day. Tap any date on the calendar to read past entries or write a new one. A dot appears under days that have entries.",
    highlight: "journal",
  },
  {
    id: "prompts",
    title: "journal prompts",
    content: "You'll get 5 mood-matched prompts — what went well, what was hard, gratitude, how your body felt, and what you need more of — plus a free write space.",
    highlight: "journal",
  },
  {
    id: "profile",
    title: "profile tab",
    content: "The profile tab (👤) shows your growth. A plant evolves through 10 stages as you check in. A progress bar fills toward each new stage.",
    highlight: "profile",
  },
  {
    id: "animals",
    title: "animal collection",
    content: "Every 10 check-ins you unlock a new animal friend. You can set any unlocked animal as your profile picture. Collect them all!",
    highlight: "profile",
  },
  {
    id: "streak",
    title: "daily streak",
    content: "A streak counts how many consecutive days you've checked in. If you miss a day — that's okay. Research shows self-compassion after a setback improves long-term consistency more than guilt.",
    highlight: "profile",
  },
  {
    id: "disclaimer",
    title: "a gentle note",
    content: "This app supports your wellbeing with evidence-informed strategies (Williamson, 1994; Egger et al., 2023; Worthen & Cash, 2023). It does not replace professional mental health care. If you're struggling, please reach out to a counselor.",
    disclaimer: true,
    final: true,
  },
];

export default function Tutorial({ onComplete, onSkip }) {
  const [stepIdx, setStepIdx] = useState(0);
  const step = STEPS[stepIdx];

  const next = () => {
    if (stepIdx + 1 >= STEPS.length) onComplete();
    else setStepIdx(s => s + 1);
  };

  const prev = () => {
    if (stepIdx > 0) setStepIdx(s => s - 1);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center" style={{ backgroundColor: '#04080f95' }}>
      {/* Highlight overlay — subtle pulsing bg hint */}
      <div className="absolute inset-0" style={{ pointerEvents: 'none' }}>
        {step.highlight === 'check-in' && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full"
            style={{ backgroundColor: '#4fc3f710', boxShadow: '0 0 40px #4fc3f740', bottom: '16px' }} />
        )}
        {step.highlight === 'journal' && (
          <div className="absolute bottom-0 right-8 w-16 h-16 rounded-xl"
            style={{ backgroundColor: '#4fc3f710', boxShadow: '0 0 30px #4fc3f730', bottom: '20px' }} />
        )}
        {step.highlight === 'profile' && (
          <div className="absolute bottom-0 left-8 w-16 h-16 rounded-xl"
            style={{ backgroundColor: '#4fc3f710', boxShadow: '0 0 30px #4fc3f730', bottom: '20px' }} />
        )}
      </div>

      {/* Speech bubble */}
      <div className="w-full max-w-lg mx-4 mb-32 animate-fade-in-up">
        {/* Bubble pointer */}
        <div className="flex justify-center mb-1">
          <div className="w-4 h-4 rotate-45" style={{ backgroundColor: '#080e1a', border: '1px solid #0d1b2e', borderBottom: 'none', borderRight: 'none', marginBottom: '-2px' }} />
        </div>

        <div className="rounded-2xl p-6" style={{ backgroundColor: '#080e1a', border: '1px solid #0d1b2e', boxShadow: '0 0 30px #4fc3f720' }}>
          {/* Step dots */}
          <div className="flex gap-1.5 mb-4 justify-center flex-wrap">
            {STEPS.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ backgroundColor: i === stepIdx ? '#4fc3f7' : i < stepIdx ? '#4fc3f750' : '#0d1b2e' }} />
            ))}
          </div>

          <div className="flex items-start gap-3 mb-4">
            {step.disclaimer && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0" style={{ backgroundColor: '#4fc3f720', border: '1px solid #4fc3f740' }}>
                💙
              </div>
            )}
            <div>
              <h3 className="font-bold mb-2" style={{ color: '#4fc3f7', fontSize: '15px' }}>{step.title}</h3>
              <p style={{ color: '#ccd6f6', fontSize: '13px', lineHeight: '1.8' }}>{step.content}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #0d1b2e' }}>
            <div className="flex items-center gap-3">
              {stepIdx > 0 && (
                <button onClick={prev} style={{ color: '#6a85b0', fontSize: '13px' }}>← back</button>
              )}
              <button onClick={onSkip} style={{ color: '#6a85b050', fontSize: '11px' }}>skip tutorial</button>
            </div>

            <button
              onClick={next}
              className="px-5 py-2 rounded-xl text-sm font-mono font-bold transition-all"
              style={{ backgroundColor: '#4fc3f7', color: '#04080f', boxShadow: '0 0 12px #4fc3f730' }}
            >
              {step.final ? 'get started →' : `next (${stepIdx + 1}/${STEPS.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}