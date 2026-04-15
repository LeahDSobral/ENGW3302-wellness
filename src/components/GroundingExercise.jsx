import { useState } from "react";

const STEPS = [
  { num: 5, sense: "see", prompt: "Name 5 things you can SEE right now", icon: "👁", color: "#4fc3f7", hint: "Look around slowly. Notice colors, textures, shapes, light." },
  { num: 4, sense: "touch", prompt: "Name 4 things you can TOUCH or FEEL", icon: "✋", color: "#81d4fa", hint: "Your feet on the floor, the air on your skin, fabric under your fingers." },
  { num: 3, sense: "hear", prompt: "Name 3 things you can HEAR", icon: "👂", color: "#6a85b0", hint: "Close your eyes. Notice near sounds and distant ones." },
  { num: 2, sense: "smell", prompt: "Name 2 things you can SMELL", icon: "👃", color: "#4a6fa5", hint: "Take a slow breath. If nothing, imagine a favorite scent." },
  { num: 1, sense: "taste", prompt: "Name 1 thing you can TASTE", icon: "👅", color: "#4fc3f7", hint: "Notice what's present in your mouth right now." },
];

export default function GroundingExercise({ onComplete }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState(["", "", "", "", ""]);
  const [items, setItems] = useState([[], [], [], [], []]);
  const [current, setCurrent] = useState("");
  const [done, setDone] = useState(false);

  const step = STEPS[stepIdx];
  const currentItems = items[stepIdx] || [];

  const addItem = () => {
    const val = current.trim();
    if (!val || currentItems.length >= step.num) return;
    const newItems = items.map((arr, i) => i === stepIdx ? [...arr, val] : arr);
    setItems(newItems);
    setCurrent("");
  };

  const next = () => {
    if (stepIdx < STEPS.length - 1) {
      setStepIdx(s => s + 1);
      setCurrent("");
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 font-mono text-center" style={{ backgroundColor: '#04080f' }}>
        <div className="text-5xl mb-4">⚓</div>
        <h2 className="text-xl mb-2" style={{ color: '#4fc3f7' }}>you're anchored</h2>
        <p className="text-sm mb-2" style={{ color: '#6a85b0' }}>You just engaged all five senses. Your nervous system is returning to the present.</p>
        <p className="text-xs mb-8" style={{ color: '#6a85b050' }}>The 5-4-3-2-1 technique interrupts anxiety loops by engaging sensory perception, breaking the rumination cycle (Williamson, 1994).</p>
        <div className="w-full max-w-xs mb-6 rounded-xl p-4 text-left" style={{ backgroundColor: '#080e1a', border: '1px solid #0d1b2e' }}>
          {STEPS.map((s, i) => (
            <div key={i} className="mb-2">
              <span style={{ color: '#4fc3f7', fontSize: '11px' }}>{s.icon} {s.num} {s.sense}: </span>
              <span style={{ color: '#6a85b0', fontSize: '11px' }}>{items[i]?.join(", ")}</span>
            </div>
          ))}
        </div>
        <button onClick={onComplete} className="px-8 py-3 rounded-xl font-mono text-sm font-bold" style={{ backgroundColor: '#4fc3f7', color: '#04080f' }}>
          complete ✓
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 font-mono" style={{ backgroundColor: '#04080f' }}>
      <div className="max-w-lg mx-auto pt-6">
        {/* Step indicators */}
        <div className="flex gap-2 mb-8 justify-center">
          {STEPS.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{ backgroundColor: i < stepIdx ? '#4fc3f720' : i === stepIdx ? '#4fc3f7' : '#0d1b2e', color: i === stepIdx ? '#04080f' : i < stepIdx ? '#4fc3f7' : '#6a85b0', border: `1px solid ${i <= stepIdx ? '#4fc3f7' : '#0d1b2e'}` }}>
                {i < stepIdx ? '✓' : s.num}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <div className="text-4xl mb-3">{step.icon}</div>
          <h2 className="text-lg mb-2" style={{ color: '#ccd6f6' }}>{step.prompt}</h2>
          <p style={{ color: '#6a85b050', fontSize: '12px' }}>{step.hint}</p>
        </div>

        {/* Items so far */}
        <div className="flex flex-wrap gap-2 mb-4 min-h-10">
          {currentItems.map((item, i) => (
            <span key={i} className="px-3 py-1.5 rounded-full text-sm" style={{ backgroundColor: '#0d1b2e', color: step.color, border: `1px solid ${step.color}40` }}>
              {i + 1}. {item}
            </span>
          ))}
          {Array.from({ length: step.num - currentItems.length }).map((_, i) => (
            <span key={`empty-${i}`} className="px-3 py-1.5 rounded-full text-sm" style={{ backgroundColor: '#080e1a', color: '#6a85b030', border: '1px solid #0d1b2e' }}>
              {currentItems.length + i + 1}. ...
            </span>
          ))}
        </div>

        {/* Input */}
        {currentItems.length < step.num && (
          <div className="flex gap-2 mb-6">
            <input
              value={current}
              onChange={e => setCurrent(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addItem()}
              placeholder={`${currentItems.length + 1} of ${step.num}...`}
              autoFocus
              className="flex-1 px-3 py-2 rounded-xl text-sm font-mono outline-none"
              style={{ backgroundColor: '#080e1a', border: `1px solid ${step.color}40`, color: '#ccd6f6' }}
            />
            <button onClick={addItem} className="px-4 py-2 rounded-xl" style={{ backgroundColor: step.color, color: '#04080f' }}>+</button>
          </div>
        )}

        {currentItems.length >= step.num && (
          <button onClick={next} className="w-full py-3 rounded-xl font-mono text-sm font-bold mb-4" style={{ backgroundColor: '#4fc3f7', color: '#04080f' }}>
            {stepIdx < STEPS.length - 1 ? `next: ${STEPS[stepIdx + 1].sense} →` : 'finish →'}
          </button>
        )}
      </div>
    </div>
  );
}