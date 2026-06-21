export type AppView =
  | "dashboard"
  | "collection"
  | "patients"
  | "analytics"
  | "labEntry"
  | "patientHistory";

export type PatientStatus =
  | "Collected"
  | "In Progress"
  | "Report Ready"
  | "Registered"
  | "Cancelled";

export type Patient = {
  uhid: string;
  name: string;
  age: number;
  gender: "Male" | "Female";
  contact: string;
  email: string;
  tests: string;
  doctor: string;
  status: PatientStatus;
  lastVisit: string;
};

export type TestResultStatus = "Normal" | "Abnormal" | "Critical";

export type TestResult = {
  name: string;
  result: string;
  unit: string;
  referenceRange: string;
  date: string;
  status: TestResultStatus;
};

export type PatientHistory = {
  uhid: string;
  name: string;
  age: number;
  gender: "Male" | "Female";
  contact: string;
  email: string;
  doctor: string;
  bloodGroup: string;
  lastVisit: string;
  testResults: TestResult[];
};

export type QueueStatus = "Pending Entry" | "In Review" | "Critical";

export type QueueItem = {
  id: number;
  sampleId: string;
  patient: string;
  department: "Pathology" | "Radiology";
  test: string;
  collectedAt: string;
  assignedTo: string;
  status: QueueStatus;
};

export type SampleRow = {
  id: string;
  test: string;
  sampleType: string;
  container: string;
  volume: string;
  instructions: string;
};

export type CollectionFormInput = {
  fullName: string;
  age: string;
  gender: "Male" | "Female";
  contact: string;
  email: string;
  doctor: string;
  priority: "Routine" | "Urgent" | "STAT" | string;
  visitType: "Walk-in" | "Appointment" | "Emergency" | string;
  branch: string;
  paymentStatus: "Paid" | "Pending" | "Partial" | string;
  selectedTests: string[];
};

export type CurrentUser = {
  id: string;
  name: string;
  role: string;
  branch: string;
  initials: string;
};

export type UserActivity = {
  id: string;
  userId: string;
  time: string;
  type: "collection" | "report" | "verification" | "critical" | "draft";
  title: string;
  patient: string;
  status: string;
};

export type LoggedInUser = {
  name: string;
  username: string;
  role: string;
  branch: string;
  initials: string;
  loginTime: string;
};
