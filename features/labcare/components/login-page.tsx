"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { LoggedInUser } from "../types";

type LoginPageProps = {
  onLogin: (user: LoggedInUser) => void;
};

type LookupType = "cnic" | "mobile";

const demoReport = {
  cnic: "1550312345679",
  mobile: "03001234567",
  patientName: "Ahmed Javed",
  patientId: "LC-2026-1047",
  age: "50 Years",
  gender: "Male",
  reportNo: "LAB-REP-20487",
  sampleId: "SM-20487",
  reportDate: "20 Aug 2026",
  doctor: "Dr. Imran Qureshi",
  department: "Biochemistry",
  status: "Report Ready",
  tests: [
    {
      name: "Hemoglobin",
      result: "13.8",
      unit: "g/dL",
      reference: "13.0 - 17.0",
      flag: "Normal",
    },
    {
      name: "Total Cholesterol",
      result: "218",
      unit: "mg/dL",
      reference: "< 200",
      flag: "High",
    },
    {
      name: "Fasting Glucose",
      result: "96",
      unit: "mg/dL",
      reference: "70 - 100",
      flag: "Normal",
    },
    {
      name: "ALT / SGPT",
      result: "32",
      unit: "U/L",
      reference: "7 - 56",
      flag: "Normal",
    },
  ],
};

function getInitials(value: string) {
  const clean = value.trim();

  if (!clean) return "U";

  return clean
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function cleanNumber(value: string) {
  return value.replace(/\D/g, "");
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("Ahmed Javed");
  const [password, setPassword] = useState("");

  const [lookupType, setLookupType] = useState<LookupType>("cnic");
  const [lookupValue, setLookupValue] = useState(demoReport.cnic);
  const [showReport, setShowReport] = useState(false);
  const [searchedValue, setSearchedValue] = useState("");

  const initials = useMemo(() => getInitials(username), [username]);

  const lookupLabel = lookupType === "cnic" ? "CNIC" : "Mobile Number";
  const lookupPlaceholder =
    lookupType === "cnic" ? "Enter CNIC number" : "Enter mobile number";

  const submitLogin = () => {
    const cleanName = username.trim() || "Demo User";

    onLogin({
      name: cleanName,
      username: cleanName.toLowerCase().replace(/\s+/g, "."),
      role: "Lab User",
      branch: "Main Lab",
      initials: getInitials(cleanName),
      loginTime: new Date().toLocaleString(),
    });
  };

  const changeLookupType = (type: LookupType) => {
    setLookupType(type);
    setLookupValue(type === "cnic" ? demoReport.cnic : demoReport.mobile);
    setShowReport(false);
    setSearchedValue("");
  };

  const showLabReport = () => {
    const value = cleanNumber(lookupValue);

    if (!value) {
      alert(`Please enter ${lookupLabel}.`);
      return;
    }

    setSearchedValue(value);
    setShowReport(true);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,#9B55A0_0,#F8FAFC_34%,#F8FAFC_100%)] px-4 py-8 text-slate-900">
      <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl items-start gap-8 lg:grid-cols-[minmax(0,1fr)_430px]">
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-2xl shadow-[#9B55A0]/10 backdrop-blur sm:p-8">
            <div className="mb-8 inline-flex rounded-full border border-[#9B55A0]/20 bg-[#9B55A0]/10 px-4 py-2 text-sm font-black text-[#9B55A0] shadow-sm">
              Hospital Laboratory Information System
            </div>

            <h1 className="max-w-3xl text-4xl font-black tracking-[-0.07em] text-slate-950 sm:text-5xl">
              LabCare LIS for collections, reports, analytics, and staff activity.
            </h1>

            <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-slate-600">
              Login with any username and password. This is demo login, so no validation is required.
            </p>

            <div className="mt-8 rounded-[1.75rem] border border-[#9B55A0]/20 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-black tracking-[-0.04em] text-slate-950">
                    Patient Lab Report Lookup
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    Enter CNIC or mobile number to show lab report.
                  </p>
                </div>

                <div className="flex rounded-2xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => changeLookupType("cnic")}
                    className={
                      lookupType === "cnic"
                        ? "rounded-xl bg-[#9B55A0] px-4 py-2 text-sm font-black text-white shadow"
                        : "rounded-xl px-4 py-2 text-sm font-black text-slate-600 hover:bg-white"
                    }
                  >
                    CNIC
                  </button>

                  <button
                    type="button"
                    onClick={() => changeLookupType("mobile")}
                    className={
                      lookupType === "mobile"
                        ? "rounded-xl bg-[#9B55A0] px-4 py-2 text-sm font-black text-white shadow"
                        : "rounded-xl px-4 py-2 text-sm font-black text-slate-600 hover:bg-white"
                    }
                  >
                    Mobile
                  </button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                    {lookupLabel}
                  </span>
                  <input
                    value={lookupValue}
                    onChange={(event) => setLookupValue(event.target.value)}
                    placeholder={lookupPlaceholder}
                    inputMode="numeric"
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none transition focus:border-[#9B55A0] focus:ring-4 focus:ring-[#9B55A0]/20"
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        showLabReport();
                      }
                    }}
                  />
                </label>

                <div className="flex items-end">
                  <Button
                    className="h-12 w-full bg-[#9B55A0] hover:bg-[#86408b] md:w-auto"
                    onClick={showLabReport}
                  >
                    Show Lab Report
                  </Button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs font-black">
                <span className="rounded-full bg-[#9B55A0]/10 px-3 py-2 text-slate-600">
                  Demo CNIC: <span className="text-[#9B55A0]">{demoReport.cnic}</span>
                </span>
                <span className="rounded-full bg-[#9B55A0]/10 px-3 py-2 text-slate-600">
                  Demo Mobile: <span className="text-[#9B55A0]">{demoReport.mobile}</span>
                </span>
              </div>
            </div>
          </div>

          {showReport ? (
            <section className="print-section overflow-hidden bg-white shadow-2xl">
              <div className="min-h-[297mm] p-6 sm:p-8 md:p-10">
                <div className="mb-10 flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-[#9B55A0] to-[#C078C5] text-2xl text-white">
                        ⚗
                      </div>

                      <div>
                        <p className="text-2xl font-black tracking-[-0.05em] text-slate-950">
                          LabCare <span className="text-[#9B55A0]">LIS</span>
                        </p>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          Laboratory Report
                        </p>
                      </div>
                    </div>

                    <div className="text-sm leading-6 text-slate-600">
                      <p className="font-black text-slate-950">Hospital Laboratory Services</p>
                      <p>Main Lab - Karachi, Pakistan</p>
                      <p>Phone: +92 300 0000000</p>
                      <p className="text-[#9B55A0]">reports@labcare.local</p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <h2 className="text-4xl font-black tracking-[-0.06em] text-slate-950">
                      LAB REPORT
                    </h2>
                    <p className="mt-2 text-lg font-black text-[#9B55A0]">
                      # {demoReport.reportNo}
                    </p>
                    <div className="mt-5 inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
                      {demoReport.status}
                    </div>
                  </div>
                </div>

                <div className="mb-8 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    ["Patient Name", demoReport.patientName],
                    ["Patient ID", demoReport.patientId],
                    [lookupLabel, searchedValue],
                    ["Age / Gender", `${demoReport.age} / ${demoReport.gender}`],
                    ["Sample ID", demoReport.sampleId],
                    ["Report Date", demoReport.reportDate],
                    ["Doctor", demoReport.doctor],
                    ["Department", demoReport.department],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                        {label}
                      </p>
                      <p className="mt-1 break-words text-sm font-black text-slate-950">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mb-10 overflow-hidden rounded-3xl border border-slate-200">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead className="bg-[#3e3e3e] text-white">
                      <tr>
                        {["#", "Test Name", "Result", "Unit", "Reference Range", "Flag"].map((head) => (
                          <th key={head} className="p-4 font-black">
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {demoReport.tests.map((test, index) => (
                        <tr key={test.name}>
                          <td className="p-4 font-bold">{index + 1}</td>
                          <td className="p-4 font-black text-slate-950">{test.name}</td>
                          <td className="p-4 text-lg font-black text-slate-950">{test.result}</td>
                          <td className="p-4 font-semibold text-slate-600">{test.unit}</td>
                          <td className="p-4 font-semibold text-slate-600">{test.reference}</td>
                          <td className="p-4">
                            <span
                              className={
                                test.flag === "High"
                                  ? "rounded-lg bg-amber-50 px-3 py-1 text-xs font-black text-amber-700"
                                  : "rounded-lg bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700"
                              }
                            >
                              {test.flag}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-400">
                      Clinical Notes
                    </p>
                    <p className="text-sm font-medium leading-6 text-slate-600">
                      Cholesterol is mildly above the reference range. Please consult the referring physician for medical advice and follow-up.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-slate-200 p-5">
                    <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-400">
                      Verification
                    </p>

                    <div className="flex items-center justify-between border-b border-slate-100 py-3">
                      <span className="text-sm font-bold text-slate-500">Entered By</span>
                      <span className="text-sm font-black text-slate-950">Lab Tech Sana</span>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm font-bold text-slate-500">Verified By</span>
                      <span className="text-sm font-black text-slate-950">Dr. Bilal Khan</span>
                    </div>
                  </div>
                </div>

                <div className="mt-10 border-t border-slate-200 pt-6 text-xs font-semibold leading-6 text-slate-500">
                  This is a computer-generated demo report. Results should be interpreted by a qualified doctor.
                </div>
              </div>
            </section>
          ) : (
            <section className="rounded-[2rem] border border-dashed border-[#9B55A0]/30 bg-white/80 p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#9B55A0]/10 text-3xl">
                📄
              </div>
              <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950">
                Enter CNIC or mobile number to show report
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-slate-500">
                This public lookup is demo only. Any entered CNIC or mobile number will show the sample lab report.
              </p>
            </section>
          )}

          {showReport ? (
            <div className="no-print flex flex-col gap-3 sm:flex-row">
              <Button variant="outline" onClick={printReport}>
                Print Report
              </Button>
              <Button
                className="bg-[#9B55A0] hover:bg-[#86408b]"
                onClick={() => setShowReport(false)}
              >
                Search Again
              </Button>
            </div>
          ) : null}
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-[#9B55A0]/10 sm:p-8 lg:sticky lg:top-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[#9B55A0] to-[#C078C5] text-2xl font-black text-white shadow-lg shadow-[#9B55A0]/20">
              ⚗
            </div>

            <h2 className="text-3xl font-black tracking-[-0.05em] text-slate-950">
              Staff Login
            </h2>

            <p className="mt-2 text-sm font-semibold text-slate-500">
              Enter any username and password.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                Username
              </span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter username"
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none transition focus:border-[#9B55A0] focus:ring-4 focus:ring-[#9B55A0]/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                Password
              </span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="Enter password"
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none transition focus:border-[#9B55A0] focus:ring-4 focus:ring-[#9B55A0]/20"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    submitLogin();
                  }
                }}
              />
            </label>

            <div className="rounded-3xl border border-[#9B55A0]/20 bg-[#9B55A0]/10 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#9B55A0] text-sm font-black text-white">
                  {initials}
                </div>

                <div>
                  <p className="font-black text-slate-950">
                    {username || "Demo User"}
                  </p>
                  <p className="text-sm font-semibold text-slate-500">
                    Ready to login
                  </p>
                </div>
              </div>
            </div>

            <Button
              className="h-12 w-full bg-[#9B55A0] hover:bg-[#86408b]"
              onClick={submitLogin}
            >
              Login
            </Button>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @media print {
          body {
            visibility: hidden !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .print-section,
          .print-section * {
            visibility: visible !important;
          }

          .print-section {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }

          .no-print {
            display: none !important;
          }

          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </main>
  );
}
