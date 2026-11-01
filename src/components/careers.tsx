import Link from "next/link";
import { roles, site } from "@/content/site";

export function RoleList({ limit }: { limit?: number }) {
  const shown = limit ? roles.slice(0, limit) : roles;

  if (!shown.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-8">
        <p className="font-semibold">We hire selectively as the portfolio grows.</p>
        <p className="mt-2 text-sm text-muted">
          Exceptional people can reach us anytime at{" "}
          <a href={`mailto:${site.careersEmail}`} className="font-semibold text-foreground hover:text-ice-1">
            {site.careersEmail}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      {shown.map((role) => (
        <Link
          key={role.title}
          href={role.href}
          className="group flex flex-col gap-2 border-b border-border p-6 transition-colors last:border-b-0 hover:bg-surface sm:flex-row sm:items-center sm:justify-between"
        >
          <span>
            <span className="font-semibold">{role.title}</span>
            <span className="mt-1 block text-sm text-muted">{role.team}</span>
          </span>
          <span className="flex items-center gap-3 font-mono text-xs text-subtle">
            {role.location} · {role.type}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
