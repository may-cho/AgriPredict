import { motion } from "framer-motion";
import {
  DropletsIcon,
  BugIcon,
  FlaskConicalIcon,
  WheatIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  InfoIcon,
  AlertTriangle,
  CalendarClockIcon,
} from "lucide-react";
import type { Notification } from "../types";
import { useEffect, useState } from "react";
import axios from "axios";
interface AdvisoryPageProps {
  notifications: Notification[];
}
export function AdvisoryPage({ notifications }: AdvisoryPageProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "irrigation":
        return <DropletsIcon className="w-6 h-6" />;
      case "pest":
        return <BugIcon className="w-6 h-6" />;
      case "fertilizer":
        return <FlaskConicalIcon className="w-6 h-6" />;
      case "harvest":
        return <WheatIcon className="w-6 h-6" />;
      default:
        return <InfoIcon className="w-6 h-6" />;
    }
  };

  const savedCycleId = localStorage.getItem("active_crop_cycle_id");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // ဒေတာအသစ်မလာခင် loading ပြထားမယ်
      try {
        const res = await axios.get(
          `http://localhost:8000/api/crop-status/${savedCycleId}/`,
        );

        // Backend ကနေ ပို့လိုက်တဲ့ { weather, notifications, timeline, cycle_details } အကုန်လုံးကို သိမ်းမယ်
        setData(res.data);
        console.log("Advisory Data Loaded:", res.data);
      } catch (err) {
        console.error("API Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (savedCycleId) {
      fetchData();
    }
  }, [savedCycleId]);

  if (loading) return <div className="p-10 text-center">Loading Status...</div>;
  const getColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-[#FFEbee] text-[#E63946] border-[#E63946]";
      case "medium":
        return "bg-[#FFF3E0] text-[#E76F51] border-[#E76F51]";
      case "low":
        return "bg-[#E8F3EE] text-[#2D6A4F] border-[#52B788]";
      default:
        return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };
  const toBurmeseDate = (dateStr: string) => {
    if (!dateStr) return "";

    // ၁။ ဂဏန်းတွေကို မြန်မာဂဏန်း ပြောင်းမယ်
    const burmeseNums: { [key: string]: string } = {
      "0": "၀",
      "1": "၁",
      "2": "၂",
      "3": "၃",
      "4": "၄",
      "5": "၅",
      "6": "၆",
      "7": "၇",
      "8": "၈",
      "9": "၉",
    };

    // ၂။ လ အတိုကောက်တွေကို မြန်မာလို ပြောင်းမယ်
    const months: { [key: string]: string } = {
      Jan: "ဇန်နဝါရီ",
      Feb: "ဖေဖော်ဝါရီ",
      Mar: "မတ်",
      Apr: "ဧပြီ",
      May: "မေ",
      Jun: "ဇွန်",
      Jul: "ဇူလိုင်",
      Aug: "ဩဂုတ်",
      Sep: "စက်တင်ဘာ",
      Oct: "အောက်တိုဘာ",
      Nov: "နိုဝင်ဘာ",
      Dec: "ဒီဇင်ဘာ",
    };

    // "29 Mar" ကို ခွဲထုတ်မယ်
    const parts = dateStr.split(" ");
    if (parts.length !== 2) return dateStr;

    const day = parts[0];
    const monthAbbr = parts[1];

    // ဂဏန်းပြောင်းခြင်း
    const burmeseDay = day
      .split("")
      .map((char) => burmeseNums[char] || char)
      .join("");

    // လ အမည်ပြောင်းခြင်း
    const burmeseMonth = months[monthAbbr] || monthAbbr;

    return `${burmeseDay} ရက် ${burmeseMonth}လ`;
  };
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -10,
      }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Lifecycle Timeline */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-[#1B4332]">
                စိုက်ပျိုးမှု အဆင့်ဆင့်
              </h3>
              <span className="bg-[#E8F3EE] text-[#2D6A4F] px-3 py-1 rounded-full text-sm font-bold">
                {data.cycle_info.name}
              </span>
            </div>

            <div className="relative ml-4">
              <div className="absolute left-4 top-4 bottom-4 w-1 bg-gray-100 rounded-full"></div>
              <div className="space-y-10 relative">
                {data.timeline.map((step, i) => {
                  // Status အလိုက် အရောင်နဲ့ ပုံစံ သတ်မှတ်ခြင်း
                  const isFinished =
                    step.is_completed || step.status_label === "ပြီးစီး";
                  const isActive = step.status_label === "လက်ရှိ";
                  const isUpcoming = step.status_label === "လာမည့်";

                  return (
                    <div
                      key={step.id}
                      className="flex items-start group relative"
                    >
                      {/* Timeline လိုင်းကြောင်းလေးအတွက် (နောက်ဆုံးတစ်ခုမှာ မပေါ်အောင် i စစ်ထားတယ်) */}
                      {i !== data.timeline.length - 1 && (
                        <div
                          className={`absolute left-5 top-10 bottom-0 w-0.5 ${isFinished ? "bg-[#52B788]" : "bg-gray-100"}`}
                        />
                      )}

                      {/* အဝိုင်းလေး (Icon/Number) */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 shadow-sm transition-all group-hover:scale-110 
          ${
            isFinished
              ? "bg-[#52B788] border-[#E8F3EE] text-white"
              : isActive
                ? "bg-white border-[#2D6A4F] text-[#2D6A4F] ring-4 ring-green-50"
                : "bg-white border-gray-100 text-gray-300"
          }`}
                      >
                        {isFinished ? (
                          <CheckCircle2Icon className="w-5 h-5" />
                        ) : (
                          <span className="text-base font-bold">{i + 1}</span>
                        )}
                      </div>

                      {/* စာသားအပိုင်း */}
                      <div
                        className={`ml-6 pb-10 ${isFinished ? "text-gray-400" : "text-[#1B4332]"}`}
                      >
                        <h4
                          className={`font-bold text-lg ${isActive ? "text-xl text-[#1B4332]" : ""}`}
                        >
                          {step.stage_name}
                        </h4>

                        <div className="flex items-center mt-1">
                          <CalendarClockIcon className="w-4 h-4 mr-1 opacity-70" />
                          <span className="text-sm font-medium">
                            {isActive ? "ယနေ့ - " : "ခန့်မှန်း - "}{" "}
                            {toBurmeseDate(step.date_str)}
                          </span>
                        </div>

                        {/* လက်ရှိအဆင့်ဖြစ်ရင် Badge လေးပြမယ် */}
                        {isActive && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-block bg-[#E8F3EE] text-[#2D6A4F] text-xs font-bold px-3 py-1 rounded-full mt-2 border border-[#2D6A4F]/20"
                          >
                            လက်ရှိ လုပ်ဆောင်ဆဲ
                          </motion.span>
                        )}

                        {isFinished && (
                          <span className="text-xs font-bold text-[#52B788] mt-1 block">
                            ဆောင်ရွက်ပြီး
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Notifications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#1B4332] mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-[#E76F51]" />
              လုပ်ဆောင်ရန် အကြံပြုချက်များ
            </h3>
            <div className="space-y-4">
              {data.notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`rounded-2xl p-6 border-l-8 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer ${getColor(notif.urgency)}`}
                >
                  <div className="flex items-center space-x-5">
                    <div className="p-4 bg-white/60 rounded-full shadow-sm">
                      {getIcon(notif.type)}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">
                        {notif.message}
                      </h4>
                      <p className="text-base opacity-90 flex items-center">
                        <CalendarClockIcon className="w-4 h-4 mr-1" />
                        နောက်{" "}
                        <span className="font-bold mx-1">
                          {notif.daysUntil}
                        </span>{" "}
                        ရက်အတွင်း လုပ်ဆောင်ရန်
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/40 p-2 rounded-full">
                    <ChevronRightIcon className="w-6 h-6" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-[#F0F7F4] rounded-2xl p-8 border border-[#52B788]/30 flex items-start">
            <div className="bg-white p-3 rounded-full shadow-sm mr-6 flex-shrink-0">
              <InfoIcon className="w-8 h-8 text-[#2D6A4F]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#2D6A4F] mb-3">
                အထွက်နှုန်းတိုးရန် အထူးအကြံပြုချက်
              </h3>
              <p className="text-base text-[#1B4332] leading-relaxed">
                စပါးပင် ပန်းပွင့်ချိန်တွင် ရေမပြတ်စေရန် အထူးဂရုစိုက်ပါ။
                ရေပြတ်ပါက အဖျင်းအမှော် များတတ်ပါသည်။ ပိုးမွှားအန္တရာယ်ကိုလည်း
                ပုံမှန် စစ်ဆေးပါ။ ယခုရက်သတ္တပတ်အတွင်း ပိုးမွှားကျရောက်နိုင်ခြေ
                များပြားသဖြင့် ဂရုပြုစစ်ဆေးရန် အကြံပြုအပ်ပါသည်။
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
