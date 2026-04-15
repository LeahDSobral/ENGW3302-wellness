import { useState, useEffect, useRef } from "react";

const POSES = [
  { name: "child's pose", emoji: "🙇", instruction: "Kneel and lower your forehead to the floor (or a pillow). Stretch your arms forward or rest them by your sides. Breathe into your back.", duration: 25000 },
  { name: "cat-cow stretch", emoji: "🐱", instruction: "On hands and knees. Inhale: drop your belly, lift your head (cow). Exhale: round your spine up toward the ceiling (cat). Flow slowly.", duration: 30000 },
  { name: "seated forward fold", emoji: "🧘", instruction: "Sit with legs extended. Reach toward your feet — only as far as comfortable. Let your spine soften. Breathe into any tightness.", duration: 25000 },
  { name: "supine twist", emoji: "🌀", instruction: "Lie on your back. Draw one knee to your chest, then guide it across your body. Arms out to the sides. Look away from the knee. Switch sides.", duration: 30000 },
  { name: "legs up the wall", emoji: "🦋", instruction: "Lie on your back with legs resting up against a wall. Arms relaxed at your sides. Close your eyes. Let gravity do the work.", duration: 30000 },
  { name: "standing forward bend", emoji: "🌿", instruction: "Stand with feet hip-width. Slowly hinge forward, letting your head hang heavy. Bend your knees slightly if needed. Breathe.", duration: 25000 },
];

export default function YogaExercise({ onComplete }) {
  const [poseIdx, setPoseIdx] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);
  const progressRef = useRef(null);

  const runPose = (idx) => {
    if (idx >= POSES.length) { setDone(true); return; }
    setPoseIdx(idx);
    setProgress(0);
    const dur = POSES[idx].duration;
    let start = Date.now();
    progressRef.current = setInterval(() => setProgress(Math.min(((Date.now() - start) / dur) * 100, 100)), 80);
    timerRef.current = setTimeout(() => { clearInterval(progressRef.current); runPose(idx + 1); }, dur);
  };

  useEffect(() => () => { clearTimeout(timerRef.current); clearInterval(progressRef.current); }, []);

  if (done) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-mono text-center" style={{ backgroundColor: '#04080f' }}>
      <div className="text-5xl mb-4">🌿</div>
      <h2 className="text-xl mb-2" style={{ color: '#4fc3f7' }}>gently done</h2>
      <p className="text-sm mb-6" style={{ color: '#6a85b0' }}>You moved with care. Your body will thank you.</p>
      <p className="text-xs mb-8" style={{ color: '#6a85b050' }}>Gentle yoga and stretching reduce cortisol and adrenaline, activate the parasympathetic system, and improve mood within a single session (Bui et al., 2021).</p>
      <button onClick={onComplete} className="px-8 py-3 rounded-xl font-mono text-sm font-bold" style={{ backgroundColor: '#4fc3f7', color: '#04080f' }}>complete ✓</button>
    </div>
  );

  const pose = POSES[poseIdx];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-mono" style={{ backgroundColor: '#04080f' }}>
      <div className="max-w-sm w-full text-center">
        <h2 className="mb-1" style={{ color: '#ccd6f6', fontSize: '16px' }}>gentle stretch sequence</h2>
        <p className="mb-8" style={{ color: '#6a85b0', fontSize: '12px' }}>move at your own pace</p>

        {poseIdx === -1 ? (
          <>
            <p className="text-sm mb-8" style={{ color: '#6a85b0', lineHeight: '1.8' }}>
              6 gentle poses. No flexibility required. Move only as far as is comfortable. If something doesn't feel right, skip it — listen to your body.
            </p>
            <button onClick={() => runPose(0)} className="px-10 py-3 rounded-xl font-mono text-sm font-bold" style={{ backgroundColor: '#4fc3f7', color: '#04080f' }}>begin</button>
          </>
        ) : (
          <>
            <div className="flex justify-center gap-1.5 mb-6">
              {POSES.map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: i < poseIdx ? '#4fc3f7' : i === poseIdx ? '#4fc3f7' : '#0d1b2e', opacity: i === poseIdx ? 1 : i < poseIdx ? 0.5 : 0.3 }} />
              ))}
            </div>

            <div className="text-6xl mb-4 animate-float">{pose?.emoji}</div>

            <div className="rounded-2xl p-5 mb-6" style={{ backgroundColor: '#080e1a', border: '1px solid #0d1b2e' }}>
              <div style={{ color: '#4fc3f7', fontSize: '13px', marginBottom: '6px' }}>{pose?.name}</div>
              <p style={{ color: '#ccd6f6', fontSize: '13px', lineHeight: '1.8' }}>{pose?.instruction}</p>
            </div>

            <div className="w-full h-1.5 rounded-full overflow-hidden mb-2" style={{ backgroundColor: '#0d1b2e' }}>
              <div className="h-full rounded-full transition-none" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #4fc3f7, #81d4fa)' }} />
            </div>
            <div style={{ color: '#6a85b050', fontSize: '10px', marginBottom: '4px' }}>{pose ? Math.ceil((POSES[poseIdx].duration / 1000) * (1 - progress / 100)) : 0}s remaining</div>
            <div style={{ color: '#6a85b050', fontSize: '10px' }}>pose {poseIdx + 1} of {POSES.length}</div>
          </>
        )}
      </div>
    </div>
  );
}