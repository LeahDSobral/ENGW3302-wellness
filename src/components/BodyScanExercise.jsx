import { useState, useEffect, useRef } from "react";

const BODY_PARTS = [
  { name: "top of head", instruction: "Gently bring awareness to the top of your head. Notice any tension, tingling, or sensation without judgment.", duration: 8000 },
  { name: "face & jaw", instruction: "Soften your forehead. Let your jaw drop slightly. Release any holding in your cheeks.", duration: 8000 },
  { name: "neck & shoulders", instruction: "Notice your shoulders. Are they raised toward your ears? Let them drop. Feel the weight release.", duration: 9000 },
  { name: "chest & heart", instruction: "Place a hand on your heart if you'd like. Notice it beating. Feel your chest rise and fall.", duration: 9000 },
  { name: "belly", instruction: "Let your belly be soft. Release any holding. Notice the warmth here.", duration: 8000 },
  { name: "hands & arms", instruction: "Wiggle your fingers. Notice the air touching your skin. Feel the weight of your arms.", duration: 7000 },
  { name: "hips & lower back", instruction: "Notice where your body meets the surface. Feel supported. Release any tightness in your lower back.", duration: 9000 },
  { name: "legs & knees", instruction: "Soften your thighs. Let your legs feel heavy and still. Release the effort of standing or sitting.", duration: 7000 },
  { name: "feet & toes", instruction: "Feel your feet. The floor beneath them. The weight of your whole body flowing down. You are here.", duration: 10000 },
];

export default function BodyScanExercise({ onComplete }) {
  const [partIdx, setPartIdx] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);
  const progressRef = useRef(null);

  const runPart = (idx) => {
    if (idx >= BODY_PARTS.length) { setDone(true); return; }
    setPartIdx(idx);
    setProgress(0);
    const dur = BODY_PARTS[idx].duration;
    let start = Date.now();
    progressRef.current = setInterval(() => setProgress(Math.min(((Date.now() - start) / dur) * 100, 100)), 80);
    timerRef.current = setTimeout(() => { clearInterval(progressRef.current); runPart(idx + 1); }, dur);
  };

  useEffect(() => () => { clearTimeout(timerRef.current); clearInterval(progressRef.current); }, []);

  const part = partIdx >= 0 ? BODY_PARTS[partIdx] : null;

  if (done) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-mono text-center" style={{ backgroundColor: '#04080f' }}>
      <div className="text-5xl mb-4">🫧</div>
      <h2 className="text-xl mb-2" style={{ color: '#4fc3f7' }}>full body, fully here</h2>
      <p className="text-sm mb-6" style={{ color: '#6a85b0' }}>You've gently visited every part of yourself. That's an act of care.</p>
      <p className="text-xs mb-8" style={{ color: '#6a85b050' }}>Body scan practice reconnects dissociated or numbed states with present-moment bodily experience (Worthen & Cash, 2023).</p>
      <button onClick={onComplete} className="px-8 py-3 rounded-xl font-mono text-sm font-bold" style={{ backgroundColor: '#4fc3f7', color: '#04080f' }}>complete ✓</button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-mono" style={{ backgroundColor: '#04080f' }}>
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <h2 style={{ color: '#ccd6f6', fontSize: '16px' }}>body scan</h2>
          <p style={{ color: '#6a85b0', fontSize: '12px' }}>moving gently through your body</p>
        </div>

        {partIdx === -1 ? (
          <div className="text-center">
            <p className="mb-6 text-sm" style={{ color: '#6a85b0', lineHeight: '1.8' }}>
              Sit or lie comfortably. Close your eyes if you'd like. We'll move slowly through each part of your body, just noticing — no need to change anything.
            </p>
            <button onClick={() => runPart(0)} className="px-10 py-3 rounded-xl font-mono text-sm font-bold" style={{ backgroundColor: '#4fc3f7', color: '#04080f' }}>begin</button>
          </div>
        ) : (
          <>
            {/* Body diagram dots */}
            <div className="flex justify-center gap-1.5 mb-8 flex-wrap">
              {BODY_PARTS.map((p, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full transition-all"
                  style={{ backgroundColor: i < partIdx ? '#4fc3f7' : i === partIdx ? '#4fc3f7' : '#0d1b2e', opacity: i === partIdx ? 1 : i < partIdx ? 0.5 : 0.3, boxShadow: i === partIdx ? '0 0 8px #4fc3f7' : 'none' }} />
              ))}
            </div>

            <div className="rounded-2xl p-6 text-center mb-6" style={{ backgroundColor: '#080e1a', border: '1px solid #0d1b2e', boxShadow: '0 0 20px #4fc3f710' }}>
              <div style={{ color: '#4fc3f7', fontSize: '12px', marginBottom: '8px' }}>now: {part?.name}</div>
              <p style={{ color: '#ccd6f6', fontSize: '14px', lineHeight: '1.8' }}>{part?.instruction}</p>
            </div>

            <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#0d1b2e' }}>
              <div className="h-full rounded-full transition-none" style={{ width: `${progress}%`, backgroundColor: '#4fc3f7' }} />
            </div>
            <div className="text-center mt-2" style={{ color: '#6a85b050', fontSize: '10px' }}>{partIdx + 1} of {BODY_PARTS.length}</div>
          </>
        )}
      </div>
    </div>
  );
}