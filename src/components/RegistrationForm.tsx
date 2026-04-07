"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Briefcase,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  LucideIcon,
  Calendar,
  Sparkles,
  LayoutDashboard,
  CreditCard,
  LogOut,
  Loader2,
  UserPlus,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import StudentDashboard from "./StudentDashboard";

interface AdminAdmissionFormProps {
  onLogout: () => void;
}

interface FormData {
  date: string;
  name: string;
  guardian: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  qualification: string;
  occupation: string;
  course: string;
  paymentMode: string;
  source: string;
}
interface FormErrors {
  [key: string]: string;
}
interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "form"
> {
  label: string;
  icon: LucideIcon;
  name: keyof FormData;
  error?: string;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  formData: FormData;
}

const COURSE_OPTIONS = [
  "IELTS",
  "PTE",
  "GERMAN",
  "FRENCH",
  "OET",
  "CELPIP",
  "DUOLINGO",
  "SPOKEN ENGLISH",
  "INTERVIEW PREP",
  "P.D.",
  "ACADEMICS",
  "COMPETITIVE EXAMS",
];
const SOURCE_OPTIONS = [
  "Reference",
  "Social Media",
  "Google",
  "Advertisement",
  "Walk-in",
  "Other",
];
const PAYMENT_OPTIONS = ["Cash", "UPI", "Cheque"];

const INITIAL_STATE: FormData = {
  date: new Date().toLocaleDateString("en-CA"),
  name: "",
  guardian: "",
  dob: "",
  gender: "",
  phone: "",
  email: "",
  address: "",
  qualification: "",
  occupation: "",
  course: "",
  paymentMode: "",
  source: "",
};

const CustomInput: React.FC<InputProps> = ({
  label,
  icon: Icon,
  name,
  error,
  setForm,
  formData,
  ...props
}) => (
  <div className="space-y-1.5 w-full text-left">
    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#19125e]/50 ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#19125e] transition-all">
        <Icon size={16} />
      </div>
      <input
        {...props}
        value={formData[name]}
        onChange={(e) => setForm({ ...formData, [name]: e.target.value })}
        className={`w-full bg-gray-50 border ${error ? "border-red-400" : "border-gray-200"} rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-[#19125e] focus:bg-white transition-all text-[#19125e] font-bold text-sm shadow-sm`}
      />
    </div>
    {error && (
      <p className="text-red-500 text-[9px] font-bold mt-1 ml-2 uppercase">
        {error}
      </p>
    )}
  </div>
);

export default function AdminAdmissionForm({
  onLogout,
}: AdminAdmissionFormProps) {
  const [view, setView] = useState<"intake" | "dashboard">("intake");

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const url = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

  const validateStep = (s: number) => {
    let newErrors: FormErrors = {};
    if (s === 1) {
      if (!form.name.trim()) newErrors.name = "Required";
      if (!form.phone || !/^[6-9]\d{9}$/.test(form.phone))
        newErrors.phone = "Invalid Phone";
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        newErrors.email = "Invalid Email Format";
    }
    if (s === 2 && !form.course) newErrors.course = "Select Course";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFinalSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2)) return;
    if (!url) {
      alert("API URL missing");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "text/plain" },
      });
      const data = await res.json();
      if (data.status === "success") {
        setSubmitted(true);
        setForm(INITIAL_STATE);
        setStep(1);
      }
    } catch (err) {
      alert("Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  if (submitted)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#19125e] p-6 text-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="bg-white/10 backdrop-blur-xl p-10 rounded-[3rem] border border-white/20 w-full max-w-md"
        >
          <CheckCircle
            size={60}
            className="text-[#f0c44c] mx-auto mb-6 shadow-2xl"
          />
          <h1 className="text-3xl font-black text-white uppercase italic mb-2 tracking-tighter">
            Saved!
          </h1>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-[#f0c44c] text-[#19125e] w-full py-4 rounded-full font-black text-xs uppercase tracking-widest mt-8"
          >
            Next Registration
          </button>
        </motion.div>
      </div>
    );

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-[#f8fafc] overflow-hidden">
      <aside className="hidden md:flex w-20 lg:w-72 bg-[#19125e] flex-col justify-between py-10 px-6 border-r border-white/5 relative z-50">
        <div className="w-full text-center">
          <Image
            src="/brightMindsAcademy-logo.jpeg"
            width={180}
            height={60}
            alt="logo"
            className="rounded-lg mb-12 mx-auto"
          />

          <nav className="flex flex-col gap-3">
            <button
              onClick={() => setView("intake")}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${view === "intake" ? "bg-[#f0c44c] text-[#19125e]" : "text-white/40 hover:text-white hover:bg-white/5"}`}
            >
              <UserPlus size={20} />
              <span className="hidden lg:block font-bold text-[10px] uppercase tracking-widest">
                New Intake
              </span>
            </button>

            <button
              onClick={() => setView("dashboard")}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${view === "dashboard" ? "bg-[#f0c44c] text-[#19125e]" : "text-white/40 hover:text-white hover:bg-white/5"}`}
            >
              <LayoutDashboard size={20} />
              <span className="hidden lg:block font-bold text-[10px] uppercase tracking-widest">
                Dashboard
              </span>
            </button>
          </nav>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center lg:justify-start gap-4 p-4 rounded-2xl text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all font-bold text-[10px] uppercase tracking-widest cursor-pointer"
        >
          <LogOut size={20} />
          <span className="hidden lg:block">Logout</span>
        </button>
      </aside>

      <div className="md:hidden bg-[#19125e] p-4 flex justify-between items-center relative z-50">
        <Image
          src="/brightMindsAcademy-logo.jpeg"
          width={120}
          height={40}
          alt="logo"
          className="rounded-md"
        />
        <div className="flex gap-4">
          <button
            onClick={() => setView(view === "intake" ? "dashboard" : "intake")}
            className="text-[#f0c44c]"
          >
            {view === "intake" ? (
              <LayoutDashboard size={22} />
            ) : (
              <UserPlus size={22} />
            )}
          </button>
          <button onClick={onLogout} className="text-white/40">
            <LogOut size={22} />
          </button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto pb-32 md:pb-12 scroll-smooth bg-[#f8fafc]">
        <AnimatePresence mode="wait">
          {view === "intake" ? (
            <motion.div
              key="intake"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-5 md:p-12 lg:p-16"
            >
              <header className="hidden md:flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#19125e] rounded-xl flex items-center justify-center text-white">
                    <UserPlus size={20} />
                  </div>
                  <div className="text-left">
                    <h1 className="text-2xl font-black text-[#19125e] uppercase italic tracking-tighter leading-none">
                      New Admission
                    </h1>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                      Fill student details below
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">
                    System Date
                  </p>
                  <p className="text-sm font-black text-[#19125e]">
                    {form.date}
                  </p>
                </div>
              </header>

              <form onSubmit={handleFinalSubmit} className="max-w-5xl mx-auto">
                <AnimatePresence>
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#19125e]/90 backdrop-blur-md"
                    >
                      <div className="text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="mb-8 flex justify-center"
                        >
                          <Loader2 size={60} className="text-[#f0c44c]" />
                        </motion.div>
                        <h2 className="text-white text-3xl font-black uppercase italic italic">
                          Securely Saving
                        </h2>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="s1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-5">
                        <p className="text-[10px] font-black text-[#f0c44c] uppercase tracking-widest mb-2 flex items-center gap-2 text-left">
                          <Sparkles size={14} /> Profile
                        </p>
                        <CustomInput
                          label="Student Name"
                          icon={User}
                          name="name"
                          formData={form}
                          setForm={setForm}
                          error={errors.name}
                        />
                        <CustomInput
                          label="Guardian Name"
                          icon={User}
                          name="guardian"
                          formData={form}
                          setForm={setForm}
                        />
                        <div className="grid grid-cols-2 gap-4 text-left">
                          <CustomInput
                            label="Date of Birth"
                            icon={Calendar}
                            name="dob"
                            type="date"
                            formData={form}
                            setForm={setForm}
                          />
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#19125e]/50 ml-1">
                              Gender
                            </label>
                            <select
                              className="w-full bg-gray-50 border border-gray-200 py-3 rounded-xl px-4 text-[#19125e] font-bold text-sm outline-none appearance-none"
                              value={form.gender}
                              onChange={(e) =>
                                setForm({ ...form, gender: e.target.value })
                              }
                            >
                              <option value="">SELECT</option>
                              <option value="Male">MALE</option>
                              <option value="Female">FEMALE</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-5 text-left">
                        <p className="text-[10px] font-black text-[#f0c44c] uppercase tracking-widest mb-2 flex items-center gap-2">
                          <MapPin size={14} /> Communication
                        </p>
                        <CustomInput
                          label="Mobile Number"
                          icon={Phone}
                          name="phone"
                          maxLength={10}
                          formData={form}
                          setForm={setForm}
                          error={errors.phone}
                        />
                        <CustomInput
                          label="Email Id"
                          icon={Mail}
                          name="email"
                          type="email"
                          formData={form}
                          setForm={setForm}
                          error={errors.email}
                        />
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#19125e]/50 ml-1">
                            Full Address
                          </label>
                          <textarea
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-[#19125e] font-bold text-sm h-24 outline-none focus:border-[#19125e]"
                            value={form.address}
                            onChange={(e) =>
                              setForm({ ...form, address: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="s2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8 text-left"
                    >
                      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 grid md:grid-cols-2 gap-6">
                        <CustomInput
                          label="Qualification"
                          icon={GraduationCap}
                          name="qualification"
                          formData={form}
                          setForm={setForm}
                        />
                        <CustomInput
                          label="Occupation"
                          icon={Briefcase}
                          name="occupation"
                          formData={form}
                          setForm={setForm}
                        />
                      </div>
                      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 className="text-[10px] font-black text-[#f0c44c] uppercase tracking-[0.2em] mb-6">
                          Course Stream
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {COURSE_OPTIONS.map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setForm({ ...form, course: c })}
                              className={`py-4 rounded-xl border-2 text-[12px] font-black transition-all ${form.course === c ? "bg-[#19125e] text-white border-[#19125e] shadow-lg scale-[1.02]" : "bg-white border-gray-50 text-gray-400 hover:border-gray-200"}`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="s3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 text-left"
                    >
                      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#f0c44c]">
                          Payment Mode
                        </label>
                        <div className="space-y-3">
                          {PAYMENT_OPTIONS.map((p) => (
                            <label
                              key={p}
                              className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${form.paymentMode === p ? "bg-[#19125e]/5 border-[#19125e]" : "border-gray-50 hover:border-gray-200"}`}
                            >
                              <span
                                className={`text-[13px] font-black uppercase ${form.paymentMode === p ? "text-[#19125e]" : "text-gray-400"}`}
                              >
                                {p}
                              </span>
                              <input
                                type="radio"
                                name="p"
                                checked={form.paymentMode === p}
                                onChange={() =>
                                  setForm({ ...form, paymentMode: p })
                                }
                                className="accent-[#19125e]"
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#f0c44c]">
                          Source
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {SOURCE_OPTIONS.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setForm({ ...form, source: s })}
                              className={`px-2 py-3 rounded-xl border text-[13px] font-black uppercase transition-all ${form.source === s ? "bg-[#f0c44c] text-[#19125e] border-[#f0c44c]" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="bg-[#19125e] p-8 rounded-[2.5rem] shadow-2xl hidden md:flex flex-col justify-center text-white text-center md:text-left relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/10 transition-all duration-700" />
                        <CheckCircle
                          className="text-[#f0c44c] mb-4 mx-auto md:mx-0 shadow-2xl shadow-[#f0c44c]/20"
                          size={32}
                        />
                        <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mt-2 relative z-10">
                          Verification Ready
                        </p>
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-[#f0c44c] text-[#19125e] py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] mt-8 shadow-xl active:scale-95 transition-all relative z-10 cursor-pointer"
                        >
                          Submit
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="fixed bottom-0 left-0 right-0 md:relative md:mt-12 bg-white/80 backdrop-blur-xl border-t border-gray-100 md:border-0 md:bg-transparent p-4 md:p-0 z-[60]">
                  <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => step > 1 && setStep(step - 1)}
                      className={`flex-1 md:flex-none flex items-center justify-center gap-2 py-4 px-6 md:px-0 text-gray-400 font-black text-[10px] uppercase tracking-widest ${step === 1 ? "invisible" : "visible"} cursor-pointer`}
                    >
                      <ArrowLeft size={16} />
                      <span className="hidden md:inline">Previous Step</span>
                      <span className="md:hidden">Back</span>
                    </button>
                    <div className="md:hidden flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1 rounded-full transition-all ${step === i ? "w-4 bg-[#19125e]" : "w-1 bg-gray-200"}`}
                        />
                      ))}
                    </div>
                    {step < 3 ? (
                      <button
                        type="button"
                        onClick={() => validateStep(step) && setStep(step + 1)}
                        className="flex-1 md:flex-none bg-[#19125e] text-white py-4 px-8 md:rounded-2xl rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl active:scale-95 cursor-pointer hover:bg-[#19125e]/90 transition-all"
                      >
                        <span className="hidden md:inline">Next Step</span>
                        <span className="md:hidden">Next</span>
                        <ArrowRight size={14} className="text-[#f0c44c]" />
                      </button>
                    ) : (
                      <div className="md:hidden flex-1">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-[#f0c44c] text-[#19125e] py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95"
                        >
                          Submit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </motion.div>
          ) : (
            <StudentDashboard url={url!} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}