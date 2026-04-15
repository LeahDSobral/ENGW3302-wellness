import { useState, useEffect, useRef } from "react";

const STEPS = [
  { text: "Close your eyes. Take three slow breaths.", duration: 8000 },
  { text: "Imagine a place where you feel completely safe and calm. It can be real or imagined — a beach, a forest, a cozy room, anywhere.", duration: 10000 },
  { text: "What do you see there? Notice the colors, the light, the shapes around you.", duration: 10000 },
  { text: "What sounds are present? Birds, water, wind, quiet music, silence.", duration: 9000 },
  { text: "What does the air feel like? Is it warm? Cool? What can you smell?", duration: 9000 },
  { text: "Notice how your body feels in this place. Feel yourself settle in.", duration: 9000 },
  { text: "You are completely safe here. Nothing can reach you. Stay here as long as you need.", duration: 12000 },
  { text: "Slowly begin to return. Wiggle your fingers. Take a deep breath.", duration: 8000 },
];

export default function VisualizationExercise({ onComplete }) {
  const [stepIdx, setStepIdx] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);
  const progressRef = useRef(null);

  const runStep = (idx) => {
    if (idx >= STEPS.length) { setDone(true); return; }
    setStepIdx(idx);
    setProgress(0);
    const dur = STEPS[idx].duration;
    let start = Date.now();
    progressRef.current = setInterval(() => setProgress(Math.min(((Date.now() - start) / dur) * 100, 100)), 80);
    timerRef.current = setTimeout(() => { clearInterval(progressRef.current); runStep(idx + 1); }, dur);
  };

  useEffect(() => () => { clearTimeout(timerRef.current); clearInterval(progressRef.current); }, []);

  if (done) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-mono text-center" style={{ backgroundColor: '#04080f' }}>
      <div className="text-5xl mb-4">🌙</div>
      <h2 className="text-xl mb-2" style={{ color: '#4fc3f7' }}>welcome back</h2>
      <p className="text-sm mb-6" style={{ color: '#6a85b0' }}>Your safe place is always accessible. You can return anytime you need.</p>
      <p className="text-xs mb-8" style={{ color: '#6a85b050' }}>Guided visualization activates the parasympathetic nervous system and reduces cortisol — even imagined safety produces real physiological calm (Worthen & Cash, 2023).</p>
      <button onClick={onComplete} className="px-8 py-3 rounded-xl font-mono text-sm font-bold" style={{ backgroundColor: '#4fc3f7', color: '#04080f' }}>complete ✓</button>
    </div>
  );

  const step = STEPS[stepIdx];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-mono" style={{ backgroundColor: '#04080f' }}>
      <div className="max-w-sm w-full text-center">
        <h2 className="mb-1" style={{ color: '#ccd6f6', fontSize: '16px' }}>safe place visualization</h2>
        <p className="mb-8" style={{ color: '#6a85b0', fontSize: '12px' }}>close your eyes and follow the words</p>

        {stepIdx === -1 ? (
          <>
            <div className="text-6xl mb-6 animate-float">🌙</div>
            <p className="text-sm mb-8" style={{ color: '#6a85b0', lineHeight: '1.8' }}>
              This guided visualization will take you to a calm inner space. Find a comfortable position, and allow yourself to be still.
            </p>
            <button onClick={() => runStep(0)} className="px-10 py-3 rounded-xl font-mono text-sm font-bold" style={{ backgroundColor: '#4fc3f7', color: '#04080f' }}>begin</button>
          </>
        ) : (
          <>
            <div className="text-5xl mb-6">
              {["😌","🌊","🌈","🎵","🌸","🫂","⭐","🌅"][stepIdx] || "✨"}
            </div>
            <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: '#080e1a', border: '1px solid #0d1b2e', boxShadow: '0 0 30px #4fc3f710' }}>
              <p style={{ color: '#ccd6f6', fontSize: '16px', lineHeight: '1.9', letterSpacing: '0.02em' }}>{step?.text}</p>
            </div>
            <div className="w-full h-0.5 rounded-full overflow-hidden mb-2" style={{ backgroundColor: '#0d1b2e' }}>
              <div className="h-full rounded-full transition-none" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #4fc3f7, #81d4fa)' }} />
            </div>
            <div style={{ color: '#6a85b050', fontSize: '10px' }}>{stepIdx + 1} of {STEPS.length}</div>
          </>
        )}
      </div>
    </div>
  );
}