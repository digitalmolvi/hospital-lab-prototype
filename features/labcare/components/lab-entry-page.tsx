"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { queueItems } from "../data/mock-data";
import type { QueueItem, QueueStatus } from "../types";
import { Card, PageShell, StatusBadge } from "./common";

type LabTab = "Pathology" | "Radiology" | "Verified Queue";
type PriorityFilter = "All" | "Routine" | "Urgent" | "STAT";
type DepartmentFilter = "All Departments" | "Pathology" | "Radiology";
type QueueFilterStatus = "All" | QueueStatus | "Verified Today";

type PathologyForm = {
  sampleId: string;
  patient: string;
  test: string;
  result: string;
  unit: string;
  referenceRange: string;
  flag: "Normal" | "Low" | "High" | "Critical";
  remarks: string;
  enteredBy: string;
  verifiedBy: string;
};

type RadiologyForm = {
  studyId: string;
  patient: string;
  studyType: string;
  findings: string;
  impression: string;
  radiologist: string;
  priority: "Routine" | "Urgent" | "STAT";
  status: "Draft" | "Awaiting Signature" | "Finalized";
};

const initialPathologyForm: PathologyForm = {
  sampleId: "SM-20481",
  patient: "Hina Ahmed",
  test: "Hemoglobin",
  result: "11.8",
  unit: "g/dL",
  referenceRange: "12.0 - 15.5",
  flag: "Low",
  remarks: "Mild anemia suspected",
  enteredBy: "Lab Tech Sana",
  verifiedBy: "Dr. Bilal Khan",
};

const initialRadiologyForm: RadiologyForm = {
  studyId: "RD-9012",
  patient: "Usman Khan",
  studyType: "Chest X-Ray",
  findings: "Mild bibasal infiltrates",
  impression: "Suggestive of early infection",
  radiologist: "Dr. Areeba Iqbal",
  priority: "Routine",
  status: "Awaiting Signature",
};

function TextField({
  label,
  value,
  onChange,
  required,
  wide,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  wide?: boolean;
  multiline?: boolean;
}) {
  return (
    <label className={cn("block", wide && "md:col-span-2")}>
      <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
        {required ? <span className="text-red-500">* </span> : null}
        {label}
      </span>

      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-[#9B55A0] focus:ring-4 focus:ring-[#9B55A0]/20"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-[#9B55A0] focus:ring-4 focus:ring-[#9B55A0]/20"
        />
      )}
    </label>
  );
}

function SelectBox<T extends string>({
  label,
  value,
  options,
  onChange,
  required,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
        {required ? <span className="text-red-500">* </span> : null}
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-[#9B55A0] focus:ring-4 focus:ring-[#9B55A0]/20"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "amber" | "blue" | "green" | "red";
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-4 last:border-0">
      <span className="font-bold text-slate-700">{label}</span>
      <span
        className={cn(
          "rounded-2xl px-3 py-1 text-xl font-black",
          tone === "amber" && "bg-amber-50 text-amber-700",
          tone === "blue" && "bg-[#9B55A0]/10 text-[#9B55A0]",
          tone === "green" && "bg-emerald-50 text-emerald-700",
          tone === "red" && "bg-red-50 text-red-700",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function exportQueueCsv(rows: QueueItem[]) {
  const headers = [
    "ID",
    "Sample ID",
    "Patient",
    "Department",
    "Test",
    "Collected At",
    "Assigned To",
    "Status",
  ];

  const csv = [
    headers,
    ...rows.map((item) => [
      String(item.id),
      item.sampleId,
      item.patient,
      item.department,
      item.test,
      item.collectedAt,
      item.assignedTo,
      item.status,
    ]),
  ]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "lab-entry-queue.csv";
  link.click();

  URL.revokeObjectURL(url);
}

export function LabEntryPage() {
  const [tab, setTab] = useState<LabTab>("Pathology");
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState<DepartmentFilter>("All Departments");
  const [assignedTo, setAssignedTo] = useState("All Users");
  const [priority, setPriority] = useState<PriorityFilter>("All");
  const [status, setStatus] = useState<QueueFilterStatus>("All");
  const [selectedQueueId, setSelectedQueueId] = useState<number | null>(queueItems[0]?.id ?? null);
  const [verifiedIds, setVerifiedIds] = useState<number[]>([]);
  const [draftMessage, setDraftMessage] = useState("");
  const [pathologyForm, setPathologyForm] = useState<PathologyForm>(initialPathologyForm);
  const [radiologyForm, setRadiologyForm] = useState<RadiologyForm>(initialRadiologyForm);

  const selectedQueueItem = useMemo(() => {
    return queueItems.find((item) => item.id === selectedQueueId) ?? queueItems[0] ?? null;
  }, [selectedQueueId]);

  const filteredQueue = useMemo(() => {
    return queueItems.filter((item) => {
      const normalizedQuery = query.trim().toLowerCase();

      const currentStatus: QueueFilterStatus = verifiedIds.includes(item.id)
        ? "Verified Today"
        : item.status;

      const matchesQuery =
        !normalizedQuery ||
        item.sampleId.toLowerCase().includes(normalizedQuery) ||
        item.patient.toLowerCase().includes(normalizedQuery) ||
        item.test.toLowerCase().includes(normalizedQuery) ||
        String(item.id).includes(normalizedQuery);

      const matchesDepartment =
        department === "All Departments" || item.department === department;

      const matchesAssigned =
        assignedTo === "All Users" || item.assignedTo === assignedTo;

      const matchesStatus = status === "All" || currentStatus === status;

      const matchesPriority =
        priority === "All" ||
        (priority === "STAT" && item.status === "Critical") ||
        (priority === "Urgent" && item.status === "In Review") ||
        (priority === "Routine" && item.status === "Pending Entry");

      return matchesQuery && matchesDepartment && matchesAssigned && matchesStatus && matchesPriority;
    });
  }, [query, department, assignedTo, priority, status, verifiedIds]);

  const summary = useMemo(() => {
    return {
      pending: queueItems.filter((item) => item.status === "Pending Entry" && !verifiedIds.includes(item.id)).length,
      review: queueItems.filter((item) => item.status === "In Review" && !verifiedIds.includes(item.id)).length,
      verified: verifiedIds.length,
      critical: queueItems.filter((item) => item.status === "Critical" && !verifiedIds.includes(item.id)).length,
    };
  }, [verifiedIds]);

  const openQueueItem = (item: QueueItem) => {
    setSelectedQueueId(item.id);

    if (item.department === "Pathology") {
      setTab("Pathology");
      setPathologyForm((current) => ({
        ...current,
        sampleId: item.sampleId,
        patient: item.patient,
        test: item.test,
      }));
    } else {
      setTab("Radiology");
      setRadiologyForm((current) => ({
        ...current,
        studyId: item.sampleId.replace("SM", "RD"),
        patient: item.patient,
        studyType: item.test,
      }));
    }

    setDraftMessage(`Loaded ${item.sampleId} for ${item.patient}.`);
  };

  const savePathologyResult = () => {
    if (!pathologyForm.sampleId.trim() || !pathologyForm.result.trim()) {
      setDraftMessage("Sample ID and result are required.");
      return;
    }

    window.localStorage.setItem("labcare-pathology-draft", JSON.stringify(pathologyForm));
    setDraftMessage(`Pathology result saved for ${pathologyForm.patient}.`);
  };

  const verifyPathology = () => {
    if (!selectedQueueItem) {
      setDraftMessage("Select a queue item first.");
      return;
    }

    setVerifiedIds((current) =>
      current.includes(selectedQueueItem.id) ? current : [...current, selectedQueueItem.id],
    );
    setDraftMessage(`${selectedQueueItem.sampleId} verified successfully.`);
  };

  const saveRadiologyReport = () => {
    if (!radiologyForm.studyId.trim() || !radiologyForm.findings.trim()) {
      setDraftMessage("Study ID and findings are required.");
      return;
    }

    window.localStorage.setItem("labcare-radiology-draft", JSON.stringify(radiologyForm));
    setDraftMessage(`Radiology report saved for ${radiologyForm.patient}.`);
  };

  const finalizeRadiology = () => {
    if (!selectedQueueItem) {
      setDraftMessage("Select a radiology queue item first.");
      return;
    }

    setRadiologyForm((current) => ({ ...current, status: "Finalized" }));
    setVerifiedIds((current) =>
      current.includes(selectedQueueItem.id) ? current : [...current, selectedQueueItem.id],
    );
    setDraftMessage(`${selectedQueueItem.sampleId} finalized successfully.`);
  };

  const bulkVerify = () => {
    const ids = filteredQueue.map((item) => item.id);
    setVerifiedIds((current) => Array.from(new Set([...current, ...ids])));
    setDraftMessage(`${ids.length} queue item(s) bulk verified.`);
  };

  const clearFilters = () => {
    setQuery("");
    setDepartment("All Departments");
    setAssignedTo("All Users");
    setPriority("All");
    setStatus("All");
  };

  return (
    <PageShell
      title="Lab Entry & Verification"
      subtitle="Enter, review, verify, finalize, and manage pathology/radiology results"
    >
      <div className="mb-6 flex justify-center overflow-x-auto">
        <div className="inline-flex min-w-max overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
          {(["Pathology", "Radiology", "Verified Queue"] as LabTab[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={cn(
                "min-w-[145px] rounded-xl px-5 py-3 text-sm font-black transition",
                tab === item
                  ? "bg-[#9B55A0] text-white shadow-lg shadow-[#9B55A0]/20"
                  : "text-slate-600 hover:bg-slate-50",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <Card className="mb-6 p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.2fr_0.65fr_0.65fr_0.5fr_0.5fr_auto_auto_auto]">
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
              Search Queue
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Sample ID / Patient / Order No"
              className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none transition focus:border-[#9B55A0] focus:ring-4 focus:ring-[#9B55A0]/20"
            />
          </label>

          <SelectBox
            label="Department"
            value={department}
            options={["All Departments", "Pathology", "Radiology"]}
            onChange={setDepartment}
          />

          <SelectBox
            label="Assigned To"
            value={assignedTo}
            options={["All Users", "Lab Tech Sana", "Dr. Areeba Iqbal"]}
            onChange={setAssignedTo}
          />

          <SelectBox
            label="Priority"
            value={priority}
            options={["All", "Routine", "Urgent", "STAT"]}
            onChange={setPriority}
          />

          <SelectBox
            label="Status"
            value={status}
            options={["All", "Pending Entry", "In Review", "Critical", "Verified Today"]}
            onChange={setStatus}
          />

          <div className="flex items-end">
            <Button
              className="w-full"
              onClick={() => {
                setTab("Pathology");
                setDraftMessage("New lab entry form is ready.");
              }}
            >
              New Entry
            </Button>
          </div>

          <div className="flex items-end">
            <Button variant="outline" className="w-full" onClick={bulkVerify}>
              Bulk Verify
            </Button>
          </div>

          <div className="flex items-end">
            <Button variant="outline" className="w-full" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {draftMessage ? (
        <div className="mb-6 rounded-2xl border border-[#9B55A0]/30 bg-[#9B55A0]/10 px-5 py-4 text-sm font-black text-[#9B55A0]">
          {draftMessage}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="space-y-6">
          {tab === "Pathology" ? (
            <Card className="p-4 sm:p-6">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-black tracking-[-0.03em] text-slate-950">
                    Pathology Result Entry
                  </h3>
                  <p className="text-sm font-medium text-slate-500">
                    Selected sample: {selectedQueueItem?.sampleId ?? "None"}
                  </p>
                </div>
                <StatusBadge status={pathologyForm.flag === "Critical" ? "Critical" : "In Progress"} />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <TextField
                  label="Sample ID"
                  value={pathologyForm.sampleId}
                  required
                  onChange={(value) => setPathologyForm((current) => ({ ...current, sampleId: value }))}
                />
                <TextField
                  label="Patient"
                  value={pathologyForm.patient}
                  required
                  onChange={(value) => setPathologyForm((current) => ({ ...current, patient: value }))}
                />
                <TextField
                  label="Test"
                  value={pathologyForm.test}
                  required
                  onChange={(value) => setPathologyForm((current) => ({ ...current, test: value }))}
                />
                <TextField
                  label="Result"
                  value={pathologyForm.result}
                  required
                  onChange={(value) => setPathologyForm((current) => ({ ...current, result: value }))}
                />
                <TextField
                  label="Unit"
                  value={pathologyForm.unit}
                  onChange={(value) => setPathologyForm((current) => ({ ...current, unit: value }))}
                />
                <TextField
                  label="Reference Range"
                  value={pathologyForm.referenceRange}
                  onChange={(value) => setPathologyForm((current) => ({ ...current, referenceRange: value }))}
                />
                <SelectBox
                  label="Flag"
                  value={pathologyForm.flag}
                  options={["Normal", "Low", "High", "Critical"]}
                  onChange={(value) => setPathologyForm((current) => ({ ...current, flag: value }))}
                />
                <TextField
                  label="Remarks"
                  value={pathologyForm.remarks}
                  wide
                  onChange={(value) => setPathologyForm((current) => ({ ...current, remarks: value }))}
                />
                <TextField
                  label="Entered By"
                  value={pathologyForm.enteredBy}
                  onChange={(value) => setPathologyForm((current) => ({ ...current, enteredBy: value }))}
                />
                <TextField
                  label="Verified By"
                  value={pathologyForm.verifiedBy}
                  onChange={(value) => setPathologyForm((current) => ({ ...current, verifiedBy: value }))}
                />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Button onClick={savePathologyResult}>Save Result</Button>
                <Button variant="outline" onClick={savePathologyResult}>
                  Save Draft
                </Button>
                <Button variant="success" onClick={verifyPathology}>
                  Verify
                </Button>
              </div>
            </Card>
          ) : null}

          {tab === "Radiology" ? (
            <Card className="p-4 sm:p-6">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-black tracking-[-0.03em] text-slate-950">
                    Radiology Report Entry
                  </h3>
                  <p className="text-sm font-medium text-slate-500">
                    Finalize findings and impression for selected study.
                  </p>
                </div>
                <StatusBadge status={radiologyForm.status} />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <TextField
                  label="Study ID"
                  value={radiologyForm.studyId}
                  required
                  onChange={(value) => setRadiologyForm((current) => ({ ...current, studyId: value }))}
                />
                <TextField
                  label="Patient"
                  value={radiologyForm.patient}
                  required
                  onChange={(value) => setRadiologyForm((current) => ({ ...current, patient: value }))}
                />
                <TextField
                  label="Study Type"
                  value={radiologyForm.studyType}
                  required
                  onChange={(value) => setRadiologyForm((current) => ({ ...current, studyType: value }))}
                />
                <TextField
                  label="Findings"
                  value={radiologyForm.findings}
                  wide
                  multiline
                  onChange={(value) => setRadiologyForm((current) => ({ ...current, findings: value }))}
                />
                <TextField
                  label="Impression"
                  value={radiologyForm.impression}
                  wide
                  multiline
                  onChange={(value) => setRadiologyForm((current) => ({ ...current, impression: value }))}
                />
                <TextField
                  label="Radiologist"
                  value={radiologyForm.radiologist}
                  onChange={(value) => setRadiologyForm((current) => ({ ...current, radiologist: value }))}
                />
                <SelectBox
                  label="Priority"
                  value={radiologyForm.priority}
                  options={["Routine", "Urgent", "STAT"]}
                  onChange={(value) => setRadiologyForm((current) => ({ ...current, priority: value }))}
                />
                <SelectBox
                  label="Status"
                  value={radiologyForm.status}
                  options={["Draft", "Awaiting Signature", "Finalized"]}
                  onChange={(value) => setRadiologyForm((current) => ({ ...current, status: value }))}
                />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Button onClick={saveRadiologyReport}>Save Report</Button>
                <Button variant="outline" onClick={() => setDraftMessage("Image attachment demo coming soon.")}>
                  Attach Image
                </Button>
                <Button variant="success" onClick={finalizeRadiology}>
                  Finalize
                </Button>
              </div>
            </Card>
          ) : null}

          {tab === "Verified Queue" ? (
            <Card className="p-4 sm:p-6">
              <h3 className="mb-4 text-lg font-black tracking-[-0.03em] text-slate-950">
                Verified Queue
              </h3>

              <div className="grid gap-3">
                {queueItems
                  .filter((item) => verifiedIds.includes(item.id))
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-black text-slate-950">
                          {item.sampleId} - {item.patient}
                        </p>
                        <p className="text-sm font-semibold text-slate-500">
                          {item.department} • {item.test}
                        </p>
                      </div>
                      <StatusBadge status="Verified Today" />
                    </div>
                  ))}

                {verifiedIds.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                    <p className="font-black text-slate-800">No verified records yet</p>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      Verify a result or use Bulk Verify.
                    </p>
                  </div>
                ) : null}
              </div>
            </Card>
          ) : null}

          <Card className="overflow-hidden">
            <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-black tracking-[-0.03em] text-slate-950">
                  Pending Entry Queue
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  Click a queue row to load it into Pathology or Radiology form.
                </p>
              </div>

              <div className="flex gap-2">
                <span className="rounded-full bg-[#9B55A0]/10 px-3 py-1 text-xs font-black text-[#9B55A0]">
                  {filteredQueue.length} visible
                </span>
                <button
                  type="button"
                  onClick={() => exportQueueCsv(filteredQueue)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-black text-slate-600 hover:bg-slate-50"
                >
                  Export
                </button>
              </div>
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600">
                    {["ID", "Sample", "Patient", "Department", "Test / Study", "Collected At", "Assigned To", "Status", "Actions"].map((head) => (
                      <th key={head} className="px-4 py-4 font-black">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredQueue.map((item) => {
                    const isVerified = verifiedIds.includes(item.id);
                    const displayStatus = isVerified ? "Verified Today" : item.status;

                    return (
                      <tr
                        key={item.id}
                        className={cn(
                          "border-b border-slate-100 hover:bg-slate-50",
                          selectedQueueId === item.id && "bg-[#9B55A0]/10/60",
                        )}
                      >
                        <td className="px-4 py-4 font-bold">{item.id}</td>
                        <td className="px-4 py-4 font-bold">{item.sampleId}</td>
                        <td className="px-4 py-4">{item.patient}</td>
                        <td className="px-4 py-4">{item.department}</td>
                        <td className="px-4 py-4">{item.test}</td>
                        <td className="px-4 py-4">{item.collectedAt}</td>
                        <td className="px-4 py-4">{item.assignedTo}</td>
                        <td className="px-4 py-4">
                          <StatusBadge status={displayStatus} />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => openQueueItem(item)}
                              className="rounded-lg border border-slate-200 px-3 py-1.5 font-bold hover:bg-[#9B55A0]/10"
                            >
                              Open
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setVerifiedIds((current) =>
                                  current.includes(item.id) ? current : [...current, item.id],
                                );
                                setDraftMessage(`${item.sampleId} verified from queue.`);
                              }}
                              className="rounded-lg border border-slate-200 px-3 py-1.5 font-bold hover:bg-emerald-50"
                            >
                              Verify
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredQueue.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center">
                        <p className="font-black text-slate-800">No queue items found</p>
                        <p className="mt-1 text-sm font-medium text-slate-500">
                          Try clearing filters or changing search keyword.
                        </p>
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-4 lg:hidden">
              {filteredQueue.map((item) => {
                const isVerified = verifiedIds.includes(item.id);
                const displayStatus = isVerified ? "Verified Today" : item.status;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openQueueItem(item)}
                    className={cn(
                      "rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-[#9B55A0]/30 hover:bg-[#9B55A0]/10",
                      selectedQueueId === item.id && "border-[#9B55A0]/40 bg-[#9B55A0]/10",
                    )}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wide text-[#9B55A0]">
                          {item.sampleId}
                        </p>
                        <h3 className="text-lg font-black text-slate-950">
                          {item.patient}
                        </h3>
                      </div>
                      <StatusBadge status={displayStatus} />
                    </div>

                    <div className="grid gap-2 text-sm font-semibold text-slate-600">
                      <p>{item.department} • {item.test}</p>
                      <p>{item.collectedAt}</p>
                      <p>{item.assignedTo}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <Card className="p-5 sm:p-6">
            <h3 className="mb-5 text-lg font-black tracking-[-0.03em] text-slate-950">
              Verification Summary
            </h3>

            <SummaryCard label="Pending" value={summary.pending} tone="amber" />
            <SummaryCard label="In Review" value={summary.review} tone="blue" />
            <SummaryCard label="Verified Today" value={summary.verified} tone="green" />
            <SummaryCard label="Critical Alerts" value={summary.critical} tone="red" />

            <Button
              variant="outline"
              className="mt-6 w-full"
              onClick={() => setTab("Verified Queue")}
            >
              View Verified Queue
            </Button>
          </Card>

          <Card className="p-5 sm:p-6">
            <h3 className="mb-4 text-lg font-black tracking-[-0.03em] text-slate-950">
              Selected Queue Item
            </h3>

            {selectedQueueItem ? (
              <div className="space-y-3">
                {[
                  ["Sample", selectedQueueItem.sampleId],
                  ["Patient", selectedQueueItem.patient],
                  ["Department", selectedQueueItem.department],
                  ["Test", selectedQueueItem.test],
                  ["Assigned To", selectedQueueItem.assignedTo],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-slate-100 py-3 text-sm">
                    <span className="font-bold text-slate-500">{label}</span>
                    <span className="text-right font-black text-slate-950">{value}</span>
                  </div>
                ))}

                <Button className="w-full" onClick={() => openQueueItem(selectedQueueItem)}>
                  Load Into Form
                </Button>
              </div>
            ) : (
              <p className="text-sm font-semibold text-slate-500">
                No queue item selected.
              </p>
            )}
          </Card>
        </aside>
      </div>
    </PageShell>
  );
}
