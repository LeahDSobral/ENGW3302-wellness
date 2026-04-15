import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import CheckIn from "./CheckIn";
import Journal from "./Journal";
import Profile from "./Profile";
import Tutorial from "@/components/Tutorial";

const NAV_ITEMS = [
  { id: "profile", label: "", icon: "" },
  { id: "checkin", label: "Check-in", icon: "🌱", primary: true },
  { id: "journal", label: "Journal", icon: "📓" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("checkin");
  const [showTutorial, setShowTutorial] = useState(false);
  const [progress, setProgress] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const u = await base44.auth.me();
    setUser(u);
    const records = await base44.entities.UserProgress.list();
    if (records.length === 0) {
      const created = await base44.entities.UserProgress.create({
        total_checkins: 0, streak: 0, plant_stage: 0, progress_in_stage: 0,
        unlocked_animals: [], profile_pic_animal: -1, tutorial_completed: false, completed_activities: 0
      });
      setProgress(created);
      setShowTutorial(true);
    } else {
      const p = records[0];
      setProgress(p);
      if (!p.tutorial_completed) setShowTutorial(true);
    }
  };

  const handleTutorialComplete = async () => {
    setShowTutorial(false);
    if (progress) {
      const updated = await base44.entities.UserProgress.update(progress.id, { tutorial_completed: true });
      setProgress(updated);
    }
  };

  const refreshProgress = async () => {
    const records = await base44.entities.UserProgress.list();
    if (records.length > 0) setProgress(records[0]);
  };

  return (
    <div className="min-h-screen flex flex-col font-mono" style={{ backgroundColor: '#04080f', color: '#ccd6f6' }}>
      {showTutorial && (
        <Tutorial onComplete={handleTutorialComplete} onSkip={handleTutorialComplete} />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {activeTab === "checkin" && (
          <CheckIn progress={progress} onProgressUpdate={refreshProgress} onGoJournal={() => setActiveTab("journal")} />
        )}
        {activeTab === "journal" && (
          <Journal />
        )}
        {activeTab === "profile" && (
          <Profile progress={progress} onProgressUpdate={refreshProgress} onOpenTutorial={() => setShowTutorial(true)} />
        )}
      </div>

      {/* Bottom Nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex items-end justify-around px-6 pb-4 pt-3"
        style={{ backgroundColor: '#080e1a', borderTop: '1px solid #0d1b2e' }}
      >
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-200 ${item.primary ? '-mt-5' : ''}`}
          >
            {item.primary ? (
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all duration-200"
                style={{
                  backgroundColor: activeTab === item.id ? '#4fc3f7' : '#0d1b2e',
                  border: '2px solid #4fc3f7',
                  boxShadow: activeTab === item.id ? '0 0 20px #4fc3f760' : 'none',
                  color: activeTab === item.id ? '#04080f' : '#4fc3f7',
                }}
              >
                {item.icon}
              </div>
            ) : (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all duration-200"
                style={{
                  backgroundColor: activeTab === item.id ? '#0d1b2e' : 'transparent',
                  color: activeTab === item.id ? '#4fc3f7' : '#6a85b0',
                }}
              >
                {item.icon}
              </div>
            )}
            <span
              className="text-xs"
              style={{ color: activeTab === item.id ? '#4fc3f7' : '#6a85b0', fontSize: '10px' }}
            >
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}