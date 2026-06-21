"use client";

import { useEffect, useMemo, useState } from "react";
import { formatDisplayDate } from "@/lib/utils";
import { defaultPatientHistories, defaultPatients } from "../data/mock-data";
import type {
  CollectionFormInput,
  Patient,
  PatientHistory,
  TestResult,
} from "../types";

const STORAGE_KEY = "labcare-lis-demo-store-v1";

type LabCareStore = {
  patients: Patient[];
  histories: Record<string, PatientHistory>;
};

function buildEmptyTestResults(tests: string[]): TestResult[] {
  return tests.map((test) => ({
    name: test,
    result: "Pending",
    unit: "-",
    referenceRange: "-",
    date: new Date().toISOString().slice(0, 10),
    status: "Normal",
  }));
}

function createId() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `LC-2026-${random}`;
}

function createPatientFromForm(input: CollectionFormInput): {
  patient: Patient;
  history: PatientHistory;
} {
  const uhid = createId();
  const age = Number(input.age || 0);
  const today = formatDisplayDate();
  const tests = input.selectedTests.length ? input.selectedTests : ["CBC"];

  const patient: Patient = {
    uhid,
    name: input.fullName.trim(),
    age,
    gender: input.gender,
    contact: input.contact.trim(),
    email: input.email.trim(),
    tests: tests.join(", "),
    doctor: input.doctor.trim() || "Walk-in",
    status: "Collected",
    lastVisit: today,
  };

  const history: PatientHistory = {
    uhid,
    name: patient.name,
    age,
    gender: input.gender,
    contact: patient.contact,
    email: patient.email,
    doctor: patient.doctor,
    bloodGroup: "-",
    lastVisit: today,
    testResults: buildEmptyTestResults(tests),
  };

  return { patient, history };
}

export function useLabCareStore() {
  const [store, setStore] = useState<LabCareStore>({
    patients: defaultPatients,
    histories: defaultPatientHistories,
  });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (raw) {
        setStore(JSON.parse(raw) as LabCareStore);
      }
    } catch {
      setStore({
        patients: defaultPatients,
        histories: defaultPatientHistories,
      });
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [isReady, store]);

  const actions = useMemo(() => {
    return {
      addCollection(input: CollectionFormInput) {
        if (!input.fullName.trim()) {
          throw new Error("Patient full name is required.");
        }

        if (!input.contact.trim()) {
          throw new Error("Contact number is required.");
        }

        const created = createPatientFromForm(input);

        setStore((current) => ({
          patients: [created.patient, ...current.patients],
          histories: {
            ...current.histories,
            [created.patient.uhid]: created.history,
          },
        }));

        return created.patient;
      },

      resetDemoData() {
        setStore({
          patients: defaultPatients,
          histories: defaultPatientHistories,
        });

        window.localStorage.removeItem(STORAGE_KEY);
      },
    };
  }, []);

  return {
    isReady,
    patients: store.patients,
    histories: store.histories,
    ...actions,
  };
}
