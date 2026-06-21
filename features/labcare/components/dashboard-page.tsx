"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { currentUser, userActivities } from "../data/mock-data";
import type { AppView, Patient, UserActivity } from "../types";
import { Card, PageShell, StatusBadge } from "./common";

type DashboardPageProps = {
  patients: Patient[];
  setView: (view: AppView) => void;
};

function activityTone(type: UserActivity["type"]) {
  if (type === "collection") return "blue";
  if (type === "report") return "green";
  if (type === "verification") return "amber";
  if (type === "critical") return "red";
  return "gray";
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
    <Card className="overflow-hidden p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-[-0.05em] text-slate-950">
            {value}
          </p>
          <p className="mt-2 text-xs font-semibold text-slate-400">{helper}</p>
        </div>

        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black text-white shadow-lg",
            tone === "blue" && "bg-[#9B55A0] shadow-[#9B55A0]/20",
            tone === "green" && "bg-emerald-500 shadow-emerald-100",
            tone === "amber" && "bg-orange-500 shadow-orange-100",
            tone === "red" && "bg-red-500 shadow-red-100",
          )}
        >
          {tone === "green" ? "✓" : tone === "red" ? "!" : tone === "amber" ? "T" : "L"}
        </div>
      </div>
    </Card>
  );
}

function MiniBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-end gap-3">
      <div className="w-16 text-xs font-black text-slate-500">{label}</div>
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#9B55A0] to-[#C078C5]"
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="w-10 text-right text-xs font-black text-slate-700">{value}%</div>
    </div>
  );
}

export function DashboardPage({ patients, setView }: DashboardPageProps) {
  const myActivities = useMemo(() => {
    return userActivities.filter((activity) => activity.userId === currentUser.id);
  }, []);

  const collectionCount = myActivities.filter(
    (activity) => activity.type === "collection",
  ).length;

  const deliveredReports = myActivities.filter(
    (activity) => activity.type === "report" && activity.status === "Delivered",
  ).length;

  const pendingActivities = myActivities.filter(
    (activity) => activity.status === "Draft" || activity.status === "Needs Review",
  ).length;

  const criticalAlerts = myActivities.filter(
    (activity) => activity.type === "critical",
  ).length;

  const collectedPatients = patients.filter((patient) => patient.status === "Collected");
  const reportReadyPatients = patients.filter((patient) => patient.status === "Report Ready");
  const inProgressPatients = patients.filter((patient) => patient.status === "In Progress");

  return (
    <PageShell
      title={`Welcome back, ${currentUser.name}`}
      subtitle={`${currentUser.role} • ${currentUser.branch} • Today's personal dashboard`}
    >
      <Card className="mb-6 overflow-hidden">
        <div className="flex flex-col gap-5 bg-gradient-to-r from-[#9B55A0] via-[#86408b] to-[#C078C5] p-5 text-white sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 text-2xl font-black ring-1 ring-white/20">
              {currentUser.initials}
            </div>

            <div>
              <p className="text-sm font-bold text-blue-100">Current Logged-in User</p>
              <h2 className="text-2xl font-black tracking-[-0.05em]">
                {currentUser.name}
              </h2>
              <p className="text-sm font-semibold text-blue-100">
                {currentUser.role}
              </p>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <Button variant="outline" onClick={() => setView("collection")}>
              New Collection
            </Button>
            <Button variant="outline" onClick={() => setView("patients")}>
              Patient List
            </Button>
            <Button variant="outline" onClick={() => setView("labEntry")}>
              Lab Entry
            </Button>
          </div>
        </div>
      </Card>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="My Collections Today"
          value={collectionCount.toString()}
          helper="Samples registered by Ahmed"
          tone="blue"
        />
        <StatCard
          label="Reports Delivered"
          value={deliveredReports.toString()}
          helper="Reports delivered by Ahmed"
          tone="green"
        />
        <StatCard
          label="Pending My Action"
          value={pendingActivities.toString()}
          helper="Drafts and review items"
          tone="amber"
        />
        <StatCard
          label="Critical Alerts"
          value={criticalAlerts.toString()}
          helper="Needs immediate attention"
          tone="red"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="space-y-6">
          <Card className="p-5 sm:p-6">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-black tracking-[-0.03em] text-slate-950">
                  Today Activity of {currentUser.name}
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  Every collection, report delivery, verification, and alert for current login user.
                </p>
              </div>

              <span className="rounded-full bg-[#9B55A0]/10 px-3 py-1 text-xs font-black text-[#9B55A0]">
                {myActivities.length} activities
              </span>
            </div>

            <div className="space-y-3">
              {myActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-[#9B55A0]/20 hover:bg-[#9B55A0]/10/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black",
                        activityTone(activity.type) === "blue" && "bg-[#9B55A0]/10 text-[#9B55A0]",
                        activityTone(activity.type) === "green" && "bg-emerald-50 text-emerald-700",
                        activityTone(activity.type) === "amber" && "bg-amber-50 text-amber-700",
                        activityTone(activity.type) === "red" && "bg-red-50 text-red-700",
                        activityTone(activity.type) === "gray" && "bg-slate-100 text-slate-600",
                      )}
                    >
                      {activity.type === "collection"
                        ? "C"
                        : activity.type === "report"
                          ? "R"
                          : activity.type === "critical"
                            ? "!"
                            : "V"}
                    </div>

                    <div>
                      <p className="font-black text-slate-950">{activity.title}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        {activity.patient} • {activity.time}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={activity.status} />
                </div>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b border-slate-100 p-5 sm:p-6">
              <h3 className="text-lg font-black tracking-[-0.03em] text-slate-950">
                Today Lab Workload Snapshot
              </h3>
              <p className="text-sm font-medium text-slate-500">
                Overall lab status, so user can compare personal activity with total work.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600">
                    {["Metric", "Count", "Description", "Action"].map((head) => (
                      <th key={head} className="px-4 py-4 font-black">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {[
                    ["Collected Patients", collectedPatients.length, "Samples collected today", "View Patients"],
                    ["Reports Ready", reportReadyPatients.length, "Ready for delivery", "Open Reports"],
                    ["In Progress", inProgressPatients.length, "Currently being processed", "Lab Entry"],
                  ].map(([metric, count, description, action]) => (
                    <tr key={String(metric)} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-4 font-black text-slate-950">{metric}</td>
                      <td className="px-4 py-4 text-xl font-black text-[#9B55A0]">{count}</td>
                      <td className="px-4 py-4 font-semibold text-slate-500">{description}</td>
                      <td className="px-4 py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (action === "Lab Entry") setView("labEntry");
                            else setView("patients");
                          }}
                        >
                          {action}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <Card className="p-5 sm:p-6">
            <h3 className="mb-1 text-lg font-black tracking-[-0.03em] text-slate-950">
              Ahmed Performance
            </h3>
            <p className="mb-5 text-sm font-medium text-slate-500">
              Personal work completion for today
            </p>

            <div className="space-y-5">
              <MiniBar label="Collect" value={82} />
              <MiniBar label="Deliver" value={68} />
              <MiniBar label="Verify" value={74} />
              <MiniBar label="SLA" value={91} />
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <h3 className="mb-4 text-lg font-black tracking-[-0.03em] text-slate-950">
              Quick Actions
            </h3>

            <div className="grid gap-3">
              <Button onClick={() => setView("collection")}>
                Register New Collection
              </Button>
              <Button variant="outline" onClick={() => setView("patients")}>
                Open Patient List
              </Button>
              <Button variant="outline" onClick={() => setView("labEntry")}>
                Enter Lab Result
              </Button>
              <Button variant="soft" onClick={() => setView("analytics")}>
                View Analytics
              </Button>
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <h3 className="mb-3 text-lg font-black tracking-[-0.03em] text-slate-950">
              Shift Summary
            </h3>

            {[
              ["Shift", "Morning"],
              ["Branch", currentUser.branch],
              ["Login User", currentUser.name],
              ["Role", currentUser.role],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b border-slate-100 py-3 text-sm">
                <span className="font-bold text-slate-500">{label}</span>
                <span className="text-right font-black text-slate-950">{value}</span>
              </div>
            ))}
          </Card>
        </aside>
      </div>
    </PageShell>
  );
}
