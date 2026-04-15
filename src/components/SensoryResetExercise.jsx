import { useState } from "react";

const STEPS = [
  {
    title: "cold water on wrists",
    instruction: "Run cold water over your inner wrists for 30 seconds. The vagus nerve passes through here — cold water activates your body's natural calming response.",
    action: "I did it",
    science: "Cold water on pulse points triggers the dive reflex, rapidly slowing heart rate (Worthen & Cash, 2023).",
    emoji: "💧"
  },
  {
    title: "ice cube hold",
    instruction: "Hold an ice cube (or something cold) in your palm. Notice the sensation — the cold, the temperature change, the water. This is called a 'temperature intervention' and it interrupts dissociation.",
    action: "I did it",
    science: "Temperature sensations ground the nervous system by activating interoceptive awareness.",
    emoji: "🧊"
  },
  {
    title: "scent anchor",
    instruction: "Find something with a strong scent — lotion, a candle, essential oil, even a fruit or spice. Take three slow inhales. The olfactory sense has the most direct path to the brain's emotional center.",
    action: "I did it",
    science: "Olfaction directly activates the amygdala and hippocampus, making scent one of the fastest emotional regulators (Egger et al., 2023).",
    emoji: "🌸"
  },
  {
    title: "textured touch",
    instruction: "Find something with an interesting texture — fabric, a plant, a rough wall, smooth stone. Spend 60 seconds just exploring the texture with your fingertips. Describe what you feel in your mind.",
    action: "I did it",
    science: "Tactile stimulation activates the somatosensory cortex, reducing limbic (emotional) system hyperactivation.",
    emoji: "✋"
  },
  {
    title: "hum or sing",
    instruction: "Hum any note for 30 seconds, or sing a few lines of a song you love. The vibration activates your vagus nerve — you'll feel a buzz in your chest. This is your body calming itself.",
    action: "I did it",
    science: "Humming and singing activate the vagus nerve, which regulates the parasympathetic nervous system (Williamson, 1994).",
    emoji: "🎵"
  }
];

export default function SensoryResetExercise({ onComplete }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(false);

  const next = () => {
    if (stepIdx + 1 >= STEPS.length) setDone(true);
    else setStepIdx(s => s + 1);
  };

  if (done) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-mono text-center" style={{ backgroundColor: '#04080f' }}>
      <div className="text-5xl mb-4">⚡</div>
      <h2 className="text-xl mb-2" style={{ color: '#4fc3f7' }}>senses reactivated</h2>
      <p className="text-sm mb-6" style={{ color: '#6a85b0' }}>You've engaged all five sensory channels. Your body is waking up.</p>
      <p className="text-xs mb-8" style={{ color: '#6a85b050' }}>Sensory interventions are particularly effective for dissociative numbing and shutdown states, providing physiological anchoring (Rathi & Kumar, 2022).</p>
      <button onClick={onComplete} className="px-8 py-3 rounded-xl font-mono text-sm font-bold" style={{ backgroundColor: '#4fc3f7', color: '#04080f' }}>complete ✓</button>
    </div>
  );

  const step = STEPS[stepIdx];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-mono" style={{ backgroundColor: '#04080f' }}>
      <div className="max-w-sm w-full text-center">
        <h2 className="mb-1" style={{ color: '#ccd6f6', fontSize: '16px' }}>sensory reset</h2>
        <p className="mb-6" style={{ color: '#6a85b0', fontSize: '12px' }}>wake up your senses one by one</p>

        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: i < stepIdx ? '#4fc3f7' : i === stepIdx ? '#4fc3f7' : '#0d1b2e', opacity: i === stepIdx ? 1 : i < stepIdx ? 0.5 : 0.3 }} />
          ))}
        </div>

        <div className="text-5xl mb-4">{step.emoji}</div>

        <div className="rounded-2xl p-5 mb-4 text-left" style={{ backgroundColor: '#080e1a', border: '1px solid #0d1b2e' }}>
          <div style={{ color: '#4fc3f7', fontSize: '13px', marginBottom: '8px' }}>{step.title}</div>
          <p style={{ color: '#ccd6f6', fontSize: '13px', lineHeight: '1.8' }}>{step.instruction}</p>
        </div>

        <div className="rounded-xl p-3 mb-6 text-left" style={{ backgroundColor: '#04080f', border: '1px solid #0d1b2e' }}>
          <p style={{ color: '#6a85b050', fontSize: '10px', lineHeight: '1.6', fontStyle: 'italic' }}>🔬 {step.science}</p>
        </div>

        <button onClick={next} className="w-full py-3 rounded-xl font-mono text-sm font-bold" style={{ backgroundColor: '#4fc3f7', color: '#04080f' }}>
          {step.action} {stepIdx < STEPS.length - 1 ? '→' : ''}
        </button>
      </div>
    </div>
  );
}