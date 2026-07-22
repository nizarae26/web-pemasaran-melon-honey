"use client";

import { useState, useEffect } from "react";
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

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("settings")
      .upsert(
        { key: "jadwal_panen_multi", value: JSON.stringify(schedules) },
        { onConflict: 'key' }
      );

    if (error) {
      toast.error("Gagal menyimpan jadwal panen: " + error.message);
    } else {
      toast.success("Jadwal panen berhasil diperbarui!");
    }
    setSaving(false);
  };

  const addSchedule = () => {
    setSchedules([...schedules, {
      id: Date.now().toString(),
      title: "Panen Baru",
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
      status: "PANEN"
    }]);
  };

  const removeSchedule = (id: string) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const updateSchedule = (id: string, field: string, value: string) => {
    setSchedules(schedules.map(s => s.id === id ? { ...s, [field]: value } : s));
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
    <div className="max-w-4xl space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-gray-800 tracking-tight">
            Jadwal <span className="text-[#10b981]">Panen</span>
          </h1>
          <p className="text-gray-500 mt-1 text-xs md:text-sm">
            Kelola beberapa jadwal panen sekaligus.
          </p>
        </div>
        <button
          onClick={addSchedule}
          className="w-full md:w-auto flex justify-center items-center gap-2 px-4 py-2.5 bg-emerald-100 text-emerald-700 font-bold rounded-xl hover:bg-emerald-200 transition-colors text-sm"
        >
          <Plus size={16} /> Tambah Lahan/Panen Baru
        </button>
      </div>

      <div className="grid gap-6">
        {schedules.map((schedule, index) => (
          <div key={schedule.id} className="bg-white p-4 md:p-6 rounded-[24px] border border-gray-100 shadow-sm relative">
            {schedules.length > 1 && (
              <button 
                onClick={() => removeSchedule(schedule.id)}
                className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors z-10"
                title="Hapus Jadwal Ini"
              >
                <Trash2 size={18} />
              </button>
            )}
            <h3 className="text-lg font-bold text-gray-800 mb-4 pr-10">Jadwal #{index + 1}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Status Label</label>
                <input
                  type="text"
                  value={schedule.status}
                  onChange={(e) => updateSchedule(schedule.id, 'status', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#10b981] transition-all"
                  placeholder="Contoh: PANEN"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 md:p-6 rounded-[24px] border border-gray-100 shadow-sm mt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-50 text-[#10b981] rounded-xl flex items-center justify-center">
            <CalendarDays size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Preview Kalender Gabungan</h2>
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
              <div key={`${year}-${month}`} className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100/50 w-full md:w-[320px]">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-black text-[#064e3b]">
                    {monthLabel}
                  </span>
                  <div className="flex flex-col gap-1 items-end">
                    {activeSchedulesInMonth.map(s => {
                      const sIdx = schedules.findIndex(x => x.id === s.id);
                      return (
                        <span key={s.id} className={`text-[9px] text-white px-2 py-0.5 rounded-full font-black shadow-sm ${BG_COLORS[sIdx % BG_COLORS.length]}`}>
                          {s.title}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center">
                  {["M", "S", "S", "R", "K", "J", "S"].map((d, i) => (
                    <div key={i} className="text-[10px] font-black text-emerald-600/70 mb-2">
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
                    const firstMatchedIdx = isHighlighted ? schedules.findIndex(x => x.id === matchedSchedules[0].id) : 0;
                    const shadowColor = isHighlighted ? "shadow-md" : "";

                    return (
                      <div key={day} className="flex justify-center items-center relative">
                        <span
                          className={`w-8 h-8 flex items-center justify-center text-[11px] font-bold transition-all relative z-10 ${
                            isHighlighted && isToday
                              ? `bg-gradient-to-br ${GRADIENTS[firstMatchedIdx % GRADIENTS.length]} text-white rounded-xl scale-105 ${shadowColor} ring-2 ring-yellow-400 ring-offset-2`
                              : isHighlighted
                              ? `bg-gradient-to-br ${GRADIENTS[firstMatchedIdx % GRADIENTS.length]} text-white rounded-xl scale-105 ${shadowColor}`
                              : isToday
                              ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-400 rounded-full font-black scale-110 shadow-sm"
                              : "text-gray-600 hover:bg-emerald-100 hover:text-emerald-700 rounded-full"
                          }`}
                        >
                          {day}
                          {isHighlighted && (
                            <span className="absolute -top-1.5 -right-1.5 text-[10px] leading-none drop-shadow-md z-20" title={matchedSchedules.map(s => s.title).join(", ")}>🍈</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-8 mt-6 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full md:w-auto justify-center flex items-center gap-2 px-8 py-3.5 bg-[#10b981] text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50 shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{saving ? "Menyimpan..." : "Simpan Semua Jadwal"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
