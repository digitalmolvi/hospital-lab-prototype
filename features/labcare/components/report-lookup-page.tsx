"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type ReportLookupPageProps = {
  onContinueToLogin: () => void;
};

const demoReport = {
  nic: "1550312345679",
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

export function ReportLookupPage({ onContinueToLogin }: ReportLookupPageProps) {
  const [nic, setNic] = useState(demoReport.nic);
  const [showReport, setShowReport] = useState(true);

  const handleSearch = () => {
    setShowReport(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,#9B55A0_0,#F8FAFC_34%,#F8FAFC_100%)] px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="no-print mb-8 flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-xl shadow-[#9B55A0]/10 backdrop-blur sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full border border-[#9B55A0]/20 bg-[#9B55A0]/10 px-4 py-2 text-sm font-black text-[#9B55A0]">
              LabCare LIS Public Report Lookup
            </div>

            <h1 className="text-3xl font-black tracking-[-0.05em] text-slate-950 sm:text-4xl">
              LabCare LIS for collections, reports, analytics, and staff activity.
            </h1>

            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
              Enter patient NIC to preview a demo lab report. For now, use demo NIC:
              <span className="ml-1 font-black text-[#9B55A0]">{demoReport.nic}</span>
            </p>
          </div>

          <div className="w-full rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:max-w-sm">
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                Patient NIC
              </span>
              <input
                value={nic}
                onChange={(event) => setNic(event.target.value)}
                placeholder="Enter NIC number"
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none transition focus:border-[#9B55A0] focus:ring-4 focus:ring-[#9B55A0]/20"
              />
            </label>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Button className="bg-[#9B55A0] hover:bg-[#86408b]" onClick={handleSearch}>
                Show Report
              </Button>
              <Button variant="outline" onClick={onContinueToLogin}>
                Staff Login
              </Button>
            </div>
          </div>
        </div>

        {showReport ? (
          <section className="print-section mx-auto max-w-5xl overflow-hidden bg-white shadow-2xl">
            <div className="min-h-[297mm] p-6 sm:p-8 md:p-12">
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
                  ["NIC", nic || demoReport.nic],
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
                    <p className="mt-1 text-sm font-black text-slate-950">{value}</p>
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
                    Cholesterol is mildly above the reference range. Please consult
                    the referring physician for medical advice and follow-up.
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
        ) : null}

        <div className="no-print mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={handlePrint}>
            Print Report
          </Button>
          <Button className="bg-[#9B55A0] hover:bg-[#86408b]" onClick={onContinueToLogin}>
            Continue to Login
          </Button>
        </div>
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
