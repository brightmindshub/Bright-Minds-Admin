"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false); 
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (username === "admin" && password === "brightminds123") {
        setLoginSuccess(true);

        setTimeout(() => {
          localStorage.setItem("isAdminAuthenticated", "true");
          router.push("/admission");
        }, 2200);
      } else {
        setError("Access Denied: Check Credentials");
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="h-screen w-full flex bg-white font-sans overflow-hidden relative">
      <AnimatePresence>
        {loginSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#19125e]"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 40 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute w-10 h-10 bg-[#f0c44c]/5 rounded-full"
            />

            <div className="relative z-10 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 12, stiffness: 120 }}
                className="mb-8 flex justify-center"
              >
                <div className="bg-[#f0c44c] p-5 rounded-full shadow-[0_0_50px_rgba(240,196,76,0.3)]">
                  <CheckCircle2 size={60} className="text-[#19125e]" />
                </div>
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white text-4xl md:text-5xl font-black uppercase italic tracking-tighter"
              >
                Access <span className="text-[#f0c44c]">Granted</span>
              </motion.h2>

              <motion.div className="mt-12 w-48 h-[2px] bg-white/10 mx-auto rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.6, delay: 0.6, ease: "easeInOut" }}
                  className="h-full bg-[#f0c44c]"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden lg:flex w-1/2 bg-[#19125e] relative items-center justify-center p-20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="absolute top-20 left-20">
          <Image
            src="/BrightMindsAcademyLogo.png"
            width={220}
            height={80}
            alt="logo"
            className="rounded-2xl brightness-125 shadow-2xl"
          />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl font-black text-white leading-none uppercase italic tracking-tighter">
              Admin <br /> <span className="text-[#f0c44c]">Panel</span>
            </h1>
            <p className="text-white/40 mt-6 max-w-sm text-sm font-bold uppercase tracking-[0.3em] leading-relaxed">
              Bright Minds Academy <br /> Secure Management Interface
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-20 right-20 flex items-center gap-4 text-white/20">
          <ShieldCheck size={40} />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-[#fcfdfe]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-10 text-center">
            <Image
              src="/brightMindsAcademy-logo.jpeg"
              width={180}
              height={60}
              alt="logo"
              className="rounded-xl mx-auto shadow-xl"
            />
          </div>

          <div className="mb-12">
            <h2 className="text-4xl font-black text-[#19125e] uppercase tracking-tighter italic">
              Sign In
            </h2>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.4em] mt-2">
              Admin Access Only
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              <div className="group relative border-b-2 border-gray-100 focus-within:border-[#19125e] transition-all pb-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 group-focus-within:text-[#f0c44c]">
                  Username
                </label>
                <div className="flex items-center gap-3 mt-1">
                  <User
                    size={18}
                    className="text-gray-200 group-focus-within:text-[#19125e]"
                  />
                  <input
                    type="text"
                    placeholder="ADMIN_USERNAME"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-transparent outline-none text-[#19125e] font-black text-lg placeholder:text-gray-100 tracking-wider"
                  />
                </div>
              </div>

              <div className="group relative border-b-2 border-gray-100 focus-within:border-[#19125e] transition-all pb-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 group-focus-within:text-[#f0c44c]">
                  Password
                </label>
                <div className="flex items-center gap-3 mt-1">
                  <Lock
                    size={18}
                    className="text-gray-200 group-focus-within:text-[#19125e]"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent outline-none text-[#19125e] font-black text-lg placeholder:text-gray-100 tracking-[0.5em]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-200 hover:text-[#19125e]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ x: -10 }}
                animate={{ x: 0 }}
                className="flex items-center gap-2 text-red-500"
              >
                <div className="w-1 h-1 bg-red-500 rounded-full animate-ping" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  {error}
                </p>
              </motion.div>
            )}

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading || loginSuccess}
                className="w-full bg-[#19125e] text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-[#19125e]/20 hover:bg-[#f0c44c] hover:text-[#19125e] transition-all active:scale-95 flex items-center justify-center gap-3 group cursor-pointer disabled:opacity-50"
              >
                {loading && !loginSuccess ? "Verifying..." : "Access Portal"}
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-2 transition-transform text-[#f0c44c]"
                />
              </button>
            </div>
          </form>

          <footer className="mt-20 flex justify-center items-center border-t border-gray-50 pt-8">
            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
              © 2026 Bright Minds Academy
            </p>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
