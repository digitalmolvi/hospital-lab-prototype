"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { AnalyticsPage } from "@/features/labcare/components/analytics-page";
import { CollectionPage } from "@/features/labcare/components/collection-page";
import { DashboardPage } from "@/features/labcare/components/dashboard-page";
import { LabEntryPage } from "@/features/labcare/components/lab-entry-page";
import { PatientHistoryPage } from "@/features/labcare/components/patient-history-page";
import { PatientListPage } from "@/features/labcare/components/patient-list-page";
import { useLabCareStore } from "@/features/labcare/store/use-labcare-store";
import type { AppView } from "@/features/labcare/types";

export default function LabCareLISApp() {
  const [view, setView] = useState<AppView>("dashboard");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const { patients, histories, addCollection } = useLabCareStore();

  const handleSelectPatient = (uhid: string) => {
    setSelectedPatientId(uhid);
    setView("patientHistory");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,#EFF6FF_0,#F8FAFC_38%,#F8FAFC_100%)] text-slate-900">
      <Sidebar view={view} setView={setView} />
      <Header view={view} setView={setView} />

      {view === "dashboard" && (
        <DashboardPage patients={patients} setView={setView} />
      )}

      {view === "collection" && (
        <CollectionPage
          onAddCollection={addCollection}
          onViewPatients={() => setView("patients")}
        />
      )}

      {view === "patients" && (
        <PatientListPage
          patients={patients}
          onSelectPatient={handleSelectPatient}
          onAddPatient={() => setView("collection")}
        />
      )}

      {view === "analytics" && <AnalyticsPage />}

      {view === "labEntry" && <LabEntryPage />}

      {view === "patientHistory" && (
        <PatientHistoryPage
          patientId={selectedPatientId}
          histories={histories}
          setView={setView}
        />
      )}
    </div>
  );
}
