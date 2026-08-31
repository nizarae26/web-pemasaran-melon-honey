/* eslint-disable react-hooks/set-state-in-effect, react-hooks/purity */
"use client";

import { useState, useEffect, useRef } from "react";
import { CalendarDays, Loader2, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ScheduleItem {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  status: string;
}

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchSchedule = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("key", "jadwal_panen_multi")
      .single();
    
    if (!error && data && data.value) {
      try {
        const parsed = JSON.parse(data.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSchedules(parsed);
        }
      } catch (err) {
        console.error("Error parsing schedule JSON:", err);
      }
    } else {
      // Fallback to old schedule format if multi doesn't exist
      const { data: oldData } = await supabase.from("settings").select("*").eq("key", "jadwal_panen").single();
      if (oldData && oldData.value) {
        try {
          const parsed = JSON.parse(oldData.value);
          if (parsed.start_date) {
            setSchedules([{
              id: Date.now().toString(),
              title: "Panen",
              start_date: parsed.start_date,
              end_date: parsed.end_date || parsed.start_date,
              status: parsed.status || "PANEN"
            }]);
          }
        } catch {}
      } else {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        setSchedules([{
          id: "1",
          title: "Panen Utama",
          start_date: today.toISOString().split('T')[0],
          end_date: nextWeek.toISOString().split('T')[0],
          status: "PANEN"
        }]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const triggerAutoSave = (dataToSave: ScheduleItem[]) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      setSaving(true);
      await supabase.from("settings").upsert(
        { key: "jadwal_panen_multi", value: JSON.stringify(dataToSave) },
        { onConflict: 'key' }
      );
      setSaving(false);
    }, 1000);
  };

  const addSchedule = () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const newData: ScheduleItem[] = [{
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: "Panen Baru",
      start_date: today.toISOString().split('T')[0],
      end_date: nextWeek.toISOString().split('T')[0],
      status: "PANEN"
    }, ...schedules];
    setSchedules(newData);
    triggerAutoSave(newData);
  };

  const removeSchedule = (id: string) => {
    const newData = schedules.filter(s => s.id !== id);
    setSchedules(newData);
    triggerAutoSave(newData);
  };

  const updateSchedule = (id: string, field: string, value: string) => {
    const newData = schedules.map(s => s.id === id ? { ...s, [field]: value } : s);
    setSchedules(newData);
    triggerAutoSave(newData);
  };

  if (loading) {
    return <div className="p-10 text-center"><Loader2 className="animate-spin inline-block mr-2" /> Memuat jadwal panen...</div>;
  }

  // Calculate global min and max dates for the calendar preview
  let minDateObj = new Date();
  let maxDateObj = new Date();

  if (schedules.length > 0) {
    const startDates = schedules.map(s => new Date(s.start_date));
    const endDates = schedules.map(s => new Date(s.end_date));
    minDateObj = new Date(Math.min(...startDates.map(d => d.getTime())));
    maxDateObj = new Date(Math.max(...endDates.map(d => d.getTime())));
  }

  const monthsToDisplay = [];
  let currYear = minDateObj.getFullYear();
  let currMonth = minDateObj.getMonth();

  while (
    currYear < maxDateObj.getFullYear() || 
    (currYear === maxDateObj.getFullYear() && currMonth <= maxDateObj.getMonth())
  ) {
    monthsToDisplay.push({ year: currYear, month: currMonth });
    currMonth++;
    if (currMonth > 11) {
      currMonth = 0;
      currYear++;
    }
  }

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const GRADIENTS = [
    "from-[#10b981] to-[#059669]", // emerald
    "from-[#f59e0b] to-[#d97706]", // amber
    "from-[#3b82f6] to-[#2563eb]", // blue
    "from-[#8b5cf6] to-[#7c3aed]", // violet
    "from-[#f43f5e] to-[#e11d48]"  // rose
  ];
  
  const BG_COLORS = [
    "bg-[#10b981]",
    "bg-[#f59e0b]",
    "bg-[#3b82f6]",
    "bg-[#8b5cf6]",
    "bg-[#f43f5e]"
  ];

  return (
    <div className="space-y-6 md:space-y-8 relative">
      <div className="flex flex-row items-center justify-between gap-3 md:gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-2xl font-black text-gray-900 tracking-tight leading-tight">Jadwal Panen</h1>
            {saving && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                <Loader2 size={12} className="animate-spin" />
                Menyimpan...
              </span>
            )}
          </div>
          <p className="text-gray-500 mt-0.5 text-xs md:text-sm">Kelola beberapa rentang waktu panen melon sekaligus.</p>
        </div>
        <button
          type="button"
          onClick={addSchedule}
          className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer z-10"
        >
          <Plus size={16} />
          <span>Tambah Panen</span>
        </button>
      </div>

      {/* Daftar Jadwal Input Cards */}
      <div className="grid gap-3 sm:gap-4">
        {schedules.length === 0 && (
          <div className="bg-white p-8 sm:p-12 rounded-2xl border border-gray-100 shadow-2xs text-center">
            <p className="text-gray-400 text-xs sm:text-sm font-medium">Belum ada jadwal panen yang tersimpan. Klik &quot;Tambah Panen&quot; di atas.</p>
          </div>
        )}
        {schedules.map((schedule, index) => (
          <div key={schedule.id} className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl border border-gray-100 shadow-2xs relative transition-all">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Jadwal {schedules.length - index}
                </span>
                <span className="text-xs font-bold text-gray-700 hidden sm:inline">{schedule.title || "Tanpa Judul"}</span>
              </div>
              <button 
                type="button"
                onClick={() => removeSchedule(schedule.id)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                title="Hapus Jadwal Ini"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">Judul / Blok Lahan</label>
                <input
                  type="text"
                  value={schedule.title}
                  onChange={(e) => updateSchedule(schedule.id, 'title', e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 placeholder-gray-400 shadow-2xs"
                  placeholder="Contoh: Panen Raya / Greenhouse 1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={schedule.start_date}
                    onChange={(e) => updateSchedule(schedule.id, 'start_date', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 shadow-2xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700">Tanggal Selesai</label>
                  <input
                    type="date"
                    value={schedule.end_date}
                    min={schedule.start_date}
                    onChange={(e) => updateSchedule(schedule.id, 'end_date', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 shadow-2xs"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Kalender Panen */}
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-gray-100 shadow-2xs">
        <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100/50 shrink-0">
              <CalendarDays size={18} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 leading-tight">Preview Kalender Panen</h2>
              <p className="text-[11px] sm:text-xs text-gray-500">Tampilan kalender di sisi publik pengunjung website</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saving ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                <Loader2 size={13} className="animate-spin" />
                <span>Menyimpan...</span>
              </span>
            ) : (
              <span className="hidden sm:inline-flex text-[11px] font-bold text-gray-400">
                Tersimpan Otomatis
              </span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {monthsToDisplay.map(({ year, month }) => {
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const firstDay = new Date(year, month, 1).getDay();
            const emptySlots = Array.from({ length: firstDay });
            const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
            const monthLabel = `${monthNames[month]} ${year}`;

            const monthStart = new Date(year, month, 1);
            const monthEnd = new Date(year, month + 1, 0);
            
            const activeSchedulesInMonth = schedules.filter(s => {
              const sStart = new Date(s.start_date);
              sStart.setHours(0,0,0,0);
              const sEnd = new Date(s.end_date);
              sEnd.setHours(0,0,0,0);
              return sStart <= monthEnd && sEnd >= monthStart;
            });

            return (
              <div key={`${year}-${month}`} className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3.5">
                    <span className="text-xs sm:text-sm font-black text-emerald-950">
                      {monthLabel}
                    </span>
                    <div className="flex flex-col gap-1 items-end">
                      {activeSchedulesInMonth.map(s => {
                        const sIdx = schedules.findIndex(x => x.id === s.id);
                        return (
                          <span key={s.id} className={`text-[8.5px] sm:text-[9px] text-white px-2 py-0.5 rounded-full font-bold shadow-2xs ${BG_COLORS[sIdx % BG_COLORS.length]}`}>
                            {s.title}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-y-2.5 gap-x-1 text-center">
                    {["M", "S", "S", "R", "K", "J", "S"].map((d, i) => (
                      <div key={`dow-${i}`} className="text-[10px] font-black text-emerald-700/60 mb-1">
                        {d}
                      </div>
                    ))}
                    {emptySlots.map((_, i) => (
                      <div key={`empty-${i}`}></div>
                    ))}
                    {days.map((day) => {
                      const currentDate = new Date(year, month, day);
                      const today = new Date();
                      const isToday = currentDate.getDate() === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
                      
                      const matchedSchedules = schedules.filter(s => {
                        const sDate = new Date(s.start_date);
                        const eDate = new Date(s.end_date);
                        sDate.setHours(0,0,0,0);
                        eDate.setHours(0,0,0,0);
                        currentDate.setHours(0,0,0,0);
                        return currentDate >= sDate && currentDate <= eDate;
                      });
                      
                      const isHighlighted = matchedSchedules.length > 0;
                      
                      return (
                        <div key={`day-${day}`} className="flex justify-center items-center relative w-7 h-7 sm:w-8 sm:h-8 mx-auto group">
                          {/* Split Backgrounds for overlapping schedules */}
                          {isHighlighted && (
                            <div className={`absolute inset-0 flex flex-col overflow-hidden ${isToday ? 'rounded-xl ring-2 ring-amber-400 ring-offset-1' : 'rounded-xl'} shadow-xs`}>
                              {matchedSchedules.map((s) => {
                                const sIdx = schedules.findIndex(x => x.id === s.id);
                                return (
                                  <div 
                                    key={s.id} 
                                    className={`flex-1 bg-gradient-to-r ${GRADIENTS[sIdx % GRADIENTS.length]}`}
                                  />
                                );
                              })}
                            </div>
                          )}
                          
                          {/* Day Number & Centered Melon Icon */}
                          <span
                            className={`w-full h-full flex flex-col items-center justify-center text-[10px] sm:text-[11px] font-bold transition-all relative z-10 ${
                              isHighlighted 
                                ? 'text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]' 
                                : (isToday ? 'bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-black shadow-2xs' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl')
                            }`}
                          >
                            <span>{day}</span>
                            {isHighlighted && (
                              <span className="text-[7px] leading-none -mt-0.5">🍈</span>
                            )}
                          </span>
                          
                          {/* Tooltip for overlaps */}
                          {matchedSchedules.length > 1 && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center z-50 pointer-events-none">
                              <div className="bg-gray-900 text-white text-[9px] px-2 py-1.5 rounded-lg shadow-xl w-max max-w-[120px] text-left space-y-1">
                                {matchedSchedules.map((s) => {
                                  const sIdx = schedules.findIndex(x => x.id === s.id);
                                  return (
                                    <div key={s.id} className="flex items-center gap-1.5">
                                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${BG_COLORS[sIdx % BG_COLORS.length]}`}></span>
                                      <span className="truncate">{s.title}</span>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900"></div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
