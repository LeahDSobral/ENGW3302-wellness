import { useState } from "react";
import { base44 } from "@/api/base44Client";

// PLANT STAGE IMAGES:
// Place your plant PNG files at: public/plants/stage_0.png through public/plants/stage_9.png
// Stage names: Seed, Seedling, Sprout, Baby Plant, Sapling, Young Plant, Budding, Blooming, Flourishing, Full Bloom

// ANIMAL COLLECTION IMAGES:
// Place your animal PNG files at: public/animals/animal_0.png through public/animals/animal_7.png
// Suggested animals: cat, bunny, duck, frog, hedgehog, axolotl, capybara, penguin
// They appear unlocked every 10 check-ins (10, 20, 30... up to 80 check-ins)

const PLANT_STAGES = [
  { name: "Seed", emoji: "🫘" },
  { name: "Seedling", emoji: "🌱" },
  { name: "Sprout", emoji: "🌿" },
  { name: "Baby Plant", emoji: "🪴" },
  { name: "Sapling", emoji: "🌲" },
  { name: "Young Plant", emoji: "🌳" },
  { name: "Budding", emoji: "🌸" },
  { name: "Blooming", emoji: "🌺" },
  { name: "Flourishing", emoji: "💐" },
  { name: "Full Bloom", emoji: "🌻" },
];

const ANIMAL_SLOTS = [
  { name: "cat", unlockAt: 10 },
  { name: "bunny", unlockAt: 20 },
  { name: "duck", unlockAt: 30 },
  { name: "frog", unlockAt: 40 },
  { name: "hedgehog", unlockAt: 50 },
  { name: "axolotl", unlockAt: 60 },
  { name: "capybara", unlockAt: 70 },
  { name: "penguin", unlockAt: 80 },
];

const STREAK_REFRAMES = [
  "Research shows self-compassion after a setback improves long-term consistency more than guilt (Worthen & Cash, 2023).",
  "A missed day is data, not failure. Your nervous system still remembers every breath you've taken (Williamson, 1994).",
  "Studies show that resuming a habit immediately after breaking it is more effective than waiting for a 'fresh start' (Bui et al., 2021).",
  "Progress is not linear. Self-care that happens 60% of the time still meaningfully reduces stress (Egger et al., 2023).",
];

export default function Profile({ progress, onProgressUpdate, onOpenTutorial }) {
  const [showAnimalPicker, setShowAnimalPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!progress) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono" style={{ backgroundColor: '#04080f' }}>
        <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: '#4fc3f730', borderTopColor: '#4fc3f7' }} />
      </div>
    );
  }

  const totalCheckins = progress.total_checkins || 0;
  const streak = progress.streak || 0;
  const stage = Math.min(progress.plant_stage || 0, 9);
  const progressInStage = progress.progress_in_stage || 0;
  const unlockedAnimals = progress.unlocked_animals || [];
  const profilePic = progress.profile_pic_animal;
  const streakBroken = totalCheckins > 0 && streak === 0;
  const reframeMsg = STREAK_REFRAMES[Math.floor(Math.random() * STREAK_REFRAMES.length)];

  const handleSetProfilePic = async (animalIndex) => {
    setSaving(true);
    await base44.entities.UserProgress.update(progress.id, { profile_pic_animal: animalIndex });
    onProgressUpdate && onProgressUpdate();
    setShowAnimalPicker(false);
    setSaving(false);
  };

  const stageData = PLANT_STAGES[stage];
  const nextStage = PLANT_STAGES[Math.min(stage + 1, 9)];

  return (
    <div className="min-h-screen p-4 font-mono" style={{ backgroundColor: '#04080f', color: '#ccd6f6' }}>
      <div className="max-w-lg mx-auto">
        <div className="pt-8 pb-4">
          <h1 className="text-xl mb-1" style={{ color: '#ccd6f6' }}>👤 profile</h1>
        </div>

        {/* Profile pic + stats */}
        <div className="rounded-2xl p-5 mb-4 flex items-center gap-5" style={{ backgroundColor: '#080e1a', border: '1px solid #0d1b2e' }}>
          <div className="relative">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{ backgroundColor: '#0d1b2e', border: '2px solid #4fc3f730' }}
            >
              {/* Profile pic: if animal selected, show public/animals/animal_X.png */}
              {profilePic >= 0 && unlockedAnimals.includes(profilePic) ? (
                <img
                  src={`/animals/animal_${profilePic}.png`}
                  alt={ANIMAL_SLOTS[profilePic]?.name}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <span style={{ display: profilePic >= 0 && unlockedAnimals.includes(profilePic) ? 'none' : 'block' }}>🌱</span>
            </div>
            {unlockedAnimals.length > 0 && (
              <button
                onClick={() => setShowAnimalPicker(true)}
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                style={{ backgroundColor: '#4fc3f7', color: '#04080f' }}
              >
                ✎
              </button>
            )}
          </div>
          <div className="flex-1">
            <div className="flex gap-6">
              <div>
                <div className="text-2xl font-bold" style={{ color: '#4fc3f7' }}>{totalCheckins}</div>
                <div style={{ color: '#6a85b0', fontSize: '10px' }}>check-ins</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: '#4fc3f7' }}>{streak}</div>
                <div style={{ color: '#6a85b0', fontSize: '10px' }}>day streak</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: '#4fc3f7' }}>{unlockedAnimals.length}</div>
                <div style={{ color: '#6a85b0', fontSize: '10px' }}>animals</div>
              </div>
            </div>
          </div>
        </div>

        {/* Streak reframe if broken */}
        {streakBroken && (
          <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: '#080e1a', border: '1px solid #4fc3f730' }}>
            <p style={{ color: '#6a85b0', fontSize: '12px', lineHeight: '1.6', fontStyle: 'italic' }}>
              💙 {reframeMsg}
            </p>
          </div>
        )}

        {/* Plant Growth */}
        <div className="rounded-2xl p-5 mb-4" style={{ backgroundColor: '#080e1a', border: '1px solid #0d1b2e' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div style={{ color: '#ccd6f6', fontSize: '14px' }}>{stageData.name}</div>
              <div style={{ color: '#6a85b0', fontSize: '11px' }}>stage {stage + 1} of 10</div>
            </div>
            <div style={{ fontSize: '10px', color: '#6a85b0' }}>next: {nextStage?.name}</div>
          </div>

          {/* Plant visual */}
          <div className="flex justify-center mb-5">
            <div
              className="w-32 h-32 rounded-2xl flex items-center justify-center relative overflow-hidden"
              style={{ backgroundColor: '#04080f', border: '1px solid #0d1b2e' }}
            >
              {/* Plant stage image placeholder */}
              {/* DROP YOUR PNG: public/plants/stage_{stage}.png */}
              <img
                src={`/plants/stage_${stage}.png`}
                alt={stageData.name}
                className="w-full h-full object-contain"
                onError={e => { e.target.style.display = 'none'; }}
              />
              {/* Fallback emoji */}
              <span
                className="text-5xl animate-float absolute"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {stageData.emoji}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between mb-2">
              <span style={{ color: '#6a85b0', fontSize: '11px' }}>{stageData.name}</span>
              <span style={{ color: '#4fc3f7', fontSize: '11px' }}>{progressInStage}%</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#0d1b2e' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progressInStage}%`,
                  background: 'linear-gradient(90deg, #4fc3f7, #81d4fa)',
                  boxShadow: '0 0 8px #4fc3f750'
                }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span style={{ color: '#6a85b050', fontSize: '9px' }}>{stageData.name}</span>
              <span style={{ color: '#6a85b050', fontSize: '9px' }}>{nextStage?.name}</span>
            </div>
          </div>

          {/* Stage milestones */}
          <div className="grid grid-cols-10 gap-1 mt-4">
            {PLANT_STAGES.map((s, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1"
                title={s.name}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{
                    backgroundColor: i <= stage ? '#4fc3f720' : '#0d1b2e',
                    border: `1px solid ${i <= stage ? '#4fc3f7' : '#0d1b2e'}`,
                    opacity: i <= stage ? 1 : 0.4
                  }}
                >
                  {i <= stage ? '✓' : '·'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Animal Collection */}
        <div className="rounded-2xl p-5 mb-4" style={{ backgroundColor: '#080e1a', border: '1px solid #0d1b2e' }}>
          <div className="flex items-center justify-between mb-4">
            <div style={{ color: '#ccd6f6', fontSize: '14px' }}>animal friends</div>
            <div style={{ color: '#6a85b0', fontSize: '11px' }}>{unlockedAnimals.length}/{ANIMAL_SLOTS.length} unlocked</div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {ANIMAL_SLOTS.map((animal, i) => {
              const isUnlocked = unlockedAnimals.includes(i);
              return (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1 rounded-xl p-2"
                  style={{
                    backgroundColor: '#04080f',
                    border: `1px solid ${isUnlocked ? '#4fc3f730' : '#0d1b2e'}`,
                    opacity: isUnlocked ? 1 : 0.5
                  }}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#0d1b2e' }}>
                    {isUnlocked ? (
                      <>
                        {/* DROP YOUR PNG: public/animals/animal_{i}.png */}
                        <img
                          src={`/animals/animal_${i}.png`}
                          alt={animal.name}
                          className="w-full h-full object-cover"
                          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                        />
                        <span style={{ display: 'none', fontSize: '24px' }}>🐾</span>
                      </>
                    ) : (
                      <span style={{ color: '#6a85b050', fontSize: '20px' }}>?</span>
                    )}
                  </div>
                  <span style={{ color: isUnlocked ? '#ccd6f6' : '#6a85b050', fontSize: '9px', textAlign: 'center' }}>
                    {isUnlocked ? animal.name : `${animal.unlockAt} check-ins`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tutorial button */}
        <button
          onClick={onOpenTutorial}
          className="w-full py-3 rounded-xl text-sm font-mono mb-3"
          style={{ backgroundColor: '#080e1a', border: '1px solid #0d1b2e', color: '#6a85b0' }}
        >
          reopen tutorial
        </button>

        {/* Research note */}
        <div className="rounded-xl p-4 mb-8" style={{ backgroundColor: '#080e1a', border: '1px solid #0d1b2e' }}>
          <p style={{ color: '#6a85b050', fontSize: '10px', lineHeight: '1.6' }}>
            Grounded in: Williamson (1994) · Egger et al. (2023) · Worthen & Cash (2023) · Bui et al. (2021) · Rathi & Kumar (2022)
          </p>
        </div>

        {/* Animal picker modal */}
        {showAnimalPicker && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-4" style={{ backgroundColor: '#04080f90' }}>
            <div className="w-full max-w-lg rounded-2xl p-5" style={{ backgroundColor: '#080e1a', border: '1px solid #0d1b2e' }}>
              <div className="flex items-center justify-between mb-4">
                <span style={{ color: '#ccd6f6', fontSize: '14px' }}>choose profile picture</span>
                <button onClick={() => setShowAnimalPicker(false)} style={{ color: '#6a85b0' }}>✕</button>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {/* Default option */}
                <button
                  onClick={() => handleSetProfilePic(-1)}
                  className="flex flex-col items-center gap-1 rounded-xl p-2"
                  style={{ backgroundColor: profilePic === -1 ? '#4fc3f720' : '#04080f', border: `1px solid ${profilePic === -1 ? '#4fc3f7' : '#0d1b2e'}` }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: '#0d1b2e' }}>🌱</div>
                  <span style={{ color: '#ccd6f6', fontSize: '9px' }}>default</span>
                </button>
                {unlockedAnimals.map(idx => (
                  <button
                    key={idx}
                    onClick={() => handleSetProfilePic(idx)}
                    className="flex flex-col items-center gap-1 rounded-xl p-2"
                    style={{ backgroundColor: profilePic === idx ? '#4fc3f720' : '#04080f', border: `1px solid ${profilePic === idx ? '#4fc3f7' : '#0d1b2e'}` }}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#0d1b2e' }}>
                      <img src={`/animals/animal_${idx}.png`} alt={ANIMAL_SLOTS[idx]?.name} className="w-full h-full object-cover"
                        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                      <span style={{ display: 'none', fontSize: '20px' }}>🐾</span>
                    </div>
                    <span style={{ color: '#ccd6f6', fontSize: '9px' }}>{ANIMAL_SLOTS[idx]?.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}