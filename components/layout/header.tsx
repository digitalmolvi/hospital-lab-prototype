"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { AppView, LoggedInUser } from "@/features/labcare/types";
import { cn } from "@/lib/utils";

type HeaderProps = {
  view?: AppView;
  setView: (view: AppView) => void;
  loggedInUser: LoggedInUser;
  onLogout: () => void;
};

const navItems: Array<{ label: string; value: AppView }> = [
  { label: "Dashboard", value: "dashboard" },
  { label: "Collection", value: "collection" },
  { label: "Patients", value: "patients" },
  { label: "Analytics", value: "analytics" },
  { label: "Lab Entry", value: "labEntry" },
];

export function Header({
  view = "dashboard",
  setView,
  loggedInUser,
  onLogout,
}: HeaderProps) {
  const [search, setSearch] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isSearchShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

      if (!isSearchShortcut) return;

      event.preventDefault();
      document.getElementById("labcare-global-search")?.focus();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const runSearch = () => {
    const value = search.trim().toLowerCase();

    if (!value) return;

    if (value.includes("dashboard") || value.includes("activity")) {
      setView("dashboard");
      return;
    }

    if (value.includes("patient") || value.includes("uhid") || value.includes("phone")) {
      setView("patients");
      return;
    }

    if (value.includes("analytics") || value.includes("report")) {
      setView("analytics");
      return;
    }

    if (value.includes("lab") || value.includes("entry") || value.includes("sample")) {
      setView("labEntry");
      return;
    }

    setView("patients");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur lg:ml-[290px]">
      <div className="flex min-h-[78px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#9B55A0]/10 text-xl text-[#9B55A0] lg:hidden">
            ⚗
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              runSearch();
            }}
            className="flex w-full max-w-[720px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus-within:border-[#9B55A0] focus-within:ring-4 focus-within:ring-[#9B55A0]/20"
          >
            <span className="text-slate-400">⌕</span>

            <input
              id="labcare-global-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search patient, UHID, sample, report..."
              className="w-full min-w-0 bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
            />

            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="rounded-lg px-2 py-1 text-xs font-black text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                Clear
              </button>
            ) : (
              <span className="hidden rounded-lg bg-slate-100 px-2 py-1 text-xs font-black text-slate-500 sm:inline">
                ⌘ K
              </span>
            )}
          </form>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-xl shadow-sm hover:bg-slate-50"
            onClick={() => alert("3 notifications: 2 pending samples, 1 critical case.")}
          >
            🔔
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#9B55A0] text-[10px] font-black text-white">
              3
            </span>
          </button>

          <Button onClick={() => setView("collection")}>New Collection</Button>

          <Button variant="outline" onClick={() => setView("dashboard")}>
            My Dashboard
          </Button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu((current) => !current)}
              className="flex items-center gap-3 rounded-2xl border border-transparent px-2 py-1.5 hover:border-slate-200 hover:bg-slate-50"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#9B55A0] to-[#C078C5] text-sm font-black text-white">
                {loggedInUser.initials}
              </div>

              <div className="hidden text-left xl:block">
                <p className="text-sm font-black text-slate-950">{loggedInUser.name}</p>
                <p className="text-xs font-semibold text-slate-500">{loggedInUser.role}</p>
              </div>

              <span className="text-slate-500">⌄</span>
            </button>

            {showUserMenu ? (
              <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                <div className="border-b border-slate-100 px-3 py-3">
                  <p className="text-sm font-black text-slate-950">{loggedInUser.name}</p>
                  <p className="text-xs font-semibold text-slate-500">{loggedInUser.branch}</p>
                  <p className="mt-1 text-[11px] font-semibold text-slate-400">
                    Login: {loggedInUser.loginTime}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setView("dashboard");
                    setShowUserMenu(false);
                  }}
                  className="mt-2 block w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  My Dashboard
                </button>

                <button
                  type="button"
                  onClick={() => setShowUserMenu(false)}
                  className="block w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Account Settings
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  className="block w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 pb-4 lg:hidden">
        {navItems.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setView(item.value)}
            className={cn(
              "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-black transition",
              view === item.value
                ? "border-[#9B55A0]/40 bg-[#9B55A0]/10 text-[#9B55A0]"
                : "border-slate-200 bg-white text-slate-600",
            )}
          >
            {item.label}
          </button>
        ))}

        <button
          type="button"
          onClick={onLogout}
          className="whitespace-nowrap rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-black text-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
