import { useState } from "react";
import { base44 } from "@/api/base44Client";
import BreathingExercise from "@/components/BreathingExercise";
import GroundingExercise from "@/components/GroundingExercise";
import BodyScanExercise from "@/components/BodyScanExercise";
import PMRExercise from "@/components/PMRExercise";
import EMDRExercise from "@/components/EMDRExercise";
import VisualizationExercise from "@/components/VisualizationExercise";
import YogaExercise from "@/components/YogaExercise";
import SensoryResetExercise from "@/components/SensoryResetExercise";

const ADJECTIVE_CATEGORIES = [
  {
    name: "Physical Tension & Activation",
    color: "#4fc3f7",
    emoji: "⚡",
    words: ["tense", "panicked", "restless", "jittery", "on edge", "wired", "shaky", "tight-chested", "heart racing", "can't sit still", "clenching", "shallow breathing"]
  },
  {
    name: "Mental Loops & Rumination",
    color: "#81d4fa",
    emoji: "🌀",
    words: ["overwhelmed", "anxious", "overthinking", "spiraling", "scattered", "unfocused", "obsessing", "can't stop thinking", "racing thoughts", "second-guessing", "worried", "hypervigilant"]
  },
  {
    name: "Confusion & Helplessness",
    color: "#6a85b0",
    emoji: "🌫",
    words: ["hollow", "lost", "powerless", "confused", "foggy", "disconnected", "uncertain", "directionless", "stuck", "blank", "numb to options", "drifting"]
  },
  {
    name: "Withdrawal & Shutdown",
    color: "#4a6fa5",
    emoji: "🌑",
    words: ["numb", "burnt out", "shut down", "withdrawn", "exhausted", "flat", "detached", "checked out", "avoidant", "heavy", "depleted", "invisible"]
  }
];

const EXERCISE_COMPONENTS = {
  breathing: BreathingExercise,
  grounding: GroundingExercise,
  bodyscan: BodyScanExercise,
  pmr: PMRExercise,
  emdr: EMDRExercise,
  visualization: VisualizationExercise,
  yoga: YogaExercise,
  sensory: SensoryResetExercise,
};

export default function CheckIn({ progress, onProgressUpdate }) {
  const [step, setStep] = useState("select"); // select | results | exercise
  const [selectedWords, setSelectedWords] = useState([]);
  const [customWord, setCustomWord] = useState("");
  const [stressLevel, setStressLevel] = useState(3);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeExercise, setActiveExercise] = useState(null);
  const [activityDone, setActivityDone] = useState({});

  const toggleWord = (word) => {
    setSelectedWords(prev =>
      prev.includes(word) ? prev.filter(w => w !== word) : [...prev, word]
    );
  };

  const addCustomWord = () => {
    const w = customWord.trim().toLowerCase();
    if (w && !selectedWords.includes(w)) {
      setSelectedWords(prev => [...prev, w]);
      setCustomWord("");
    }
  };

  const handleSubmit = async () => {
    if (selectedWords.length === 0) return;
    setLoading(true);
    try {
      const prompt = `You are an evidence-based student wellness assistant grounded in research by Williamson (1994), Egger et al. (2023), Worthen & Cash (2023), Bui et al. (2021), and Rathi & Kumar (2022).

A student is feeling: ${selectedWords.join(", ")}. Their stress intensity is ${stressLevel}/5.

Based on their specific affective profile, provide:
1. A warm, personalized affirmation (2-3 sentences) addressing their exact emotional state
2. Exactly 4 tailored wellness recommendations drawn from: breathing exercises, gentle yoga/stretching, short walk, nourishing snack or water, positive mental exercises (thinking about favorite things, happy memories, gratitude), sensory grounding (5-4-3-2-1 technique or similar), music suggestions, brief journaling. Include EMDR-style bilateral stimulation options where appropriate (tapping, eye movements, bilateral music).
3. ONE suggested guided exercise from this list that best matches their current state: "breathing" (4-4-6 box breathing for tension/panic), "grounding" (5-4-3-2-1 sensory grounding for anxiety/overwhelm), "bodyscan" (body awareness for numbness/shutdown), "pmr" (progressive muscle relaxation for tension), "emdr" (bilateral tapping for rumination/trauma responses), "visualization" (happy place for helplessness/withdrawal), "yoga" (gentle stretches for physical tension), "sensory" (cold water/sensory reset for shutdown/numbness)

Return JSON with exactly: { "affirmation": "...", "recommendations": ["...", "...", "...", "..."], "exercise": "breathing|grounding|bodyscan|pmr|emdr|visualization|yoga|sensory" }`;

      const res = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            affirmation: { type: "string" },
            recommendations: { type: "array", items: { type: "string" } },
            exercise: { type: "string" }
          }
        }
      });

      setResults(res);

      // Save check-in log
      const today = new Date().toISOString().split("T")[0];
      await base44.entities.CheckInLog.create({
        checkin_date: today,
        adjectives: selectedWords,
        stress_level: stressLevel,
        ai_affirmation: res.affirmation,
        ai_recommendations: res.recommendations,
        suggested_exercise: res.exercise,
        activity_completed: false
      });

      // Update progress
      const progressRecords = await base44.entities.UserProgress.list();
      const prog = progressRecords[0];
      if (prog) {
        const lastDate = prog.last_checkin_date;
        const todayStr = today;
        const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        let newStreak = prog.streak || 0;
        if (lastDate !== todayStr) {
          if (lastDate === yesterdayStr) {
            newStreak = newStreak + 1;
          } else if (!lastDate) {
            newStreak = 1;
          } else {
            newStreak = 1;
          }
        }

        const newTotal = (prog.total_checkins || 0) + 1;
        const newUnlocked = [...(prog.unlocked_animals || [])];
        for (let i = 0; i < 8; i++) {
          if (newTotal >= (i + 1) * 10 && !newUnlocked.includes(i)) {
            newUnlocked.push(i);
          }
        }

        // Plant stage progression — mixed pacing
        const stageThresholds = [3, 6, 10, 15, 22, 30, 40, 52, 66, 999];
        let newStage = 0;
        for (let i = 0; i < stageThresholds.length; i++) {
          if (newTotal >= stageThresholds[i]) newStage = i + 1;
          else break;
        }
        if (newStage > 9) newStage = 9;
        const prevThreshold = newStage > 0 ? stageThresholds[newStage - 1] : 0;
        const nextThreshold = stageThresholds[newStage];
        const progressInStage = nextThreshold === 999 ? 100 :
          Math.round(((newTotal - prevThreshold) / (nextThreshold - prevThreshold)) * 100);

        await base44.entities.UserProgress.update(prog.id, {
          total_checkins: newTotal,
          streak: newStreak,
          last_checkin_date: todayStr,
          plant_stage: newStage,
          progress_in_stage: progressInStage,
          unlocked_animals: newUnlocked
        });
        onProgressUpdate && onProgressUpdate();
      }

      setStep("results");
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleActivityComplete = async (activityKey) => {
    setActivityDone(prev => ({ ...prev, [activityKey]: true }));
    const progressRecords = await base44.entities.UserProgress.list();
    const prog = progressRecords[0];
    if (prog) {
      await base44.entities.UserProgress.update(prog.id, {
        completed_activities: (prog.completed_activities || 0) + 1
      });
      onProgressUpdate && onProgressUpdate();
    }
  };

  const startExercise = (type) => {
    setActiveExercise(type);
    setStep("exercise");
  };

  const ExerciseComponent = activeExercise ? EXERCISE_COMPONENTS[activeExercise] : null;

  if (step === "exercise" && ExerciseComponent) {
    return (
      <div className="min-h-screen font-mono" style={{ backgroundColor: '#04080f' }}>
        <div className="flex items-center gap-3 p-4 sticky top-0 z-10" style={{ backgroundColor: '#04080f', borderBottom: '1px solid #0d1b2e' }}>
          <button onClick={() => setStep("results")} style={{ color: '#4fc3f7' }} className="text-sm">← back</button>
          <span style={{ color: '#6a85b0', fontSize: '13px' }}>guided exercise</span>
        </div>
        <ExerciseComponent onComplete={() => { handleActivityComplete(activeExercise); setStep("results"); }} />
      </div>
    );
  }

  if (step === "results" && results) {
    return (
      <div className="min-h-screen p-4 font-mono" style={{ backgroundColor: '#04080f', color: '#ccd6f6' }}>
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => { setStep("select"); setResults(null); setSelectedWords([]); setActivityDone({}); }} style={{ color: '#4fc3f7' }} className="text-sm">← new check-in</button>
          </div>

          {/* Affirmation */}
          <div className="rounded-2xl p-5 mb-4 animate-fade-in-up" style={{ backgroundColor: '#080e1a', border: '1px solid #0d1b2e' }}>
            <div className="text-xs mb-2" style={{ color: '#4fc3f7' }}>✦ your affirmation</div>
            <p className="leading-relaxed" style={{ color: '#ccd6f6', fontSize: '15px' }}>{results.affirmation}</p>
          </div>

          {/* Mood tags recap */}
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedWords.map(w => (
              <span key={w} className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: '#0d1b2e', color: '#4fc3f7', border: '1px solid #4fc3f730' }}>{w}</span>
            ))}
            <span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: '#0d1b2e', color: '#6a85b0' }}>stress {stressLevel}/5</span>
          </div>

          {/* Recommendations */}
          <div className="mb-4">
            <div className="text-xs mb-3" style={{ color: '#6a85b0' }}>— tailored for you —</div>
            {results.recommendations?.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl p-4 mb-3" style={{ backgroundColor: '#080e1a', border: '1px solid #0d1b2e' }}>
                <span style={{ color: '#4fc3f7', minWidth: '20px', fontSize: '14px' }}>{['◎', '◉', '○', '●'][i]}</span>
                <div>
                  <p style={{ color: '#ccd6f6', fontSize: '14px', lineHeight: '1.6' }}>{rec}</p>
                  <button
                    onClick={() => handleActivityComplete(`rec_${i}`)}
                    className="mt-2 text-xs px-3 py-1 rounded-full transition-all"
                    style={{
                      backgroundColor: activityDone[`rec_${i}`] ? '#4fc3f720' : 'transparent',
                      color: activityDone[`rec_${i}`] ? '#4fc3f7' : '#6a85b0',
                      border: `1px solid ${activityDone[`rec_${i}`] ? '#4fc3f7' : '#0d1b2e'}`
                    }}
                  >
                    {activityDone[`rec_${i}`] ? '✓ done' : 'mark done'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Guided Exercise */}
          {results.exercise && (
            <div className="rounded-2xl p-5 mb-4" style={{ backgroundColor: '#080e1a', border: '1px solid #4fc3f730' }}>
              <div className="text-xs mb-2" style={{ color: '#4fc3f7' }}>✦ guided exercise for you</div>
              <p className="mb-3 text-sm" style={{ color: '#6a85b0' }}>
                {{
                  breathing: "4-4-6 breathing cycle — calm your nervous system",
                  grounding: "5-4-3-2-1 sensory grounding — anchor to the present",
                  bodyscan: "body scan — reconnect with yourself",
                  pmr: "progressive muscle relaxation — release physical tension",
                  emdr: "bilateral tapping — process and release",
                  visualization: "happy place visualization — find inner calm",
                  yoga: "gentle stretch sequence — move with care",
                  sensory: "sensory reset — wake up your senses",
                }[results.exercise]}
              </p>
              <button
                onClick={() => startExercise(results.exercise)}
                className="w-full py-3 rounded-xl font-mono text-sm transition-all"
                style={{ backgroundColor: '#4fc3f7', color: '#04080f', fontWeight: 'bold' }}
              >
                begin exercise →
              </button>
            </div>
          )}

          {/* Disclaimer */}
          <div className="rounded-xl p-4 mb-8" style={{ backgroundColor: '#080e1a', border: '1px solid #0d1b2e' }}>
            <p style={{ color: '#6a85b0', fontSize: '11px', lineHeight: '1.7' }}>
              ⚠ This app offers evidence-informed support strategies but is not a substitute for professional mental health care. The recommendations here are palliative and supportive in nature (Williamson, 1994; Egger et al., 2023). If you are experiencing persistent distress, please reach out to a counselor or mental health professional. Research suggests consistent self-care practices can meaningfully reduce stress (Bui et al., 2021; Worthen & Cash, 2023), and self-compassion after setbacks improves long-term wellbeing (Rathi & Kumar, 2022).
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 font-mono" style={{ backgroundColor: '#04080f', color: '#ccd6f6' }}>
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="pt-8 pb-6">
          <h1 className="text-2xl mb-1" style={{ color: '#ccd6f6' }}>Hey there 🌱</h1>
          <p style={{ color: '#6a85b0', fontSize: '13px' }}>how are you feeling right now?</p>
        </div>

        {/* Adjective Categories */}
        {ADJECTIVE_CATEGORIES.map((cat) => (
          <div key={cat.name} className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <span>{cat.emoji}</span>
              <span style={{ color: '#6a85b0', fontSize: '11px', letterSpacing: '0.08em' }}>{cat.name.toUpperCase()}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.words.map(word => (
                <button
                  key={word}
                  onClick={() => toggleWord(word)}
                  className="px-3 py-1.5 rounded-full text-xs transition-all duration-150 font-mono"
                  style={{
                    backgroundColor: selectedWords.includes(word) ? cat.color + '25' : '#080e1a',
                    color: selectedWords.includes(word) ? cat.color : '#6a85b0',
                    border: `1px solid ${selectedWords.includes(word) ? cat.color : '#0d1b2e'}`,
                    boxShadow: selectedWords.includes(word) ? `0 0 8px ${cat.color}30` : 'none'
                  }}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Custom word */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              value={customWord}
              onChange={e => setCustomWord(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustomWord()}
              placeholder="add your own word..."
              className="flex-1 px-3 py-2 rounded-xl text-sm font-mono outline-none"
              style={{ backgroundColor: '#080e1a', border: '1px solid #0d1b2e', color: '#ccd6f6' }}
            />
            <button onClick={addCustomWord} className="px-4 py-2 rounded-xl text-sm font-mono" style={{ backgroundColor: '#0d1b2e', color: '#4fc3f7' }}>+</button>
          </div>
        </div>

        {/* Selected words preview */}
        {selectedWords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {selectedWords.map(w => (
              <button key={w} onClick={() => toggleWord(w)} className="px-2 py-1 rounded-full text-xs font-mono" style={{ backgroundColor: '#4fc3f720', color: '#4fc3f7', border: '1px solid #4fc3f740' }}>
                {w} ×
              </button>
            ))}
          </div>
        )}

        {/* Stress slider */}
        <div className="rounded-2xl p-5 mb-6" style={{ backgroundColor: '#080e1a', border: '1px solid #0d1b2e' }}>
          <div className="flex justify-between items-center mb-4">
            <span style={{ color: '#6a85b0', fontSize: '12px' }}>stress intensity</span>
            <span className="text-xl" style={{ color: '#4fc3f7' }}>{stressLevel}/5</span>
          </div>
          <input
            type="range" min="1" max="5" value={stressLevel}
            onChange={e => setStressLevel(Number(e.target.value))}
            className="w-full h-1 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: '#4fc3f7', backgroundColor: '#0d1b2e' }}
          />
          <div className="flex justify-between mt-2">
            {["very low", "low", "moderate", "high", "very high"].map((l, i) => (
              <span key={l} style={{ color: stressLevel === i + 1 ? '#4fc3f7' : '#6a85b050', fontSize: '9px' }}>{l}</span>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={selectedWords.length === 0 || loading}
          className="w-full py-4 rounded-2xl text-base font-mono font-bold transition-all duration-200 mb-8"
          style={{
            backgroundColor: selectedWords.length > 0 && !loading ? '#4fc3f7' : '#0d1b2e',
            color: selectedWords.length > 0 && !loading ? '#04080f' : '#6a85b0',
            boxShadow: selectedWords.length > 0 ? '0 0 20px #4fc3f730' : 'none'
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#6a85b0', borderTopColor: 'transparent' }}></span>
              generating your plan...
            </span>
          ) : "get my wellness plan →"}
        </button>
      </div>
    </div>
  );
}