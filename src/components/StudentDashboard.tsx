"use client";

import React, { useEffect, useState } from "react";
import {
  RefreshCw,
  Search,
  Users,
  Calendar as CalendarIcon,
  Phone,
  GraduationCap,
  Eye,
  X,
  MapPin,
  User as UserIcon,
  Briefcase,
  CreditCard,
  Info,
  ChevronLeft,
  ChevronRight,
  FileDown,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Student {
  date: string;
  name: string;
  course: string;
  phone: string;
  email: string;
  guardian?: string;
  address?: string;
  qualification?: string;
  occupation?: string;
  source?: string;
  gender?: string;
  dob?: string;
}

interface Props {
  url: string;
}

export default function StudentDashboard({ url }: Props) {
  const [students, setStudents] = useState<Student[]>([]);
  const [fetching, setFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const CACHE_KEY = "bma_students_data";

  const formatManualDate = (dateStr: string) => {
    if (!dateStr) return "---";
    try {
      const d = new Date(dateStr);
      d.setMinutes(d.getMinutes() + 330);
      const day = String(d.getDate()).padStart(2, "0");
      const month = d.toLocaleString("en-IN", { month: "short" });
      const year = d.getFullYear();
      return `${day} ${month}, ${year}`;
    } catch {
      return dateStr;
    }
  };

  const getBase64ImageFromURL = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const generateReceipt = async (student: Student) => {
    const doc = new jsPDF();
    const brandColor = [25, 18, 94]; 
    const goldColor = [240, 196, 76]; 
    const textColor = [60, 60, 60];

    try {
      let logoBase64 = "";
      try {
        logoBase64 = await getBase64ImageFromURL(
          "/brightMindsAcademy-logo.jpeg",
        );
        doc.addImage(logoBase64, "JPEG", 75, 12, 60, 20);
      } catch (e) {
        doc.setFontSize(20);
        doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
        doc.text("BRIGHT MINDS ACADEMY", 105, 25, { align: "center" });
      }

      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(
        "RZ- 58-61, Vashisht Park, Pankha Road, Near Sagarpur bus stand, New Delhi - 110046",
        105,
        38,
        { align: "center" },
      ); 
      doc.text("Contact: +91 92176 69989, +91 88263 80767", 105, 43, {
        align: "center",
      });

      doc.setFillColor(brandColor[0], brandColor[1], brandColor[2]);
      doc.rect(0, 52, 210, 12, "F");
      doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("ADMISSION ENROLLMENT ACKNOWLEDGEMENT", 105, 60, {
        align: "center",
      });

      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      doc.text(`Date: ${formatManualDate(new Date().toISOString())}`, 190, 78, {
        align: "right",
      });

      // 5. DATA GRID (Main Content)
      doc.setDrawColor(230, 230, 230);
      doc.line(20, 83, 190, 83);

      const drawDataField = (
        label: string,
        value: string,
        x: number,
        y: number,
      ) => {
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.setFont("helvetica", "bold");
        doc.text(label.toUpperCase(), x, y);

        doc.setFontSize(10);
        doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
        doc.setFont("helvetica", "bold");
        doc.text(String(value || "Not Provided"), x, y + 6);
      };

      // Row 1
      drawDataField("Student Full Name", student.name, 20, 95);
      drawDataField("Enrolled Course", student.course, 120, 95);

      // Row 2
      drawDataField("Guardian Name", student.guardian || "---", 20, 115);
      drawDataField("Contact Number", student.phone, 120, 115);

      // Row 3
      drawDataField(
        "Date of Birth",
        formatManualDate(student.dob || ""),
        20,
        135,
      );
      drawDataField(
        "Payment Mode",
        (student as any)["payment mode"] || "Verified",
        120,
        135,
      );

      doc.setFillColor(250, 250, 252);
      doc.roundedRect(20, 155, 170, 25, 2, 2, "F");
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("COMMUNICATION ADDRESS", 25, 162);
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      doc.text(student.address || "As per records.", 25, 170, {
        maxWidth: 160,
      });

      if (logoBase64) {
        doc.setGState(new (doc as any).GState({ opacity: 0.04 }));
        doc.addImage(logoBase64, "JPEG", 55, 100, 100, 40);
        doc.setGState(new (doc as any).GState({ opacity: 1 }));
      }

      const bottomY = 220;
      doc.setFontSize(9);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont("helvetica", "bold");
      doc.text("Instructions:", 20, bottomY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(
        "• This is an electronically generated receipt, no physical signature is required.",
        20,
        bottomY + 6,
      );
      doc.text(
        "• Please carry this receipt at the time of commencement of classes.",
        20,
        bottomY + 11,
      );
      doc.text(
        "• Admission is subject to full verification of documents.",
        20,
        bottomY + 16,
      );

      doc.setDrawColor(brandColor[0], brandColor[1], brandColor[2]);
      doc.setLineWidth(0.2);
      doc.line(140, 250, 190, 250);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Signature", 165, 256, { align: "center" });

      doc.setFillColor(brandColor[0], brandColor[1], brandColor[2]);
      doc.rect(0, 280, 210, 17, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text("www.brightmindshub.in", 60, 290, { align: "center" });

      doc.setDrawColor(255, 255, 255);
      doc.line(105, 284, 105, 293);

      doc.text("info@brightmindshub.in", 150, 290, { align: "center" });

      doc.save(`Receipt_${student.name.replace(/\s+/g, "_")}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Error generating PDF receipt.");
    }
  };
  const fetchData = async (force = false) => {
    if (!url) return;
    if (!force) {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        setStudents(JSON.parse(cachedData));
        return;
      }
    }
    setFetching(true);
    try {
      const res = await fetch(`${url}?t=${new Date().getTime()}`);
      const data = await res.json();
      const finalData = Array.isArray(data) ? data.reverse() : [];
      setStudents(finalData);
      localStorage.setItem(CACHE_KEY, JSON.stringify(finalData));
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredStudents = students.filter((s) => {
    const search = searchTerm.toLowerCase();
    return (
      s.name?.toLowerCase().includes(search) ||
      s.course?.toLowerCase().includes(search) ||
      String(s.phone).includes(search)
    );
  });

  const totalPages = Math.ceil(filteredStudents.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredStudents.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 font-sans relative min-h-screen">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
        <div className="text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-[#f0c44c] mb-2"
          >
            <Sparkles size={14} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Administrative Hub
            </span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-[#19125e] uppercase italic tracking-tighter leading-none mb-4">
            Student <span className="opacity-20 text-[#19125e]">Registry</span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="bg-[#19125e]/5 px-4 py-2 rounded-2xl border border-[#19125e]/10 flex items-center gap-2 text-[#19125e]">
              <Users size={14} />
              <span className="text-xs font-black uppercase tracking-widest">
                {students.length} Records
              </span>
            </div>
            <div className="h-4 w-[1px] bg-gray-200" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
              Bright Minds Academy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#19125e] transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search ID, Name or Course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-transparent focus:border-[#19125e]/10 outline-none text-sm font-bold text-[#19125e] transition-all rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)]"
            />
          </div>
          <button
            onClick={() => fetchData(true)}
            disabled={fetching}
            className="p-4 bg-[#19125e] text-white rounded-3xl shadow-xl hover:shadow-[#19125e]/30 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={20} className={fetching ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(25,18,94,0.04)] border border-gray-50 overflow-hidden mb-8">
        <div className="overflow-x-auto text-left">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                {[
                  { label: "Date", icon: CalendarIcon },
                  { label: "Name", icon: UserIcon },
                  { label: "Course", icon: GraduationCap },
                  { label: "Contact", icon: Phone, hideMobile: true },
                  { label: "Action", icon: Eye },
                ].map((h, i) => (
                  <th
                    key={i}
                    className={`px-8 py-7 text-[10px] font-black text-[#19125e]/40 uppercase tracking-[0.2em] ${h.hideMobile ? "hidden md:table-cell" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <h.icon size={12} /> {h.label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="wait">
                {fetching && students.length === 0
                  ? [...Array(5)].map((_, i) => (
                      <tr key={`skel-${i}`} className="animate-pulse">
                        {[...Array(5)].map((_, j) => (
                          <td key={j} className="px-8 py-7">
                            <div className="h-4 bg-gray-100 rounded-full w-2/3" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : currentRecords.map((s, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group hover:bg-[#fcfdfe] transition-all cursor-default"
                      >
                        <td className="px-8 py-7 text-[11px] font-black text-[#19125e] uppercase tabular-nums opacity-60">
                          {formatManualDate(s.date)}
                        </td>
                        <td className="px-8 py-7 text-sm font-black text-[#19125e] uppercase tracking-tight group-hover:text-[#f0c44c] transition-colors">
                          {s.name}
                        </td>
                        <td className="px-8 py-7">
                          <span className="px-4 py-1.5 bg-[#19125e]/5 text-[#19125e] text-[10px] font-black rounded-xl uppercase border border-[#19125e]/5">
                            {s.course}
                          </span>
                        </td>
                        <td className="px-8 py-7 text-sm font-bold text-gray-500 tabular-nums hidden md:table-cell">
                          {s.phone}
                        </td>
                        <td className="px-8 py-7">
                          <button
                            onClick={() => setSelectedStudent(s)}
                            className="p-2 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-[#f0c44c] group-hover:text-[#19125e] transition-all cursor-pointer"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4 pb-12">
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
            Showing {indexOfFirstRecord + 1} -{" "}
            {Math.min(indexOfLastRecord, filteredStudents.length)} of{" "}
            {filteredStudents.length} Students
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-3 bg-white border border-gray-100 rounded-2xl text-[#19125e] shadow-sm disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-2xl text-[10px] font-black transition-all ${currentPage === i + 1 ? "bg-[#19125e] text-white shadow-lg" : "bg-white text-gray-400 border border-gray-50"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-3 bg-white border border-gray-100 rounded-2xl text-[#19125e] shadow-sm disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="absolute inset-0 bg-[#19125e]/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="bg-[#19125e] p-6 md:p-8 text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4 text-left">
                  <div className="bg-[#f0c44c] p-2 md:p-3 rounded-2xl text-[#19125e]">
                    <UserIcon size={24} fill="currentColor" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-3xl font-black uppercase italic tracking-tighter leading-tight">
                      {selectedStudent.name}
                    </h2>
                    <p className="text-[#f0c44c] text-[10px] font-black uppercase tracking-widest mt-1">
                      Registry Profile
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="bg-white/10 p-2 rounded-full cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto bg-[#fcfdfe]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <DetailItem
                    icon={CalendarIcon}
                    label="Enrollment Date"
                    value={formatManualDate(selectedStudent.date)}
                  />
                  <DetailItem
                    icon={CalendarIcon}
                    label="Date of Birth"
                    value={formatManualDate(selectedStudent.dob || "")}
                  />
                  <DetailItem
                    icon={UserIcon}
                    label="Guardian"
                    value={selectedStudent.guardian}
                  />
                  <DetailItem
                    icon={GraduationCap}
                    label="Course"
                    value={selectedStudent.course}
                    highlight
                  />
                  <DetailItem
                    icon={Phone}
                    label="Contact"
                    value={selectedStudent.phone}
                  />
                  <DetailItem
                    icon={Mail}
                    label="Email Id"
                    value={selectedStudent.email}
                  />
                  <DetailItem
                    icon={MapPin}
                    label="Address"
                    value={selectedStudent.address}
                  />
                  <DetailItem
                    icon={Briefcase}
                    label="Occupation"
                    value={selectedStudent.occupation}
                  />
                  <DetailItem
                    icon={CreditCard}
                    label="Payment Mode"
                    value={(selectedStudent as any)["payment mode"]}
                  />
                  <DetailItem
                    icon={Info}
                    label="Lead Source"
                    value={selectedStudent.source}
                  />
                </div>
              </div>

              <div className="bg-white border-t border-gray-50 p-6 flex flex-col sm:flex-row gap-3 justify-center shrink-0">
                <button
                  onClick={() => generateReceipt(selectedStudent)}
                  className="w-full sm:w-auto bg-[#f0c44c] text-[#19125e] px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  <FileDown size={18} /> Download Receipt
                </button>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="w-full sm:w-auto bg-gray-100 text-gray-500 px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all cursor-pointer"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value, highlight = false }: any) {
  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${highlight ? "bg-[#19125e] border-[#19125e] shadow-lg shadow-[#19125e]/20" : "bg-white border-gray-100"}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon
          size={14}
          className={highlight ? "text-[#f0c44c]" : "text-gray-300"}
        />
        <p
          className={`text-[9px] font-black uppercase tracking-widest ${highlight ? "text-white/40" : "text-gray-400"}`}
        >
          {label}
        </p>
      </div>
      <p
        className={`text-sm font-black uppercase tracking-tight ${highlight ? "text-white" : "text-[#19125e]"}`}
      >
        {value || "Not Mentioned"}
      </p>
    </div>
  );
}

const Sparkles = ({ size, fill }: { size: number; fill: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2L14.5 9.5H22L16 14L18.5 21.5L12 17L5.5 21.5L8 14L2 9.5H9.5L12 2Z" />
  </svg>
);
