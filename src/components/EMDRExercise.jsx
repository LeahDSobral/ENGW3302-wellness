import { useState, useEffect, useRef } from "react";

// EMDR-style bilateral stimulation — alternating tap cues and visual tracking
// Based on Shapiro's EMDR framework adapted for self-help contexts

const PHASES = [
  { id: "prep", title: "preparation", instruction: "Identify one distressing thought or feeling you'd like to work with. Just notice it — you don't need to solve it. Rate how distressing it feels from 0–10." },
  { id: "bilateral", title: "bilateral stimulation", instruction: "Follow the dot with your eyes as it moves left and right. At the same time, gently tap your knees alternately — left, right, left, right." },
  { id: "check", title: "check in", instruction: "Take a breath. Notice what came up — images, thoughts, sensations, emotions. Don't judge any of it. What do you notice?" },
  { id: "close", title: "closing", instruction: "Imagine a safe, calm place. Allow the feelings to settle. Remember: you are safe, you are here, you are okay." },
];

export default function EMDRExercise({ onComplete }) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [dotX, setDotX] = useState(0);
  const [direction, setDirection] = useState(1);
  const [sets, setSets] = useState(0);
  const [tapSide, setTapSide] = useState("left");
  const animRef = useRef(null);
  const tapRef = useRef(null);
  const done = phaseIdx >= PHASES.length;

  useEffect(() => {
    if (PHASES[phaseIdx]?.id === "bilateral") {
      startBilateral();
    }
    return () => { cancelAnimationFrame(animRef.current); clearInterval(tapRef.current); };
  }, [phaseIdx]);

  const startBilateral = () => {
    let x = 0;
    let dir = 1;
    let setCount = 0;
    const speed = 2.5;
    const max = 100;

    const animate = () => {
      x += dir * speed;
      if (x >= max) { x = max; dir = -1; setCount++; setSets(setCount); }
      if (x <= 0) { x = 0; dir = 1; }
      setDotX(x);
      setDirection(dir);
      if (setCount < 24) animRef.current = requestAnimationFrame(animate);
      else { setPhaseIdx(p => p + 1); }
    };
    animRef.current = requestAnimationFrame(animate);

    let tapDir = 'left';
    tapRef.current = setInterval(() => {
      tapDir = tapDir === 'left' ? 'right' : 'left';
      setTapSide(tapDir);
    }, 600);
  };

  const next = () => {
    cancelAnimationFrame(animRef.current);
    clearInterval(tapRef.current);
    setPhaseIdx(p => p + 1);
  };

  if (done) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-mono text-center" style={{ backgroundColor: '#04080f' }}>
      <div className="text-5xl mb-4">🌀</div>
      <h2 className="text-xl mb-2" style={{ color: '#4fc3f7' }}>session complete</h2>
      <p className="text-sm mb-6" style={{ color: '#6a85b0', lineHeight: '1.8' }}>Bilateral stimulation activates both hemispheres of the brain, helping process and refile distressing memories and loops. Notice how you feel compared to when you started.</p>
      <p className="text-xs mb-8" style={{ color: '#6a85b050' }}>EMDR-informed bilateral techniques have shown efficacy in reducing intrusive thoughts and emotional intensity (Egger et al., 2023). This is a self-guided adaptation, not clinical EMDR.</p>
      <button onClick={onComplete} className="px-8 py-3 rounded-xl font-mono text-sm font-bold" style={{ backgroundColor: '#4fc3f7', color: '#04080f' }}>complete ✓</button>
    </div>
  );

  const phase = PHASES[phaseIdx];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-mono" style={{ backgroundColor: '#04080f' }}>
      <div className="max-w-sm w-full">
        <div className="text-center mb-6">
          <h2 style={{ color: '#ccd6f6', fontSize: '16px' }}>bilateral stimulation</h2>
          <p style={{ color: '#6a85b0', fontSize: '11px' }}>EMDR-informed technique</p>
        </div>

        {/* Phase dots */}
        <div className="flex justify-center gap-2 mb-8">
          {PHASES.map((p, i) => (
            <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: i <= phaseIdx ? '#4fc3f7' : '#0d1b2e', opacity: i === phaseIdx ? 1 : 0.4 }} />
          ))}
        </div>

        <div className="text-center mb-6">
          <div style={{ color: '#4fc3f7', fontSize: '11px', marginBottom: '8px' }}>{phase.title}</div>
        </div>

        {phase.id === "bilateral" ? (
          <div>
            {/* Bilateral tracker */}
            <div className="relative rounded-2xl mb-6 overflow-hidden" style={{ backgroundColor: '#080e1a', border: '1px solid #0d1b2e', height: '80px' }}>
              <div
                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full transition-none"
                style={{ left: `${dotX}%`, backgroundColor: '#4fc3f7', boxShadow: '0 0 15px #4fc3f7' }}
              />
            </div>
            {/* Tap guide */}
            <div className="flex justify-center gap-8 mb-6">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all"
                  style={{ backgroundColor: tapSide === 'left' ? '#4fc3f730' : '#0d1b2e', border: `2px solid ${tapSide === 'left' ? '#4fc3f7' : '#0d1b2e'}`, boxShadow: tapSide === 'left' ? '0 0 15px #4fc3f760' : 'none' }}>
                  👈
                </div>
                <span style={{ color: tapSide === 'left' ? '#4fc3f7' : '#6a85b050', fontSize: '10px' }}>tap left knee</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all"
                  style={{ backgroundColor: tapSide === 'right' ? '#4fc3f730' : '#0d1b2e', border: `2px solid ${tapSide === 'right' ? '#4fc3f7' : '#0d1b2e'}`, boxShadow: tapSide === 'right' ? '0 0 15px #4fc3f760' : 'none' }}>
                  👉
                </div>
                <span style={{ color: tapSide === 'right' ? '#4fc3f7' : '#6a85b050', fontSize: '10px' }}>tap right knee</span>
              </div>
            </div>
            <div className="text-center" style={{ color: '#6a85b0', fontSize: '12px' }}>sets: {sets} / 24</div>
          </div>
        ) : (
          <div>
            <div className="rounded-2xl p-5 mb-8" style={{ backgroundColor: '#080e1a', border: '1px solid #0d1b2e' }}>
              <p style={{ color: '#ccd6f6', fontSize: '14px', lineHeight: '1.8' }}>{phase.instruction}</p>
            </div>
            <button onClick={next} className="w-full py-3 rounded-xl font-mono text-sm font-bold" style={{ backgroundColor: '#4fc3f7', color: '#04080f' }}>
              {phaseIdx === PHASES.length - 1 ? 'finish' : 'continue →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}