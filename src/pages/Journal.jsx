import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const PROMPTS = [
  { key: "what_went_well", label: "What went well today?", icon: "✦" },
  { key: "what_was_hard", label: "What was hard today?", icon: "◎" },
  { key: "gratitude", label: "What are you grateful for?", icon: "◉" },
  { key: "body_feeling", label: "How did your body feel today?", icon: "○" },
  { key: "need_more_of", label: "What do you need more of right now?", icon: "●" },
];

export default function Journal() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split("T")[0]);
  const [entries, setEntries] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ what_went_well: "", what_was_hard: "", gratitude: "", body_feeling: "", need_more_of: "", free_write: "" });
  const [saving, setSaving] = useState(false);
  const [checkIns, setCheckIns] = useState([]);

  useEffect(() => {
    loadEntries();
    loadCheckIns();
  }, []);

  useEffect(() => {
    const entry = entries[selectedDate];
    if (entry) {
      setForm({
        what_went_well: entry.what_went_well || "",
        what_was_hard: entry.what_was_hard || "",
        gratitude: entry.gratitude || "",
        body_feeling: entry.body_feeling || "",
        need_more_of: entry.need_more_of || "",
        free_write: entry.free_write || ""
      });
      setEditMode(false);
    } else {
      setForm({ what_went_well: "", what_was_hard: "", gratitude: "", body_feeling: "", need_more_of: "", free_write: "" });
      if (selectedDate === today.toISOString().split("T")[0]) setEditMode(true);
      else setEditMode(false);
    }
  }, [selectedDate, entries]);

  const loadEntries = async () => {
    const all = await base44.entities.JournalEntry.list();
    const map = {};
    all.forEach(e => { map[e.entry_date] = e; });
    setEntries(map);
  };

  const loadCheckIns = async () => {
    const all = await base44.entities.CheckInLog.list();
    setCheckIns(all);
  };

  const hasEntry = (dateStr) => !!entries[dateStr];
  const hasCheckIn = (dateStr) => checkIns.some(c => c.checkin_date === dateStr);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(v => v - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(v => v + 1); }
    else setViewMonth(m => m + 1);
  };

  const selectDate = (day) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
  };

  const handleSave = async () => {
    setSaving(true);
    const existing = entries[selectedDate];
    const data = { ...form, entry_date: selectedDate };
    if (existing) {
      await base44.entities.JournalEntry.update(existing.id, data);
    } else {
      await base44.entities.JournalEntry.create(data);
    }
    await loadEntries();
    setEditMode(false);
    setSaving(false);
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const todayStr = today.toISOString().split("T")[0];
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const selectedEntry = entries[selectedDate];
  const selectedCheckIn = checkIns.find(c => c.checkin_date === selectedDate);
  const isToday = selectedDate === todayStr;

  const formatDate = (dateStr) => {
    const [y, m, d] = dateStr.split("-");
    return `${MONTHS[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
  };

  return (
    <div className="min-h-screen p-4 font-mono" style={{ backgroundColor: '#04080f', color: '#ccd6f6' }}>
      <div className="max-w-lg mx-auto">
        <div className="pt-8 pb-4">
          <h1 className="text-xl mb-1" style={{ color: '#ccd6f6' }}>📓 journal</h1>
          <p style={{ color: '#6a85b0', fontSize: '12px' }}>tap a day to read or write</p>
        </div>

        {/* Calendar */}
        <div className="rounded-2xl p-4 mb-5" style={{ backgroundColor: '#080e1a', border: '1px solid #0d1b2e' }}>
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} style={{ color: '#4fc3f7', fontSize: '18px' }}>‹</button>
            <span style={{ color: '#ccd6f6', fontSize: '14px' }}>{MONTHS[viewMonth]} {viewYear}</span>
            <button onClick={nextMonth} style={{ color: '#4fc3f7', fontSize: '18px' }}>›</button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center" style={{ color: '#6a85b0', fontSize: '10px', padding: '2px 0' }}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />;
              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isSelected = dateStr === selectedDate;
              const isTodayDate = dateStr === todayStr;
              const hasJournal = hasEntry(dateStr);
              const hasCI = hasCheckIn(dateStr);

              return (
                <button
                  key={day}
                  onClick={() => selectDate(day)}
                  className="relative flex flex-col items-center justify-center rounded-lg py-1.5 transition-all"
                  style={{
                    backgroundColor: isSelected ? '#4fc3f7' : isTodayDate ? '#0d1b2e' : 'transparent',
                    color: isSelected ? '#04080f' : isTodayDate ? '#4fc3f7' : '#ccd6f6',
                    border: isTodayDate && !isSelected ? '1px solid #4fc3f7' : '1px solid transparent',
                    minHeight: '36px',
                    fontWeight: isTodayDate ? 'bold' : 'normal',
                    fontSize: '13px',
                  }}
                >
                  {isTodayDate && !isSelected ? (
                    <span style={{ textDecoration: 'underline', textDecorationStyle: 'dotted' }}>{day}</span>
                  ) : day}
                  {/* Dot indicators */}
                  <div className="flex gap-0.5 mt-0.5">
                    {hasJournal && (
                      <div className="w-1 h-1 rounded-full" style={{ backgroundColor: isSelected ? '#04080f' : '#4fc3f7' }} />
                    )}
                    {hasCI && (
                      <div className="w-1 h-1 rounded-full" style={{ backgroundColor: isSelected ? '#04080f60' : '#6a85b0' }} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-4 mt-3 pt-3" style={{ borderTop: '1px solid #0d1b2e' }}>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#4fc3f7' }} />
              <span style={{ color: '#6a85b0', fontSize: '10px' }}>journal entry</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#6a85b0' }} />
              <span style={{ color: '#6a85b0', fontSize: '10px' }}>check-in</span>
            </div>
          </div>
        </div>

        {/* Selected Date Content */}
        <div className="rounded-2xl p-5 mb-8" style={{ backgroundColor: '#080e1a', border: '1px solid #0d1b2e' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div style={{ color: '#ccd6f6', fontSize: '14px' }}>{formatDate(selectedDate)}</div>
              {isToday && <div style={{ color: '#4fc3f7', fontSize: '10px' }}>today</div>}
            </div>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="text-xs px-3 py-1.5 rounded-full font-mono"
                style={{ backgroundColor: '#0d1b2e', color: '#4fc3f7', border: '1px solid #4fc3f740' }}
              >
                {selectedEntry ? 'edit' : '+ write'}
              </button>
            )}
          </div>

          {/* Check-in data if available */}
          {selectedCheckIn && (
            <div className="rounded-xl p-3 mb-4" style={{ backgroundColor: '#04080f', border: '1px solid #0d1b2e' }}>
              <div style={{ color: '#6a85b0', fontSize: '10px', marginBottom: '6px' }}>check-in snapshot</div>
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedCheckIn.adjectives?.map(a => (
                  <span key={a} className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: '#0d1b2e', color: '#4fc3f7' }}>{a}</span>
                ))}
              </div>
              {selectedCheckIn.ai_affirmation && (
                <p style={{ color: '#6a85b0', fontSize: '11px', fontStyle: 'italic', lineHeight: '1.6' }}>"{selectedCheckIn.ai_affirmation}"</p>
              )}
            </div>
          )}

          {editMode ? (
            <div>
              {PROMPTS.map(prompt => (
                <div key={prompt.key} className="mb-4">
                  <label className="flex items-center gap-2 mb-2" style={{ color: '#4fc3f7', fontSize: '12px' }}>
                    <span>{prompt.icon}</span> {prompt.label}
                  </label>
                  <textarea
                    value={form[prompt.key]}
                    onChange={e => setForm(f => ({ ...f, [prompt.key]: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl text-sm font-mono outline-none resize-none"
                    style={{ backgroundColor: '#04080f', border: '1px solid #0d1b2e', color: '#ccd6f6' }}
                    placeholder="..."
                  />
                </div>
              ))}
              <div className="mb-4">
                <label className="flex items-center gap-2 mb-2" style={{ color: '#4fc3f7', fontSize: '12px' }}>
                  <span>✎</span> free write
                </label>
                <textarea
                  value={form.free_write}
                  onChange={e => setForm(f => ({ ...f, free_write: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl text-sm font-mono outline-none resize-none"
                  style={{ backgroundColor: '#04080f', border: '1px solid #0d1b2e', color: '#ccd6f6' }}
                  placeholder="anything else on your mind..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl text-sm font-mono font-bold"
                  style={{ backgroundColor: '#4fc3f7', color: '#04080f' }}
                >
                  {saving ? 'saving...' : 'save entry'}
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-3 rounded-xl text-sm font-mono"
                  style={{ backgroundColor: '#0d1b2e', color: '#6a85b0' }}
                >
                  cancel
                </button>
              </div>
            </div>
          ) : selectedEntry ? (
            <div>
              {PROMPTS.map(prompt => selectedEntry[prompt.key] && (
                <div key={prompt.key} className="mb-4">
                  <div className="flex items-center gap-2 mb-1" style={{ color: '#4fc3f7', fontSize: '11px' }}>
                    <span>{prompt.icon}</span> {prompt.label}
                  </div>
                  <p style={{ color: '#ccd6f6', fontSize: '13px', lineHeight: '1.7', paddingLeft: '16px' }}>{selectedEntry[prompt.key]}</p>
                </div>
              ))}
              {selectedEntry.free_write && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1" style={{ color: '#4fc3f7', fontSize: '11px' }}>
                    <span>✎</span> free write
                  </div>
                  <p style={{ color: '#ccd6f6', fontSize: '13px', lineHeight: '1.7', paddingLeft: '16px', whiteSpace: 'pre-wrap' }}>{selectedEntry.free_write}</p>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: '#6a85b050', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
              no entry for this day yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}