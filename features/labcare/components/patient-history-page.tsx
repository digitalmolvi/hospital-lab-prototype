import { Button } from "@/components/ui/button";
import type { AppView, PatientHistory } from "../types";
import { Card, PageShell, StatusBadge } from "./common";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function PatientHistoryPage({
  patientId,
  histories,
  setView,
}: {
  patientId: string | null;
  histories: Record<string, PatientHistory>;
  setView: (view: AppView) => void;
}) {
  const history = patientId ? histories[patientId] : null;

  if (!history) {
    return (
      <PageShell title="Patient History" subtitle="Patient record not found">
        <Card className="p-8 text-center">
          <p className="text-sm font-semibold text-slate-500">
            No history found for this patient.
          </p>
          <Button className="mt-5" onClick={() => setView("patients")}>
            Back to Patient List
          </Button>
        </Card>
      </PageShell>
    );
  }

  const sortedResults = [...history.testResults].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <PageShell
      title="Patient Test History"
      subtitle="Complete past lab reports, results, reference ranges, and timeline"
    >
      <div className="mb-6">
        <Button variant="outline" onClick={() => setView("patients")}>
          Back to Patient List
        </Button>
      </div>

      <Card className="mb-6 p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
              {history.uhid}
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950">
              {history.name}
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Referring Doctor: {history.doctor}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {[
              ["Age", `${history.age} Years`],
              ["Gender", history.gender],
              ["Contact", history.contact],
              ["Blood Group", history.bloodGroup],
              ["Last Visit", history.lastVisit],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-bold text-slate-500">{label}</p>
                <p className="mt-1 text-sm font-black text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5">
            <h3 className="text-lg font-black text-slate-950">Past Test Results</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Newly registered collections appear here as pending test history.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600">
                  {["Test Name", "Result", "Unit", "Reference Range", "Date", "Status"].map((head) => (
                    <th key={head} className="px-5 py-4 font-black">{head}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {sortedResults.map((test) => (
                  <tr key={`${test.name}-${test.date}`} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-5 py-4 font-black text-slate-950">{test.name}</td>
                    <td className="px-5 py-4 text-lg font-black text-slate-950">{test.result}</td>
                    <td className="px-5 py-4 font-semibold text-slate-600">{test.unit}</td>
                    <td className="px-5 py-4 font-semibold text-slate-600">{test.referenceRange}</td>
                    <td className="px-5 py-4 font-semibold text-slate-600">{formatDate(test.date)}</td>
                    <td className="px-5 py-4"><StatusBadge status={test.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <h3 className="mb-5 text-lg font-black text-slate-950">Test Timeline</h3>

          {sortedResults.map((test, index) => (
            <div key={`${test.name}-${test.date}-timeline`} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-4 w-4 rounded-full bg-blue-600" />
                {index < sortedResults.length - 1 && (
                  <div className="h-16 w-0.5 bg-slate-200" />
                )}
              </div>

              <div className="pb-6">
                <p className="font-black text-slate-950">{test.name}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {test.result} {test.unit} - {formatDate(test.date)}
                </p>
                <div className="mt-2">
                  <StatusBadge status={test.status} />
                </div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </PageShell>
  );
}
