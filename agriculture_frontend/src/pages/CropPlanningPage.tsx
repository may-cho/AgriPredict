import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  SproutIcon,
  TrendingUpIcon,
  BarChart3Icon,
  Loader2Icon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  DropletsIcon,
  AlertTriangleIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

const API_BASE_URL = "http://localhost:8000/api";

export function CropPlanningPage() {
  const [loading, setLoading] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [decision, setDecision] = useState<"yes" | "no" | null>(null);

  const [formData, setFormData] = useState({
    crop: "ဆန်စပါး",
    region: "Mandalay",
    soil_type: "သဲနုန်း",
    area_acres: 5,
    planting_month: new Date().getMonth() + 1,
    total_cost_per_acre: 500000,
  });

  const handlePredict = async () => {
    setLoading(true);
    setDecision(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/predict/`, formData);
      setPredictionResult(response.data);
      setShowPrediction(true);
    } catch (error) {
      console.error(error);
      alert("Backend server နှင့် ချိတ်ဆက်၍ မရပါ။");
    } finally {
      setLoading(false);
    }
  };

  const handleFarmerDecision = async (choice: "yes" | "no") => {
    // ၁။ UI မှာ ချက်ချင်း အပြောင်းအလဲ မြင်ရအောင် State အရင်ချိန်းမယ်
    setDecision(choice);

    try {
      // ၂။ Backend API သို့ ဒေတာ ပို့မယ်
      const payload = {
        crop: formData.crop,
        region: formData.region,
        area_acres: formData.area_acres,
        decision: choice, // 'yes' သို့မဟုတ် 'no'
      };

      const response = await axios.post(
        `${API_BASE_URL}/save-decision/`,
        payload,
      );

      if (response.status === 201) {
        console.log("✅ ဆုံးဖြတ်ချက်ကို Database တွင် သိမ်းဆည်းပြီးပါပြီ");

        // 💡 အကယ်၍ 'yes' ဆိုရင် တောင်သူကို Dashboard ဆီ ပို့ပေးချင်ရင် သုံးလို့ရတယ်
        if (choice === "yes") {
          // toast.success("စိုက်ပျိုးမှု အောင်မြင်ပါစေ။");
          // navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("❌ Decision Save Error:", error);
      alert("ဆုံးဖြတ်ချက်ကို သိမ်းဆည်း၍ မရပါ။");

      // Error ဖြစ်ရင် state ကို ပြန်ဖြုတ်ပေးလိုက်မယ်
      setDecision(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 bg-[#FBFDFB] min-h-screen font-sans text-slate-900">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-black text-[#1B4332]">
            စိုက်ပျိုးရေး အကြံပြုချက်
          </h1>
          <p className="text-slate-500 mt-4 font-medium">
            NASA ရာသီဥတုဒေတာနှင့် AI ကို အသုံးပြု၍ တွက်ချက်ထားပါသည်။
          </p>
        </div>
        {/* <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
          <CalendarIcon size={18} className="text-[#2D6A4F]" />
          <span className="font-bold text-[#1B4332]">
            {new Date().toLocaleDateString("my-MM", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div> */}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Input Form Area */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
            <h2 className="text-xl font-bold text-[#1B4332] flex items-center mb-8">
              <SproutIcon className="w-8 h-8 mr-3 text-[#2D6A4F]" />
              သီးနှံအချက်အလက်များ ဖြည့်စွက်ပါ
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-[#2D6A4F] uppercase tracking-widest ml-1">
                  သီးနှံအမျိုးအစား
                </label>
                <select
                  className="w-full bg-[#F0F7F4] border-2 border-transparent focus:border-[#2D6A4F] rounded-2xl p-4 font-bold outline-none transition-all appearance-none cursor-pointer"
                  value={formData.crop}
                  onChange={(e) =>
                    setFormData({ ...formData, crop: e.target.value })
                  }
                >
                  <option value="ဆန်စပါး">ဆန်စပါး</option>
                  <option value="ပြောင်း">ပြောင်း</option>
                  <option value="မြေပဲ">မြေပဲ</option>
                  <option value="နေကြာ">နေကြာ</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-[#2D6A4F] uppercase tracking-widest ml-1">
                  စိုက်ပျိုးမည့်ဒေသ
                </label>
                <select
                  className="w-full bg-[#F0F7F4] border-2 border-transparent focus:border-[#2D6A4F] rounded-2xl p-4 font-bold outline-none transition-all appearance-none cursor-pointer"
                  value={formData.region}
                  onChange={(e) =>
                    setFormData({ ...formData, region: e.target.value })
                  }
                >
                  <option value="Mandalay">မန္တလေး</option>
                  <option value="Sagaing">စစ်ကိုင်း</option>
                  <option value="Ayeyarwady">ဧရာဝတီ</option>
                  <option value="Shan">ရှမ်း</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-[#2D6A4F] uppercase tracking-widest ml-1">
                  ဧကအရေအတွက်
                </label>
                <input
                  type="number"
                  className="w-full bg-[#F0F7F4] border-2 border-transparent focus:border-[#2D6A4F] rounded-2xl p-4 font-bold outline-none"
                  value={formData.area_acres}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      area_acres: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-[#2D6A4F] uppercase tracking-widest ml-1">
                  ကုန်ကျစရိတ် (၁ ဧက)
                </label>
                <input
                  type="number"
                  className="w-full bg-[#F0F7F4] border-2 border-transparent focus:border-[#2D6A4F] rounded-2xl p-4 font-bold outline-none"
                  value={formData.total_cost_per_acre}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      total_cost_per_acre: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <button
              onClick={handlePredict}
              disabled={loading}
              className="mt-10 w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-black py-5 rounded-2xl shadow-xl shadow-green-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <BarChart3Icon />
              )}
              <span>
                {loading
                  ? "တွက်ချက်နေပါသည်..."
                  : "အမြတ်ငွေ ခန့်မှန်းချက် ရယူမည်"}
              </span>
            </button>
          </section>

          {/* Bottom Chart Section */}
          <AnimatePresence>
            {showPrediction && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-50"
              >
                <h3 className="text-xl font-bold text-[#1B4332] mb-8">
                  သီးနှံအလိုက် အမြတ်ငွေ နှိုင်းယှဉ်ချက်
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "ဆန်စပါး",
                          profit:
                            predictionResult?.prediction?.total_profit ||
                            850000,
                        },
                        { name: "ပြောင်း", profit: 720000 },
                        { name: "မြေပဲ", profit: 650000 },
                        { name: "နေကြာ", profit: 580000 },
                      ]}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#F1F5F9"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748B", fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94A3B8", fontSize: 11 }}
                      />
                      <Tooltip
                        cursor={{ fill: "#F8FAFC" }}
                        contentStyle={{
                          borderRadius: "20px",
                          border: "none",
                          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Bar
                        dataKey="profit"
                        radius={[12, 12, 0, 0]}
                        barSize={50}
                      >
                        <Cell fill="#2D6A4F" />
                        <Cell fill="#D1FAE5" />
                        <Cell fill="#D1FAE5" />
                        <Cell fill="#D1FAE5" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Status & Results Area */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!showPrediction ? (
              <div className="bg-[#F0F7F4] rounded-[2rem] p-10 h-[500px] border-4 border-dashed border-[#D1FAE5] flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <TrendingUpIcon className="w-10 h-10 text-[#2D6A4F] opacity-30" />
                </div>
                <p className="text-[#1B4332] font-bold text-lg">
                  ခန့်မှန်းချက် ရလဒ်များ
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  အချက်အလက်များ ဖြည့်သွင်းပြီးပါက
                  <br />
                  ဤနေရာတွင် ဖော်ပြပေးပါမည်။
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Main Prediction Card */}
                <div className="bg-gradient-to-br from-[#2D6A4F] to-[#081C15] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <TrendingUpIcon size={120} />
                  </div>
                  <p className="text-green-200/70 text-xs font-black uppercase tracking-[0.2em] mb-2">
                    ခန့်မှန်း စုစုပေါင်းအမြတ်
                  </p>
                  <h3 className="text-5xl font-black mb-10 tracking-tight">
                    {predictionResult.prediction.total_profit.toLocaleString()}{" "}
                    <span className="text-lg font-medium opacity-60 ml-1">
                      ကျပ်
                    </span>
                  </h3>

                  <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/10">
                    <div className="space-y-1">
                      <p className="text-white/40 text-[10px] uppercase font-bold tracking-wider">
                        အထွက်နှုန်း
                      </p>
                      <p className="text-xl font-bold">
                        {predictionResult.prediction.yield_per_acre}{" "}
                        <span className="text-xs opacity-50">တင်း/ဧက</span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-white/40 text-[10px] uppercase font-bold tracking-wider">
                        မိုးရေချိန် (၅ လ)
                      </p>
                      <p className="text-xl font-bold text-green-300">
                        {predictionResult.weather_snapshot.total_rainfall_mm}{" "}
                        <span className="text-xs opacity-50">mm</span>
                      </p>
                    </div>
                  </div>

                  {/* Decision Controls */}
                  <div className="mt-10 pt-8 border-t border-white/10">
                    <p className="text-center text-[10px] font-black text-green-200/50 uppercase tracking-[0.15em] mb-4">
                      ဤသီးနှံကို စိုက်ပျိုးရန် ဆုံးဖြတ်ပါသလား?
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleFarmerDecision("yes")}
                        className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all font-bold ${decision === "yes" ? "bg-white text-[#1B4332] shadow-lg scale-[1.05]" : "bg-white/10 border border-white/20 hover:bg-white/20"}`}
                      >
                        <CheckCircleIcon size={20} /> စိုက်မည်
                      </button>
                      <button
                        onClick={() => handleFarmerDecision("no")}
                        className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all font-bold ${decision === "no" ? "bg-red-500 text-white shadow-lg scale-[1.05]" : "bg-white/10 border border-white/20 hover:bg-white/20"}`}
                      >
                        <XCircleIcon size={20} /> မစိုက်ပါ
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
