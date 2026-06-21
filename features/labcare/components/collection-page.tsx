"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sampleRows } from "../data/mock-data";
import type { CollectionFormInput, Patient } from "../types";
import { Card, PageShell, StatusBadge } from "./common";

const availableTests = [
  "Complete Blood Count",
  "Lipid Profile",
  "HbA1c",
  "Liver Function Test",
  "Kidney Function Test",
  "TSH",
  "Vitamin D",
  "Chest X-Ray",
];

const initialForm: CollectionFormInput = {
  fullName: "Sara Ahmed",
  age: "34",
  gender: "Female",
  contact: "+92 300 4456789",
  email: "sara.ahmed@example.com",
  doctor: "Dr. Hina Malik",
  priority: "Urgent",
  visitType: "Walk-in",
  branch: "Main Lab - Karachi",
  paymentStatus: "Paid",
  selectedTests: ["Complete Blood Count", "Lipid Profile", "HbA1c"],
};

function TextField({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
        {required ? <span className="text-red-500">* </span> : null}
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-[#9B55A0] focus:ring-4 focus:ring-[#9B55A0]/20"
      />
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
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-[#9B55A0] focus:ring-4 focus:ring-[#9B55A0]/20"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function ReadOnlyBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <div className="flex h-12 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black text-slate-800">
        {value}
      </div>
    </div>
  );
}

export function CollectionPage({
  onAddCollection,
  onViewPatients,
}: {
  onAddCollection: (input: CollectionFormInput) => Patient;
  onViewPatients: () => void;
}) {
  const [form, setForm] = useState<CollectionFormInput>(initialForm);
  const [customTest, setCustomTest] = useState("");
  const [createdPatient, setCreatedPatient] = useState<Patient | null>(null);
  const [error, setError] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);

  const tokenNumber = useMemo(() => {
    if (createdPatient) {
      return `C-${createdPatient.uhid.slice(-4)}`;
    }

    return `C-${Math.floor(100 + form.fullName.length * 7 + form.selectedTests.length * 11)}`;
  }, [createdPatient, form.fullName.length, form.selectedTests.length]);

  const selectedSampleRows = useMemo(() => {
    return sampleRows.filter((row) =>
      form.selectedTests.some((test) =>
        row.test.toLowerCase().includes(test.toLowerCase().split(" ")[0]),
      ),
    );
  }, [form.selectedTests]);

  const updateForm = <K extends keyof CollectionFormInput>(
    key: K,
    value: CollectionFormInput[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
    setDraftSaved(false);
  };

  const toggleTest = (test: string) => {
    setForm((current) => {
      const exists = current.selectedTests.includes(test);

      return {
        ...current,
        selectedTests: exists
          ? current.selectedTests.filter((item) => item !== test)
          : [...current.selectedTests, test],
      };
    });

    setError("");
    setDraftSaved(false);
  };

  const addCustomTest = () => {
    const cleanTest = customTest.trim();

    if (!cleanTest) {
      setError("Enter a test name before adding.");
      return;
    }

    if (form.selectedTests.includes(cleanTest)) {
      setError("This test is already selected.");
      return;
    }

    setForm((current) => ({
      ...current,
      selectedTests: [...current.selectedTests, cleanTest],
    }));

    setCustomTest("");
    setError("");
    setDraftSaved(false);
  };

  const validateForm = () => {
    if (!form.fullName.trim()) return "Full name is required.";
    if (!form.age.trim()) return "Age is required.";
    if (!form.contact.trim()) return "Contact number is required.";
    if (form.selectedTests.length === 0) return "Select at least one test.";
    return "";
  };

  const handleRegister = () => {
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const patient = onAddCollection(form);
      setCreatedPatient(patient);
      setError("");
      setDraftSaved(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to register collection.");
    }
  };

  const handleSaveDraft = () => {
    window.localStorage.setItem("labcare-collection-draft", JSON.stringify(form));
    setDraftSaved(true);
    setError("");
  };

  const handleLoadDraft = () => {
    const rawDraft = window.localStorage.getItem("labcare-collection-draft");

    if (!rawDraft) {
      setError("No saved draft found.");
      return;
    }

    setForm(JSON.parse(rawDraft) as CollectionFormInput);
    setDraftSaved(false);
    setCreatedPatient(null);
    setError("");
  };

  const handleReset = () => {
    setForm(initialForm);
    setCustomTest("");
    setCreatedPatient(null);
    setError("");
    setDraftSaved(false);
  };

  const handlePrintLabels = () => {
    window.print();
  };

  return (
    <PageShell
      title="Patient Collection Registration"
      subtitle="Register patient, collect samples, generate barcode, and add data into live mock store"
    >
      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_auto_auto]">
        <Card className="p-4">
          <ReadOnlyBox label="Today" value="20 Aug 2026" />
        </Card>

        <Card className="p-4">
          <ReadOnlyBox label="Branch" value={form.branch} />
        </Card>

        <Card className="p-4">
          <ReadOnlyBox label="Priority" value={form.priority} />
        </Card>

        <Card className="p-4">
          <ReadOnlyBox label="Status" value={createdPatient ? "Collected" : "Draft"} />
        </Card>

        <Button variant="outline" className="h-full min-h-16" onClick={handleLoadDraft}>
          Load Draft
        </Button>

        <Button variant="outline" className="h-full min-h-16" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {error ? (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-black text-red-700">
          {error}
        </div>
      ) : null}

      {draftSaved ? (
        <div className="mb-6 rounded-2xl border border-[#9B55A0]/30 bg-[#9B55A0]/10 px-5 py-4 text-sm font-black text-[#9B55A0]">
          Draft saved successfully.
        </div>
      ) : null}

      {createdPatient ? (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-black text-emerald-800">
                Collection registered for {createdPatient.name}
              </p>
              <p className="text-sm font-bold text-emerald-700">
                Patient ID {createdPatient.uhid} is now available in Patient List and Patient History.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" onClick={handlePrintLabels}>
                Print Labels
              </Button>
              <Button onClick={onViewPatients}>
                View Patient List
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px] 2xl:grid-cols-[minmax(0,1fr)_470px]">
        <div className="space-y-6">
          <Card className="p-4 sm:p-6">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-black tracking-[-0.03em] text-slate-950">
                  Patient & Collection Information
                </h2>
                <p className="text-sm font-medium text-slate-500">
                  All fields update the collection summary in real time.
                </p>
              </div>

              <span className="rounded-full bg-[#9B55A0]/10 px-3 py-1 text-xs font-black text-[#9B55A0]">
                {createdPatient?.uhid || "Auto ID"}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
              <TextField
                label="Full Name"
                value={form.fullName}
                required
                onChange={(value) => updateForm("fullName", value)}
              />

              <TextField
                label="Age"
                value={form.age}
                required
                type="number"
                onChange={(value) => updateForm("age", value)}
              />

              <SelectBox
                label="Gender"
                value={form.gender}
                required
                options={["Female", "Male"]}
                onChange={(value) => updateForm("gender", value)}
              />

              <TextField
                label="Contact Number"
                value={form.contact}
                required
                onChange={(value) => updateForm("contact", value)}
              />

              <TextField
                label="Email"
                value={form.email}
                onChange={(value) => updateForm("email", value)}
              />

              <TextField
                label="Referring Doctor"
                value={form.doctor}
                onChange={(value) => updateForm("doctor", value)}
              />

              <SelectBox
                label="Visit Type"
                value={form.visitType}
                options={["Walk-in", "Appointment", "Emergency"]}
                onChange={(value) => updateForm("visitType", value)}
              />

              <SelectBox
                label="Priority"
                value={form.priority}
                required
                options={["Routine", "Urgent", "STAT"]}
                onChange={(value) => updateForm("priority", value)}
              />

              <SelectBox
                label="Branch"
                value={form.branch}
                options={["Main Lab - Karachi", "DHA Lab - Karachi", "Gulshan Lab - Karachi"]}
                onChange={(value) => updateForm("branch", value)}
              />

              <SelectBox
                label="Payment Status"
                value={form.paymentStatus}
                required
                options={["Paid", "Pending", "Partial"]}
                onChange={(value) => updateForm("paymentStatus", value)}
              />
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-xl font-black tracking-[-0.03em] text-slate-950">
                  Tests Requested
                </h2>
                <p className="text-sm font-medium text-slate-500">
                  Toggle tests or add a custom investigation.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={customTest}
                  onChange={(event) => setCustomTest(event.target.value)}
                  placeholder="Add custom test"
                  className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-bold outline-none focus:border-[#9B55A0] focus:ring-4 focus:ring-[#9B55A0]/20"
                />
                <Button variant="outline" onClick={addCustomTest}>
                  Add Test
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {availableTests.map((test) => {
                const checked = form.selectedTests.includes(test);

                return (
                  <button
                    key={test}
                    type="button"
                    onClick={() => toggleTest(test)}
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-sm font-black transition",
                      checked
                        ? "border-[#9B55A0]/40 bg-[#9B55A0]/10 text-[#9B55A0] shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-[#9B55A0]/30 hover:bg-[#9B55A0]/10",
                    )}
                  >
                    {checked ? "Selected - " : "Add - "}
                    {test}
                  </button>
                );
              })}

              {form.selectedTests
                .filter((test) => !availableTests.includes(test))
                .map((test) => (
                  <button
                    key={test}
                    type="button"
                    onClick={() => toggleTest(test)}
                    className="rounded-2xl border border-violet-300 bg-violet-50 px-4 py-3 text-sm font-black text-violet-700"
                  >
                    Custom - {test}
                  </button>
                ))}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b border-slate-100 p-4 sm:p-6">
              <h2 className="text-xl font-black tracking-[-0.03em] text-slate-950">
                Sample Collection Details
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Table scrolls horizontally on small screens.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600">
                    {["#", "Test", "Sample Type", "Container / Tube", "Volume", "Instructions"].map((head) => (
                      <th key={head} className="px-4 py-4 font-black">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {(selectedSampleRows.length ? selectedSampleRows : sampleRows).map((row) => (
                    <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                      {[row.id, row.test, row.sampleType, row.container, row.volume, row.instructions].map((cell, index) => (
                        <td
                          key={`${row.id}-${cell}`}
                          className={cn("px-4 py-4", index === 1 && "font-black text-slate-900")}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="sticky bottom-0 z-20 -mx-4 border-t border-slate-200 bg-[#F8FAFC]/95 p-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
            <div className="grid gap-3 sm:grid-cols-3">
              <Button size="lg" onClick={handleRegister}>
                Register & Print Label
              </Button>
              <Button size="lg" variant="outline" onClick={handleSaveDraft}>
                Save Draft
              </Button>
              <Button size="lg" variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </div>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <Card className="p-4 sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black tracking-[-0.03em] text-slate-950">
                Collection Summary
              </h2>
              <StatusBadge status={createdPatient ? "Collected" : "Registered"} />
            </div>

            {[
              ["Token No.", tokenNumber],
              ["Patient", form.fullName || "Not entered"],
              ["Contact", form.contact || "Not entered"],
              ["Priority", form.priority],
              ["Payment", form.paymentStatus],
              ["Expected Report", "Today 6:00 PM"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 border-b border-slate-100 py-4">
                <span className="text-sm font-bold text-slate-500">{label}</span>
                <span className="text-right text-sm font-black text-slate-950">{value}</span>
              </div>
            ))}

            <div className="mt-5">
              <p className="mb-3 text-sm font-black text-slate-700">
                Barcode / Sample Labels
              </p>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                {["01", "02"].map((code) => (
                  <div key={code} className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
                    <p className="mb-2 text-xs font-black text-slate-700">
                      {createdPatient?.uhid || "LC-2026-NEW"}
                    </p>
                    <div className="mx-auto h-10 w-full rounded bg-[repeating-linear-gradient(90deg,#111_0_2px,#fff_2px_4px,#111_4px_7px,#fff_7px_10px)]" />
                    <p className="mt-2 text-xs font-black">{tokenNumber}-{code}</p>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="mt-4 w-full" onClick={handlePrintLabels}>
                Print All Labels
              </Button>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black tracking-[-0.03em] text-slate-950">
                Selected Tests
              </h2>
              <span className="rounded-full bg-[#9B55A0]/10 px-3 py-1 text-xs font-black text-[#9B55A0]">
                {form.selectedTests.length}
              </span>
            </div>

            <div className="space-y-3">
              {form.selectedTests.map((test) => (
                <div key={test} className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-sm font-black text-slate-950">{test}</p>
                  <p className="text-xs font-semibold text-slate-500">
                    Ready for collection
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </PageShell>
  );
}
