"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, PageShell, StatusBadge } from "./common";

type ReportStatus = "All Status" | "Ready" | "Pending" | "Critical" | "Delayed";
type Department = "All Departments" | "Pathology" | "Radiology" | "Hematology" | "Biochemistry" | "Microbiology";
type Branch = "All Branches" | "Main Lab - Karachi" | "DHA Lab - Karachi" | "Gulshan Lab - Karachi";

type ReportRow = {
  id: string;
  patient: string;
  test: string;
  department: Exclude<Department, "All Departments">;
  branch: Exclude<Branch, "All Branches">;
  status: Exclude<ReportStatus, "All Status">;
  revenue: number;
  tatHours: number;
  date: string;
};

const reportRows: ReportRow[] = [
  {
    id: "RP-20481",
    patient: "Hina Ahmed",
    test: "CBC",
    department: "Hematology",
    branch: "Main Lab - Karachi",
    status: "Ready",
    revenue: 2200,
    tatHours: 3.2,
    date: "20 Aug 2026",
  },
  {
    id: "RP-20482",
    patient: "Ali Raza",
    test: "Lipid Profile",
    department: "Biochemistry",
    branch: "DHA Lab - Karachi",
    status: "Ready",
    revenue: 3800,
    tatHours: 4.1,
    date: "20 Aug 2026",
  },
  {
    id: "RP-20483",
    patient: "Fatima Noor",
    test: "TSH",
    department: "Pathology",
    branch: "Main Lab - Karachi",
    status: "Pending",
    revenue: 3000,
    tatHours: 5.5,
    date: "20 Aug 2026",
  },
  {
    id: "RP-20484",
    patient: "Usman Khan",
    test: "Chest X-Ray",
    department: "Radiology",
    branch: "Gulshan Lab - Karachi",
    status: "Delayed",
    revenue: 4500,
    tatHours: 8.4,
    date: "19 Aug 2026",
  },
  {
    id: "RP-20485",
    patient: "Ayesha Tariq",
    test: "Vitamin D",
    department: "Biochemistry",
    branch: "Main Lab - Karachi",
    status: "Critical",
    revenue: 5200,
    tatHours: 2.8,
    date: "19 Aug 2026",
  },
  {
    id: "RP-20486",
    patient: "Ahmed Javed",
    test: "Culture",
    department: "Microbiology",
    branch: "DHA Lab - Karachi",
    status: "Pending",
    revenue: 6500,
    tatHours: 12.6,
    date: "18 Aug 2026",
  },
];

const collectionTrend = [
  { label: "14 Aug", value: 58 },
  { label: "15 Aug", value: 65 },
  { label: "16 Aug", value: 52 },
  { label: "17 Aug", value: 69 },
  { label: "18 Aug", value: 78 },
  { label: "19 Aug", value: 86 },
  { label: "20 Aug", value: 82 },
];

const departmentVolume = [
  { label: "Path", value: 90 },
  { label: "Radio", value: 70 },
  { label: "Hema", value: 62 },
  { label: "Bio", value: 55 },
  { label: "Micro", value: 25 },
];

function money(value: number) {
  return `PKR ${value.toLocaleString()}`;
}

function exportCsv(rows: ReportRow[]) {
  const headers = [
    "Report ID",
    "Patient",
    "Test",
    "Department",
    "Branch",
    "Status",
    "Revenue",
    "TAT Hours",
    "Date",
  ];

  const csv = [
    headers,
    ...rows.map((row) => [
      row.id,
      row.patient,
      row.test,
      row.department,
      row.branch,
      row.status,
      String(row.revenue),
      String(row.tatHours),
      row.date,
    ]),
  ]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "labcare-analytics-report.csv";
  link.click();

  URL.revokeObjectURL(url);
}

function SelectBox<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none transition focus:border-[#9B55A0] focus:ring-4 focus:ring-[#9B55A0]/20"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function KpiCard({
  label,
  value,
  trend,
  tone,
  helper,
}: {
  label: string;
  value: string;
  trend: string;
  helper: string;
  tone: "blue" | "green" | "red" | "amber";
}) {
  return (
    <Card className="overflow-hidden p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-[-0.05em] text-slate-950">
            {value}
          </p>
          <p
            className={cn(
              "mt-3 text-xs font-black",
              tone === "red" ? "text-red-500" : "text-emerald-600",
            )}
          >
            {trend}
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-400">{helper}</p>
        </div>

        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-black text-white shadow-lg",
            tone === "blue" && "bg-[#9B55A0] shadow-[#9B55A0]/20",
            tone === "green" && "bg-emerald-500 shadow-emerald-100",
            tone === "red" && "bg-red-500 shadow-red-100",
            tone === "amber" && "bg-orange-500 shadow-orange-100",
          )}
        >
          {tone === "red" ? "!" : tone === "green" ? "$" : tone === "amber" ? "T" : "L"}
        </div>
      </div>
    </Card>
  );
}

function BarChart({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle: string;
  data: Array<{ label: string; value: number }>;
}) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-5">
        <h3 className="text-lg font-black tracking-[-0.03em] text-slate-950">
          {title}
        </h3>
        <p className="text-sm font-medium text-slate-500">{subtitle}</p>
      </div>

      <div className="flex h-72 items-end gap-3 rounded-3xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-4 sm:gap-5 sm:p-5">
        {data.map((item) => (
          <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
            <div className="flex h-52 w-full items-end rounded-2xl bg-white p-1 shadow-inner">
              <div
                className="w-full rounded-2xl bg-gradient-to-t from-[#86408b] to-[#C078C5] shadow-lg shadow-[#9B55A0]/20 transition-all"
                style={{ height: `${item.value}%` }}
              />
            </div>
            <span className="text-center text-[11px] font-black text-slate-500 sm:text-xs">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ProgressRow({
  label,
  value,
  helper,
}: {
  label: string;
  value: number;
  helper: string;
}) {
  return (
    <div className="border-b border-slate-100 py-4 last:border-0">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-black text-slate-700">{label}</span>
        <span className="text-sm font-black text-slate-950">{value}%</span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#9B55A0] to-[#C078C5]"
          style={{ width: `${value}%` }}
        />
      </div>

      <p className="mt-1 text-xs font-semibold text-slate-400">{helper}</p>
    </div>
  );
}

export function AnalyticsPage() {
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState<Branch>("All Branches");
  const [department, setDepartment] = useState<Department>("All Departments");
  const [status, setStatus] = useState<ReportStatus>("All Status");
  const [generatedAt, setGeneratedAt] = useState("Not generated yet");

  const filteredRows = useMemo(() => {
    return reportRows.filter((row) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        row.id.toLowerCase().includes(query) ||
        row.patient.toLowerCase().includes(query) ||
        row.test.toLowerCase().includes(query) ||
        row.department.toLowerCase().includes(query);

      const matchesBranch = branch === "All Branches" || row.branch === branch;
      const matchesDepartment =
        department === "All Departments" || row.department === department;
      const matchesStatus = status === "All Status" || row.status === status;

      return matchesSearch && matchesBranch && matchesDepartment && matchesStatus;
    });
  }, [search, branch, department, status]);

  const totalRevenue = filteredRows.reduce((sum, row) => sum + row.revenue, 0);
  const averageTat =
    filteredRows.length === 0
      ? 0
      : filteredRows.reduce((sum, row) => sum + row.tatHours, 0) / filteredRows.length;

  const criticalCount = filteredRows.filter((row) => row.status === "Critical").length;
  const readyCount = filteredRows.filter((row) => row.status === "Ready").length;
  const readyPercent =
    filteredRows.length === 0 ? 0 : Math.round((readyCount / filteredRows.length) * 100);

  const generateReport = () => {
    setGeneratedAt(new Date().toLocaleString());
  };

  const clearFilters = () => {
    setSearch("");
    setBranch("All Branches");
    setDepartment("All Departments");
    setStatus("All Status");
    setGeneratedAt("Not generated yet");
  };

  return (
    <PageShell
      title="Analytics & Reports"
      subtitle="Monitor lab performance, revenue, report turnaround, and operational risk"
    >
      <Card className="mb-6 overflow-hidden">
        <div className="border-b border-slate-100 bg-gradient-to-r from-[#9B55A0]/10 via-white to-[#9B55A0]/10 p-5">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-[-0.04em] text-slate-950">
                Report Control Center
              </h2>
              <p className="text-sm font-semibold text-slate-500">
                Last generated: {generatedAt}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={generateReport}>Generate Report</Button>
              <Button variant="outline" onClick={() => exportCsv(filteredRows)}>
                Export CSV
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-2 xl:grid-cols-[1.25fr_0.85fr_0.85fr_0.75fr]">
          <label>
            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
              Search
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search report ID, patient, test, department..."
              className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none transition focus:border-[#9B55A0] focus:ring-4 focus:ring-[#9B55A0]/20"
            />
          </label>

          <SelectBox
            label="Branch"
            value={branch}
            options={["All Branches", "Main Lab - Karachi", "DHA Lab - Karachi", "Gulshan Lab - Karachi"]}
            onChange={setBranch}
          />

          <SelectBox
            label="Department"
            value={department}
            options={["All Departments", "Pathology", "Radiology", "Hematology", "Biochemistry", "Microbiology"]}
            onChange={setDepartment}
          />

          <SelectBox
            label="Status"
            value={status}
            options={["All Status", "Ready", "Pending", "Critical", "Delayed"]}
            onChange={setStatus}
          />
        </div>
      </Card>

      <div className="mb-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total Reports"
          value={filteredRows.length.toString()}
          trend="+12.6% vs last 7 days"
          helper="Filtered report volume"
          tone="blue"
        />
        <KpiCard
          label="Revenue"
          value={money(totalRevenue)}
          trend="+18.4% vs last month"
          helper="Based on filtered rows"
          tone="green"
        />
        <KpiCard
          label="Average TAT"
          value={`${averageTat.toFixed(1)} hrs`}
          trend="-15.3% improvement"
          helper="Turnaround time"
          tone="amber"
        />
        <KpiCard
          label="Critical Cases"
          value={criticalCount.toString()}
          trend="+9.1% needs review"
          helper="High-priority reports"
          tone="red"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr_330px]">
        <BarChart
          title="Sample Collection Trend"
          subtitle="Daily sample volume across the selected reporting window"
          data={collectionTrend}
        />

        <BarChart
          title="Department-wise Volume"
          subtitle="Workload split by lab department"
          data={departmentVolume}
        />

        <Card className="p-5 sm:p-6">
          <h3 className="mb-1 text-lg font-black tracking-[-0.03em] text-slate-950">
            Operational Health
          </h3>
          <p className="mb-5 text-sm font-medium text-slate-500">
            Live snapshot of lab bottlenecks and service levels
          </p>

          <ProgressRow
            label="Reports Ready"
            value={readyPercent}
            helper={`${readyCount} ready out of ${filteredRows.length}`}
          />
          <ProgressRow
            label="SLA Compliance"
            value={88}
            helper="Reports delivered within expected time"
          />
          <ProgressRow
            label="Sample Quality"
            value={94}
            helper="Accepted samples without repeat collection"
          />
          <ProgressRow
            label="Machine Utilization"
            value={76}
            helper="Average analyzer usage today"
          />

          <Button variant="soft" className="mt-5 w-full" onClick={generateReport}>
            Refresh Operational Report
          </Button>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-2 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-black tracking-[-0.03em] text-slate-950">
                Filtered Report Results
              </h3>
              <p className="text-sm font-medium text-slate-500">
                Export uses exactly these visible rows.
              </p>
            </div>

            <span className="rounded-full bg-[#9B55A0]/10 px-3 py-1 text-xs font-black text-[#9B55A0]">
              {filteredRows.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600">
                  {["Report ID", "Patient", "Test", "Department", "Branch", "Revenue", "TAT", "Status"].map((head) => (
                    <th key={head} className="px-4 py-4 font-black">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-4 font-black text-slate-950">{row.id}</td>
                    <td className="px-4 py-4 font-bold text-slate-700">{row.patient}</td>
                    <td className="px-4 py-4">{row.test}</td>
                    <td className="px-4 py-4">{row.department}</td>
                    <td className="px-4 py-4">{row.branch}</td>
                    <td className="px-4 py-4 font-black">{money(row.revenue)}</td>
                    <td className="px-4 py-4">{row.tatHours} hrs</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={row.status === "Ready" ? "Report Ready" : row.status} />
                    </td>
                  </tr>
                ))}

                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <p className="font-black text-slate-800">No reports found</p>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        Try clearing filters or changing the search keyword.
                      </p>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <h3 className="mb-4 text-lg font-black tracking-[-0.03em] text-slate-950">
            Management Insights
          </h3>

          {[
            ["Overdue Samples", "37", "Review phlebotomy handoff"],
            ["Repeat Tests", "128", "Check sample rejection causes"],
            ["External Referrals", "86", "Monitor external lab SLA"],
            ["Reports Ready", `${readyPercent}%`, "Current filtered readiness"],
          ].map(([label, value, helper]) => (
            <div key={label} className="border-b border-slate-100 py-4 last:border-0">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-slate-600">{label}</span>
                <span className="text-xl font-black text-slate-950">{value}</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-400">{helper}</p>
            </div>
          ))}

          <Button
            variant="outline"
            className="mt-5 w-full"
            onClick={() => alert("Next step: connect this dashboard to real LIS APIs.")}
          >
            View Executive Summary
          </Button>
        </Card>
      </div>
    </PageShell>
  );
}
