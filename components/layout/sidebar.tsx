"use client";

import type { AppView } from "@/features/labcare/types";
import { cn } from "@/lib/utils";

type SidebarProps = {
  view: AppView;
  setView: (view: AppView) => void;
};

type SidebarItem = {
  label: string;
  view: AppView;
  icon: string;
  description: string;
};

const items: SidebarItem[] = [
  {
    label: "Dashboard",
    view: "dashboard",
    icon: "⌂",
    description: "My activity today",
  },
  {
    label: "Collection Registration",
    view: "collection",
    icon: "▣",
    description: "Register samples",
  },
  {
    label: "Patient List",
    view: "patients",
    icon: "♙",
    description: "Patient records",
  },
  {
    label: "Analytics",
    view: "analytics",
    icon: "▥",
    description: "Reports & KPIs",
  },
  {
    label: "Lab Entry",
    view: "labEntry",
    icon: "⚗",
    description: "Result entry",
  },
];

export function Sidebar({ view, setView }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[290px] border-r border-slate-200/80 bg-white/95 backdrop-blur lg:block">
      <div className="flex h-[78px] items-center justify-between border-b border-slate-200 px-6">
        <button
          type="button"
          onClick={() => setView("dashboard")}
          className="flex items-center gap-3 rounded-2xl px-1 py-1 text-left transition hover:opacity-80"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#9B55A0] to-[#C078C5] text-2xl text-white shadow-lg shadow-[#9B55A0]/20">
            ⚗
          </div>

          <div>
            <div className="text-xl font-black tracking-[-0.05em] text-slate-950">
              LabCare <span className="text-[#9B55A0]">LIS</span>
            </div>
            <p className="text-xs font-bold text-slate-400">Hospital Lab System</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => alert("Sidebar collapse coming soon.")}
          className="rounded-xl p-2 text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="Collapse sidebar"
        >
          ≡
        </button>
      </div>

      <nav className="space-y-2 p-4">
        <p className="mb-2 px-4 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
          Lab Workflow
        </p>

        {items.map((item) => {
          const isActive = view === item.view;

          return (
            <button
              key={item.view}
              type="button"
              onClick={() => setView(item.view)}
              className={cn(
                "group flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left text-sm transition",
                isActive
                  ? "bg-gradient-to-r from-[#9B55A0]/10 to-[#9B55A0]/10 text-[#9B55A0] ring-1 ring-[#9B55A0]/20"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg transition",
                  isActive
                    ? "bg-[#9B55A0] text-white shadow-lg shadow-[#9B55A0]/20"
                    : "bg-slate-100 text-slate-500 group-hover:bg-white",
                )}
              >
                {item.icon}
              </span>

              <span className="min-w-0">
                <span className="block truncate font-black">{item.label}</span>
                <span
                  className={cn(
                    "block truncate text-xs font-semibold",
                    isActive ? "text-[#9B55A0]" : "text-slate-400",
                  )}
                >
                  {item.description}
                </span>
              </span>
            </button>
          );
        })}

        <div className="pt-4">
          <p className="mb-2 px-4 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            System
          </p>

          <button
            type="button"
            onClick={() => alert("Settings panel coming soon.")}
            className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-lg">
              ⚙
            </span>
            <span>
              <span className="block">Settings</span>
              <span className="block text-xs font-semibold text-slate-400">
                Branch & role setup
              </span>
            </span>
          </button>
        </div>
      </nav>

      <div className="absolute bottom-20 left-4 right-4 rounded-3xl border border-[#9B55A0]/20 bg-gradient-to-br from-[#9B55A0]/10 via-white to-[#9B55A0]/10 p-5">
        <p className="text-sm font-black text-slate-900">Current Flow</p>
        <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
          Dashboard → Collection → Patient List → History.
        </p>

        <button
          type="button"
          onClick={() => setView("collection")}
          className="mt-4 w-full rounded-2xl bg-[#9B55A0] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#86408b]"
        >
          Start New Collection
        </button>
      </div>
    </aside>
  );
}
