"use client";

import { useState, useEffect } from "react";
import { Save, CalendarDays, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function SchedulePage() {
  const [formData, setFormData] = useState({
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
    status: "PANEN"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("key", "jadwal_panen")
      .single();
    
    if (!error && data && data.value) {
      try {
        const parsed = JSON.parse(data.value);
        if (parsed.start_date) {
          setFormData({
            start_date: parsed.start_date,
            end_date: parsed.end_date || parsed.start_date,
            status: parsed.status || "PANEN"
          });
        }
      } catch (e) {
        console.error("Error parsing schedule JSON:", e);
      }
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    
    const { error } = await supabase
      .from("settings")
      .upsert(
        { key: "jadwal_panen", value: JSON.stringify(formData) },
        { onConflict: 'key' }
      );

    if (error) {
      toast.error("Gagal menyimpan jadwal panen: " + error.message);
    } else {
      toast.success("Jadwal panen berhasil diperbarui!");
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="p-10 text-center"><Loader2 className="animate-spin inline-block mr-2" /> Memuat jadwal panen...</div>;
  }

  const [sYear, sMonth, sDay] = formData.start_date.split('-').map(Number);
  const startDateObj = new Date(sYear, sMonth - 1, sDay);

  const [eYear, eMonth, eDay] = formData.end_date.split('-').map(Number);
  const endDateObj = new Date(eYear, eMonth - 1, eDay);
  
  const monthsToDisplay = [];
  let currYear = startDateObj.getFullYear() || new Date().getFullYear();
  let currMonth = startDateObj.getMonth() || new Date().getMonth();

  while (
    currYear < (endDateObj.getFullYear() || currYear) || 
    (currYear === (endDateObj.getFullYear() || currYear) && currMonth <= (endDateObj.getMonth() || currMonth))
  ) {
    monthsToDisplay.push({ year: currYear, month: currMonth });
    currMonth++;
    if (currMonth > 11) {
      currMonth = 0;
      currYear++;
    }
  }

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  
  let displayBulan = "";
  if (monthsToDisplay.length === 1) {
    displayBulan = `${monthNames[startDateObj.getMonth()]} ${startDateObj.getFullYear()}`;
  } else if (startDateObj.getFullYear() === endDateObj.getFullYear()) {
    displayBulan = `${monthNames[startDateObj.getMonth()]} - ${monthNames[endDateObj.getMonth()]} ${startDateObj.getFullYear()}`;
  } else {
    displayBulan = `${monthNames[startDateObj.getMonth()]} ${startDateObj.getFullYear()} - ${monthNames[endDateObj.getMonth()]} ${endDateObj.getFullYear()}`;
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">
          Jadwal <span className="text-[#10b981]">Panen</span>
        </h1>
        <p className="text-gray-500 mt-2">
          Pilih rentang tanggal riil. Kalender di halaman galeri akan otomatis menyesuaikan hari dan bulan.
        </p>
      </div>

      <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-50 text-[#10b981] rounded-xl flex items-center justify-center">
            <CalendarDays size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Pengaturan Kalender Real-Time</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#10b981] focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Tanggal Selesai
            </label>
            <input
              type="date"
              value={formData.end_date}
              min={formData.start_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#10b981] focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Status Label
            </label>
            <input
              type="text"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#10b981] focus:ring-2 focus:ring-emerald-500/20 transition-all"
              placeholder="Contoh: PANEN"
            />
          </div>
        </div>

        {/* Live Preview */}
        <div className="mt-8 p-6 border border-gray-200 rounded-[24px] bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Preview Kalender (Di Halaman Galeri)</h3>
          <div className="flex flex-col gap-6 max-w-sm">
            {monthsToDisplay.map(({ year, month }) => {
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              const firstDay = new Date(year, month, 1).getDay();
              const emptySlots = Array.from({ length: firstDay });
              const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
              const monthLabel = `${monthNames[month]} ${year}`;

              return (
                <div key={`${year}-${month}`} className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100/50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-black text-[#064e3b]">
                      {monthLabel}
                    </span>
                    <span className="text-[9px] bg-[#10b981] text-white px-2 py-0.5 rounded-full font-black">
                      {formData.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center mt-2">
                    {["M", "S", "S", "R", "K", "J", "S"].map((d, i) => (
                      <div key={i} className="text-[10px] font-black text-emerald-600/70 mb-1">
                        {d}
                      </div>
                    ))}
                    {emptySlots.map((_, i) => (
                      <div key={`empty-${i}`}></div>
                    ))}
                    {days.map((day) => {
                      const currentDate = new Date(year, month, day);
                      const isHighlighted = currentDate >= startDateObj && currentDate <= endDateObj;
                      const today = new Date();
                      const isToday = currentDate.getDate() === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
                      
                      return (
                        <div key={day} className="flex justify-center items-center relative">
                          <span
                            className={`w-7 h-7 flex items-center justify-center text-[11px] font-bold transition-all relative z-10 ${
                              isHighlighted
                                ? "bg-gradient-to-br from-[#10b981] to-[#059669] text-white rounded-xl shadow-lg shadow-emerald-500/30 scale-110"
                                : isToday
                                ? "border border-[#10b981] text-[#10b981] rounded-full bg-emerald-50"
                                : "text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl"
                            }`}
                          >
                            {day}
                            {isHighlighted && (
                              <span className="absolute -top-1.5 -right-1.5 text-[10px] leading-none drop-shadow-md z-20" title="Jadwal Panen">🍈</span>
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
        </div>

        <div className="flex justify-end pt-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-[#10b981] text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50 shadow-md shadow-emerald-500/20"
          >
            {saving ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Save size={20} />
            )}
            <span>{saving ? "Menyimpan..." : "Simpan Jadwal"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
