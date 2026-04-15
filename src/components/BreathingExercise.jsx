import { useState, useEffect, useRef } from "react";

const CYCLE = [
  { phase: "inhale", label: "breathe in", duration: 4000, scale: 1, instruction: "expand your belly, breathe slowly through your nose" },
  { phase: "hold", label: "hold", duration: 4000, scale: 1, instruction: "gently hold, stay still" },
  { phase: "exhale", label: "breathe out", duration: 6000, scale: 0.55, instruction: "slowly release through your mouth, let it all go" },
  { phase: "pause", label: "rest", duration: 1000, scale: 0.55, instruction: "" },
];

export default function BreathingExercise({ onComplete }) {
  const [isRunning, setIsRunning] = useState(false);
  const [cycleNum, setCycleNum] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [scale, setScale] = useState(0.55);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const audioCtxRef = useRef(null);
  const timerRef = useRef(null);
  const progressRef = useRef(null);

  const totalCycles = 5;

  const playTone = (freq, duration) => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration / 1000);
    } catch (e) {}
  };

  const runPhase = (cycle, phase) => {
    const p = CYCLE[phase];
    setPhaseIdx(phase);
    setScale(p.scale);
    setProgress(0);

    if (p.phase === "inhale") playTone(528, p.duration);
    else if (p.phase === "exhale") playTone(285, p.duration);

    let start = Date.now();
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min((elapsed / p.duration) * 100, 100));
    }, 50);

    timerRef.current = setTimeout(() => {
      clearInterval(progressRef.current);
      const nextPhase = phase + 1;
      if (nextPhase < CYCLE.length) {
        runPhase(cycle, nextPhase);
      } else {
        const nextCycle = cycle + 1;
        if (nextCycle >= totalCycles) {
          setDone(true);
          setIsRunning(false);
        } else {
          setCycleNum(nextCycle);
          runPhase(nextCycle, 0);
        }
      }
    }, p.duration);
  };

  const start = () => {
    setIsRunning(true);
    setCycleNum(0);
    setDone(false);
    runPhase(0, 0);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      clearInterval(progressRef.current);
      audioCtxRef.current?.close();
    };
  }, []);

  const currentPhase = CYCLE[phaseIdx];
  const circleSize = 180;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-mono" style={{ backgroundColor: '#04080f' }}>
      {done ? (
        <div className="text-center animate-fade-in-up">
          <div className="text-5xl mb-4">🌊</div>
          <h2 className="text-xl mb-2" style={{ color: '#4fc3f7' }}>beautifully done</h2>
          <p className="mb-6 text-sm" style={{ color: '#6a85b0' }}>you completed 5 full breathing cycles.</p>
          <p className="text-xs mb-8" style={{ color: '#6a85b050' }}>Research shows 4-4-6 breathing activates the parasympathetic nervous system, reducing cortisol within minutes (Worthen & Cash, 2023).</p>
          <button
            onClick={onComplete}
            className="px-8 py-3 rounded-xl font-mono text-sm font-bold"
            style={{ backgroundColor: '#4fc3f7', color: '#04080f' }}
          >
            complete ✓
          </button>
        </div>
      ) : (
        <>
          <div className="text-center mb-8">
            <h2 className="text-lg mb-1" style={{ color: '#ccd6f6' }}>4 · 4 · 6 breathing</h2>
            <p style={{ color: '#6a85b0', fontSize: '12px' }}>cycle {cycleNum + 1} of {totalCycles}</p>
          </div>

          {/* Cycle dots */}
          <div className="flex gap-2 mb-10">
            {Array.from({ length: totalCycles }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-all"
                style={{ backgroundColor: i < cycleNum ? '#4fc3f7' : i === cycleNum && isRunning ? '#4fc3f7' : '#0d1b2e', border: '1px solid #4fc3f740' }}
              />
            ))}
          </div>

          {/* Breathing Circle */}
          <div className="relative flex items-center justify-center mb-10" style={{ width: circleSize * 1.4, height: circleSize * 1.4 }}>
            {/* Outer glow rings */}
            <div
              className="absolute rounded-full transition-all"
              style={{
                width: circleSize * 1.35 * (isRunning ? scale : 0.55),
                height: circleSize * 1.35 * (isRunning ? scale : 0.55),
                backgroundColor: '#4fc3f705',
                border: '1px solid #4fc3f715',
                transitionDuration: currentPhase?.duration ? `${currentPhase.duration}ms` : '400ms',
                transitionTimingFunction: 'ease-in-out',
              }}
            />
            <div
              className="absolute rounded-full transition-all"
              style={{
                width: circleSize * 1.15 * (isRunning ? scale : 0.55),
                height: circleSize * 1.15 * (isRunning ? scale : 0.55),
                backgroundColor: '#4fc3f710',
                border: '1px solid #4fc3f725',
                transitionDuration: currentPhase?.duration ? `${currentPhase.duration}ms` : '400ms',
                transitionTimingFunction: 'ease-in-out',
              }}
            />
            {/* Main circle */}
            <div
              className="absolute rounded-full flex flex-col items-center justify-center transition-all"
              style={{
                width: circleSize * (isRunning ? scale : 0.55),
                height: circleSize * (isRunning ? scale : 0.55),
                background: isRunning
                  ? `radial-gradient(circle, #4fc3f730 0%, #4fc3f715 60%, #0d1b2e 100%)`
                  : '#0d1b2e',
                border: '2px solid #4fc3f7',
                boxShadow: isRunning ? '0 0 40px #4fc3f740' : '0 0 10px #4fc3f720',
                transitionDuration: currentPhase?.duration ? `${currentPhase.duration}ms` : '400ms',
                transitionTimingFunction: 'ease-in-out',
              }}
            >
              {isRunning && (
                <div className="text-center px-2">
                  <div style={{ color: '#4fc3f7', fontSize: '13px', fontWeight: 'bold' }}>{currentPhase?.label}</div>
                  <div style={{ color: '#6a85b0', fontSize: '10px' }}>{currentPhase?.phase === "hold" ? "hold" : currentPhase?.phase === "pause" ? "" : `${currentPhase?.duration / 1000}s`}</div>
                </div>
              )}
            </div>
          </div>

          {/* Phase progress bar */}
          {isRunning && (
            <div className="w-48 h-0.5 rounded-full overflow-hidden mb-4" style={{ backgroundColor: '#0d1b2e' }}>
              <div
                className="h-full rounded-full transition-none"
                style={{ width: `${progress}%`, backgroundColor: '#4fc3f7' }}
              />
            </div>
          )}

          {/* Instruction text */}
          <p className="text-center text-sm mb-2" style={{ color: '#6a85b0', minHeight: '20px' }}>
            {isRunning ? currentPhase?.instruction : "find a comfortable position"}
          </p>

          {!isRunning && (
            <button
              onClick={start}
              className="mt-6 px-10 py-3 rounded-xl font-mono text-sm font-bold transition-all"
              style={{ backgroundColor: '#4fc3f7', color: '#04080f', boxShadow: '0 0 20px #4fc3f730' }}
            >
              begin
            </button>
          )}
        </>
      )}
    </div>
  );
}