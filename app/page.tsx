"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { AnalyticsPage } from "@/features/labcare/components/analytics-page";
import { CollectionPage } from "@/features/labcare/components/collection-page";
import { DashboardPage } from "@/features/labcare/components/dashboard-page";
import { LabEntryPage } from "@/features/labcare/components/lab-entry-page";
import { LoginPage } from "@/features/labcare/components/login-page";
import { PatientHistoryPage } from "@/features/labcare/components/patient-history-page";
import { PatientListPage } from "@/features/labcare/components/patient-list-page";
import { useLabCareStore } from "@/features/labcare/store/use-labcare-store";
import type { AppView, LoggedInUser } from "@/features/labcare/types";

const LOGIN_STORAGE_KEY = "labcare-current-login-user";

export default function LabCareLISApp() {
  const [view, setView] = useState<AppView>("dashboard");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const { patients, histories, addCollection } = useLabCareStore();

  useEffect(() => {
    try {
      const rawUser = window.localStorage.getItem(LOGIN_STORAGE_KEY);

      if (rawUser) {
        setLoggedInUser(JSON.parse(rawUser) as LoggedInUser);
      }
    } finally {
      setAuthReady(true);
    }
  }, []);

  const handleLogin = (user: LoggedInUser) => {
    window.localStorage.setItem(LOGIN_STORAGE_KEY, JSON.stringify(user));
    setLoggedInUser(user);
    setView("dashboard");
  };

  const handleLogout = () => {
    window.localStorage.removeItem(LOGIN_STORAGE_KEY);
    setLoggedInUser(null);
    setSelectedPatientId(null);
    setView("dashboard");
  };

  const handleSelectPatient = (uhid: string) => {
    setSelectedPatientId(uhid);
    setView("patientHistory");
  };

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-sm font-black text-[#9B55A0]">
        Loading LabCare...
      </div>
    );
  }

  if (!loggedInUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,#F4E8F5_0,#F8FAFC_38%,#F8FAFC_100%)] text-slate-900">
      <Sidebar view={view} setView={setView} />
      <Header
        view={view}
        setView={setView}
        loggedInUser={loggedInUser}
        onLogout={handleLogout}
      />

      {view === "dashboard" && (
        <DashboardPage
          patients={patients}
          setView={setView}
          loggedInUser={loggedInUser}
        />
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
