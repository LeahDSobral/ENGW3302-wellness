import { useState, useEffect, useRef } from "react";

const MUSCLES = [
  { name: "hands", tense: "Squeeze both fists as tight as you can", release: "Let go completely. Feel the difference.", tenseDur: 7000, releaseDur: 10000 },
  { name: "arms", tense: "Flex your biceps, pull your arms toward your shoulders", release: "Drop them. Notice the warmth.", tenseDur: 7000, releaseDur: 10000 },
  { name: "shoulders", tense: "Shrug your shoulders up to your ears and hold", release: "Release them down. Feel the weight drop.", tenseDur: 7000, releaseDur: 10000 },
  { name: "face", tense: "Scrunch your entire face — eyes, nose, mouth", release: "Smooth everything out. Feel your face relax.", tenseDur: 7000, releaseDur: 10000 },
  { name: "chest", tense: "Take a deep breath, hold it, and tense your chest", release: "Slowly exhale and let your chest soften.", tenseDur: 7000, releaseDur: 10000 },
  { name: "belly", tense: "Tighten your stomach muscles as if bracing for impact", release: "Let your belly go completely soft.", tenseDur: 7000, releaseDur: 10000 },
  { name: "legs", tense: "Tighten your thighs, calves, and feet together", release: "Release. Feel your legs become heavy and still.", tenseDur: 7000, releaseDur: 10000 },
];

export default function PMRExercise({ onComplete }) {
  const [phase, setPhase] = useState("intro"); // intro | tense | release | done
  const [muscleIdx, setMuscleIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const progressRef = useRef(null);

  const runTense = (idx) => {
    setMuscleIdx(idx);
    setPhase("tense");
    setProgress(0);
    const dur = MUSCLES[idx].tenseDur;
    let start = Date.now();
    progressRef.current = setInterval(() => setProgress(Math.min(((Date.now() - start) / dur) * 100, 100)), 80);
    timerRef.current = setTimeout(() => { clearInterval(progressRef.current); runRelease(idx); }, dur);
  };

  const runRelease = (idx) => {
    setPhase("release");
    setProgress(0);
    const dur = MUSCLES[idx].releaseDur;
    let start = Date.now();
    progressRef.current = setInterval(() => setProgress(Math.min(((Date.now() - start) / dur) * 100, 100)), 80);
    timerRef.current = setTimeout(() => {
      clearInterval(progressRef.current);
      if (idx + 1 < MUSCLES.length) runTense(idx + 1);
      else setPhase("done");
    }, dur);
  };

  useEffect(() => () => { clearTimeout(timerRef.current); clearInterval(progressRef.current); }, []);

  const muscle = MUSCLES[muscleIdx];

  if (phase === "done") return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-mono text-center" style={{ backgroundColor: '#04080f' }}>
      <div className="text-5xl mb-4">🌊</div>
      <h2 className="text-xl mb-2" style={{ color: '#4fc3f7' }}>tension released</h2>
      <p className="text-sm mb-6" style={{ color: '#6a85b0' }}>You've worked through every major muscle group. Your body knows how to relax — you just reminded it.</p>
      <p className="text-xs mb-8" style={{ color: '#6a85b050' }}>PMR has strong evidence for reducing somatic symptoms of stress and improving sleep quality (Williamson, 1994; Rathi & Kumar, 2022).</p>
      <button onClick={onComplete} className="px-8 py-3 rounded-xl font-mono text-sm font-bold" style={{ backgroundColor: '#4fc3f7', color: '#04080f' }}>complete ✓</button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-mono" style={{ backgroundColor: '#04080f' }}>
      <div className="max-w-sm w-full text-center">
        <h2 className="mb-1" style={{ color: '#ccd6f6', fontSize: '16px' }}>progressive muscle relaxation</h2>
        <p className="mb-8" style={{ color: '#6a85b0', fontSize: '12px' }}>tense, then release</p>

        {phase === "intro" ? (
          <>
            <p className="text-sm mb-8" style={{ color: '#6a85b0', lineHeight: '1.8' }}>
              We'll move through 7 muscle groups. For each one, you'll tense for 7 seconds, then release completely for 10 seconds. Notice the difference between tension and release.
            </p>
            <button onClick={() => runTense(0)} className="px-10 py-3 rounded-xl font-mono text-sm font-bold" style={{ backgroundColor: '#4fc3f7', color: '#04080f' }}>begin</button>
          </>
        ) : (
          <>
            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-8">
              {MUSCLES.map((m, i) => (
                <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: i < muscleIdx ? '#4fc3f7' : i === muscleIdx ? '#4fc3f7' : '#0d1b2e', opacity: i === muscleIdx ? 1 : i < muscleIdx ? 0.5 : 0.3 }} />
              ))}
            </div>

            <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: '#080e1a', border: `1px solid ${phase === 'tense' ? '#4fc3f750' : '#0d1b2e'}`, boxShadow: phase === 'tense' ? '0 0 20px #4fc3f720' : 'none' }}>
              <div style={{ color: phase === 'tense' ? '#4fc3f7' : '#6a85b0', fontSize: '11px', marginBottom: '6px' }}>
                {phase === 'tense' ? '⚡ TENSE' : '✦ RELEASE'} — {muscle?.name}
              </div>
              <p style={{ color: '#ccd6f6', fontSize: '14px', lineHeight: '1.7' }}>
                {phase === 'tense' ? muscle?.tense : muscle?.release}
              </p>
            </div>

            <div className="w-full h-1.5 rounded-full overflow-hidden mb-2" style={{ backgroundColor: '#0d1b2e' }}>
              <div className="h-full rounded-full transition-none" style={{ width: `${progress}%`, backgroundColor: phase === 'tense' ? '#4fc3f7' : '#81d4fa' }} />
            </div>
            <div style={{ color: '#6a85b050', fontSize: '10px' }}>{muscleIdx + 1} of {MUSCLES.length}</div>
          </>
        )}
      </div>
    </div>
  );
}