/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef } from "react";
import { Save, CalendarDays, Loader2, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function SchedulePage() {
  const [schedules, setSchedules] = useState([
    {
      id: "1",
      title: "Panen Utama",
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
      status: "PANEN"
    }
  ]);
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
      } catch (e) {
        console.error("Error parsing schedule JSON:", e);
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
        } catch(e) {}
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const triggerAutoSave = (dataToSave: any[]) => {
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
    const newData = [{
      id: Date.now().toString() + Math.random().toString(),
      title: "Panen Baru",
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
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
      <div className="flex flex-row items-center justify-between gap-2 md:gap-4">
        <div>
          <h1 className="text-base md:text-2xl font-black text-gray-900 leading-tight">Jadwal Panen</h1>
          <p className="text-gray-500 mt-0.5 text-[10px] md:text-sm">Kelola beberapa jadwal panen sekaligus.</p>
        </div>
        <button
          type="button"
          onClick={addSchedule}
          className="shrink-0 bg-[#10b981] hover:bg-emerald-600 text-white px-3 py-2 md:px-5 md:py-2.5 rounded-none font-bold text-[10px] md:text-sm flex items-center gap-1.5 transition-colors shadow-sm active:scale-95 z-10"
        >
          <Plus size={14} className="md:w-[18px] md:h-[18px]" />
          Tambah Panen
        </button>
      </div>

      <div className="grid gap-6">
        {schedules.length === 0 && (
          <div className="bg-white p-12 rounded-none border border-gray-100 shadow-sm text-center">
            <p className="text-gray-500 text-sm font-medium">Belum ada jadwal panen yang tersimpan.</p>
          </div>
        )}
        {schedules.map((schedule, index) => (
          <div key={schedule.id} className="bg-white p-4 md:p-6 rounded-none border border-gray-100 shadow-sm relative">
            <div className="absolute top-4 right-4 z-10">
                <button 
                  type="button"
                  onClick={() => removeSchedule(schedule.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus Jadwal Ini"
                >
                  <Trash2 size={18} />
                </button>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 pr-10"><span>{`Jadwal ${schedules.length - index}`}</span></h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Judul / Lahan</label>
                <input
                  type="text"
                  value={schedule.title}
                  onChange={(e) => updateSchedule(schedule.id, 'title', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#10b981] transition-all"
                  placeholder="Contoh: Lahan A / Panen Pertama"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={schedule.start_date}
                    onChange={(e) => updateSchedule(schedule.id, 'start_date', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#10b981] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Tanggal Selesai</label>
                  <input
                    type="date"
                    value={schedule.end_date}
                    min={schedule.start_date}
                    onChange={(e) => updateSchedule(schedule.id, 'end_date', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#10b981] transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 md:p-6 rounded-none border border-gray-100 shadow-sm mt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-50 text-[#10b981] rounded-none flex items-center justify-center">
            <CalendarDays size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Preview Kalender Panen</h2>
        </div>
        
        <div className="flex flex-wrap gap-6">
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
              <div key={`${year}-${month}`} className="bg-emerald-50/50 rounded-none p-6 border border-emerald-100/50 w-full md:w-[320px]">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-black text-[#064e3b]">
                    <span>{monthLabel}</span>
                  </span>
                  <div className="flex flex-col gap-1 items-end">
                    {activeSchedulesInMonth.map(s => {
                      const sIdx = schedules.findIndex(x => x.id === s.id);
                      return (
                        <span key={s.id} className={`text-[9px] text-white px-2 py-0.5 rounded-full font-black shadow-sm ${BG_COLORS[sIdx % BG_COLORS.length]}`}>
                          <span>{s.title}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center">
                  {["M", "S", "S", "R", "K", "J", "S"].map((d, i) => (
                    <div key={`dow-${i}`} className="text-[10px] font-black text-emerald-600/70 mb-2">
                      <span>{d}</span>
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
                      <div key={`day-${day}`} className="flex justify-center items-center relative w-8 h-8 mx-auto group">
                        {/* Split Backgrounds for overlapping schedules */}
                        {isHighlighted && (
                          <div className={`absolute inset-0 flex flex-col overflow-hidden ${isToday ? 'rounded-[10px] ring-2 ring-yellow-400 ring-offset-2' : 'rounded-[8px]'} shadow-sm`}>
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
                        
                        {/* Day Number */}
                        <span
                          className={`w-full h-full flex items-center justify-center text-[11px] font-bold transition-all relative z-10 ${
                            isHighlighted ? 'text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]' : (isToday ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-400 rounded-full font-black scale-110 shadow-sm' : 'text-gray-600 hover:bg-emerald-100 hover:text-emerald-700 rounded-full')
                          }`}
                        >
                          <span>{day}</span>
                        </span>
                        
                        {/* Tooltip for overlaps */}
                        {matchedSchedules.length > 1 && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center z-50 pointer-events-none">
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

                        {/* Melon icon only for the start date of any schedule */}
                        {matchedSchedules.some(s => {
                          const sDate = new Date(s.start_date);
                          sDate.setHours(0,0,0,0);
                          return sDate.getTime() === currentDate.getTime();
                        }) && (
                          <span className="absolute -top-1.5 -right-1.5 z-20 flex">
                            <span className="text-[10px] leading-none drop-shadow-md">🍈</span>
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className={`flex justify-end pt-8 mt-6 border-t border-gray-100 transition-opacity duration-300 ${saving ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-2 text-[#10b981] font-bold text-sm">
            <Loader2 size={16} className="animate-spin" />
            Menyimpan otomatis...
          </div>
        </div>
      </div>
    </div>
  );
}
