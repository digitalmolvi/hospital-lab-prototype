"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Patient, PatientStatus } from "../types";
import { Card, PageShell, StatusBadge } from "./common";

type PatientListPageProps = {
  patients: Patient[];
  onSelectPatient: (uhid: string) => void;
  onAddPatient: () => void;
};

const statusOptions: Array<"All" | PatientStatus> = [
  "All",
  "Registered",
  "Collected",
  "In Progress",
  "Report Ready",
  "Cancelled",
];

const genderOptions = ["All", "Male", "Female"];
const testOptions = ["All", "CBC", "LFT", "HbA1c", "Lipid Profile", "TSH", "Vitamin D"];

function exportPatientsCsv(patients: Patient[]) {
  const headers = [
    "UHID",
    "Patient Name",
    "Age",
    "Gender",
    "Contact",
    "Email",
    "Tests",
    "Doctor",
    "Status",
    "Last Visit",
  ];

  const rows = patients.map((patient) => [
    patient.uhid,
    patient.name,
    String(patient.age),
    patient.gender,
    patient.contact,
    patient.email || "",
    patient.tests,
    patient.doctor,
    patient.status,
    patient.lastVisit,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "labcare-patients.csv";
  link.click();

  URL.revokeObjectURL(url);
}

function SelectBox({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none transition focus:border-[#9B55A0] focus:ring-4 focus:ring-[#9B55A0]/20"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function StatCard({
  label,
  value,
  helper,
  tone,
}: {
  label: string;
  value: string;
  helper: string;
  tone: "blue" | "green" | "amber" | "red";
}) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-black",
            tone === "blue" && "bg-[#9B55A0]/10 text-[#9B55A0]",
            tone === "green" && "bg-emerald-50 text-emerald-600",
            tone === "amber" && "bg-orange-50 text-orange-500",
            tone === "red" && "bg-red-50 text-red-500",
          )}
        >
          {tone === "amber" ? "P" : tone === "red" ? "!" : "L"}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-600">{label}</p>
          <p className="text-2xl font-black tracking-[-0.04em] text-slate-950">
            {value}
          </p>
          <p className="truncate text-xs font-medium text-slate-500">{helper}</p>
        </div>
      </div>
    </Card>
  );
}

export function PatientListPage({
  patients,
  onSelectPatient,
  onAddPatient,
}: PatientListPageProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | PatientStatus>("All");
  const [gender, setGender] = useState("All");
  const [testType, setTestType] = useState("All");

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const normalizedQuery = query.trim().toLowerCase();

      const matchesQuery =
        !normalizedQuery ||
        patient.name.toLowerCase().includes(normalizedQuery) ||
        patient.uhid.toLowerCase().includes(normalizedQuery) ||
        patient.contact.toLowerCase().includes(normalizedQuery) ||
        patient.doctor.toLowerCase().includes(normalizedQuery) ||
        patient.tests.toLowerCase().includes(normalizedQuery);

      const matchesStatus = status === "All" || patient.status === status;
      const matchesGender = gender === "All" || patient.gender === gender;
      const matchesTest =
        testType === "All" ||
        patient.tests.toLowerCase().includes(testType.toLowerCase());

      return matchesQuery && matchesStatus && matchesGender && matchesTest;
    });
  }, [patients, query, status, gender, testType]);

  const statusCounts = useMemo(() => {
    return {
      Registered: patients.filter((patient) => patient.status === "Registered").length,
      Collected: patients.filter((patient) => patient.status === "Collected").length,
      "In Progress": patients.filter((patient) => patient.status === "In Progress").length,
      "Report Ready": patients.filter((patient) => patient.status === "Report Ready").length,
      Cancelled: patients.filter((patient) => patient.status === "Cancelled").length,
    };
  }, [patients]);

  const clearFilters = () => {
    setQuery("");
    setStatus("All");
    setGender("All");
    setTestType("All");
  };

  return (
    <PageShell title="Patient List" subtitle="Search, filter, export, and open patient test history">
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Patients" value={patients.length.toString()} helper="Live mock store" tone="blue" />
        <StatCard label="Visible After Filters" value={filteredPatients.length.toString()} helper="Current result count" tone="green" />
        <StatCard label="Samples Collected" value={statusCounts.Collected.toString()} helper="Collection completed" tone="blue" />
        <StatCard label="Pending / Registered" value={statusCounts.Registered.toString()} helper="Awaiting collection" tone="amber" />
      </div>

      <Card className="mb-6 p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.35fr_0.55fr_0.65fr_auto_auto_auto]">
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
              Search
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by patient name, UHID, phone, doctor, test"
              className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none transition focus:border-[#9B55A0] focus:ring-4 focus:ring-[#9B55A0]/20"
            />
          </label>

          <SelectBox label="Gender" value={gender} options={genderOptions} onChange={setGender} />

          <SelectBox
            label="Status"
            value={status}
            options={statusOptions}
            onChange={(value) => setStatus(value as "All" | PatientStatus)}
          />

          <SelectBox label="Test" value={testType} options={testOptions} onChange={setTestType} />

          <div className="flex items-end">
            <Button className="w-full" onClick={onAddPatient}>
              Add Patient
            </Button>
          </div>

          <div className="flex items-end">
            <Button variant="outline" className="w-full" onClick={() => exportPatientsCsv(filteredPatients)}>
              Export
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>

          {statusOptions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStatus(item)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-black transition",
                status === item
                  ? "border-[#9B55A0]/40 bg-[#9B55A0]/10 text-[#9B55A0]"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-2 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h2 className="text-lg font-black tracking-[-0.03em] text-slate-950">
                Registered Patients
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Click patient name or View to open past test history.
              </p>
            </div>

            <span className="rounded-full bg-[#9B55A0]/10 px-3 py-1 text-xs font-black text-[#9B55A0]">
              {filteredPatients.length} records
            </span>
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600">
                  {["UHID", "Patient Name", "Age / Gender", "Contact", "Tests Ordered", "Referring Doctor", "Status", "Last Visit", "Actions"].map((head) => (
                    <th key={head} className="px-4 py-4 font-black">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.uhid} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-4 font-bold">{patient.uhid}</td>

                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => onSelectPatient(patient.uhid)}
                        className="font-black text-[#9B55A0] hover:underline"
                      >
                        {patient.name}
                      </button>
                    </td>

                    <td className="px-4 py-4">{patient.age} Years / {patient.gender}</td>
                    <td className="px-4 py-4">{patient.contact}</td>
                    <td className="px-4 py-4">{patient.tests}</td>
                    <td className="px-4 py-4">{patient.doctor}</td>

                    <td className="px-4 py-4">
                      <StatusBadge status={patient.status} />
                    </td>

                    <td className="px-4 py-4">{patient.lastVisit}</td>

                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectPatient(patient.uhid)}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 font-bold hover:bg-[#9B55A0]/10"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => alert(`Edit ${patient.name} coming soon`)}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 font-bold hover:bg-slate-50"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center">
                      <p className="font-black text-slate-800">No patients found</p>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        Try clearing filters or adding a new collection.
                      </p>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 p-4 lg:hidden">
            {filteredPatients.map((patient) => (
              <button
                key={patient.uhid}
                type="button"
                onClick={() => onSelectPatient(patient.uhid)}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-[#9B55A0]/30 hover:bg-[#9B55A0]/10"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[#9B55A0]">
                      {patient.uhid}
                    </p>
                    <h3 className="text-lg font-black text-slate-950">
                      {patient.name}
                    </h3>
                  </div>

                  <StatusBadge status={patient.status} />
                </div>

                <div className="grid gap-2 text-sm font-semibold text-slate-600">
                  <p>{patient.age} Years / {patient.gender}</p>
                  <p>{patient.contact}</p>
                  <p>{patient.tests}</p>
                  <p>{patient.doctor}</p>
                  <p>Last Visit: {patient.lastVisit}</p>
                </div>
              </button>
            ))}

            {filteredPatients.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                <p className="font-black text-slate-800">No patients found</p>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Try clearing filters or adding a new collection.
                </p>
              </div>
            ) : null}
          </div>
        </Card>

        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <Card className="p-5">
            <h3 className="mb-4 font-black text-slate-950">Quick Filters</h3>

            {[
              ["All", patients.length],
              ["Registered", statusCounts.Registered],
              ["Collected", statusCounts.Collected],
              ["In Progress", statusCounts["In Progress"]],
              ["Report Ready", statusCounts["Report Ready"]],
              ["Cancelled", statusCounts.Cancelled],
            ].map(([label, count]) => (
              <button
                key={label}
                type="button"
                onClick={() => setStatus(label as "All" | PatientStatus)}
                className={cn(
                  "flex w-full justify-between border-b border-slate-100 py-3 text-left text-sm transition hover:text-[#9B55A0]",
                  status === label ? "text-[#9B55A0]" : "text-slate-600",
                )}
              >
                <span className="font-bold">{label}</span>
                <span className="rounded-lg bg-[#9B55A0]/10 px-2 py-1 text-xs font-black text-[#9B55A0]">
                  {count}
                </span>
              </button>
            ))}
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 font-black text-slate-950">Workflow Tip</h3>
            <p className="text-sm font-medium leading-6 text-slate-500">
              New patients registered from Collection are stored in the live mock
              store and instantly appear here. Click a patient name to see their
              history.
            </p>
          </Card>
        </aside>
      </div>
    </PageShell>
  );
}
