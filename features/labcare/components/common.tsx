import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-slate-200 bg-white shadow-sm", className)}>
      {children}
    </section>
  );
}

export function Badge({
  children,
  tone = "blue",
}: {
  children: React.ReactNode;
  tone?: "blue" | "green" | "amber" | "red" | "gray";
}) {
  const tones = {
    blue: "bg-[#9B55A0]/10 text-[#9B55A0] border-[#9B55A0]/20",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    red: "bg-red-50 text-red-700 border-red-100",
    gray: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span className={cn("inline-flex rounded-lg border px-3 py-1 text-xs font-bold", tones[tone])}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  if (status === "Collected" || status === "Report Ready" || status === "Verified Today") {
    return <Badge tone="green">{status}</Badge>;
  }

  if (status === "In Progress" || status === "In Review") {
    return <Badge tone="blue">{status}</Badge>;
  }

  if (status === "Pending Entry" || status === "Registered" || status === "Pending") {
    return <Badge tone="amber">{status}</Badge>;
  }

  if (status === "Critical" || status === "Cancelled") {
    return <Badge tone="red">{status}</Badge>;
  }

  return <Badge tone="gray">{status}</Badge>;
}

export function Field({
  label,
  value,
  required,
  wide,
}: {
  label: string;
  value: string;
  required?: boolean;
  wide?: boolean;
}) {
  return (
    <label className={cn("block", wide && "md:col-span-2")}>
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {required && <span className="text-red-500">* </span>}
        {label}
      </span>
      <input
        defaultValue={value}
        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#9B55A0] focus:ring-4 focus:ring-[#9B55A0]/20"
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  required,
}: {
  label: string;
  value: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {required && <span className="text-red-500">* </span>}
        {label}
      </span>
      <select
        defaultValue={value}
        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#9B55A0] focus:ring-4 focus:ring-[#9B55A0]/20"
      >
        <option>{value}</option>
        <option>All</option>
        <option>Routine</option>
        <option>Urgent</option>
      </select>
    </label>
  );
}

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen px-4 py-7 sm:px-6 lg:ml-[290px] lg:px-8">
      <div className="mx-auto max-w-[1540px]">
        <div className="mb-6">
          <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
            {title}
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p>
        </div>
        {children}
      </div>
    </main>
  );
}

export function FilterBar({ children }: { children: React.ReactNode }) {
  return (
    <Card className="mb-6 p-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">{children}</div>
    </Card>
  );
}

export function SelectInput<T extends string>({
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
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {required && <span className="text-red-500">* </span>}
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#9B55A0] focus:ring-4 focus:ring-[#9B55A0]/20"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

export function ReadOnlyField({
  label,
  value,
  required,
}: {
  label: string;
  value: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {required && <span className="text-red-500">* </span>}
        {label}
      </span>
      <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700">
        {value}
      </div>
    </label>
  );
}

export function Input({
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
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {required && <span className="text-red-500">* </span>}
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#9B55A0] focus:ring-4 focus:ring-[#9B55A0]/20"
      />
    </label>
  );
}
