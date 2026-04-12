"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export function DashboardHome({
  firstName,
}: {
  firstName?: string | null;
}) {
  return (
    <main className="studio-shell">
      <div className="cosmic-comets" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className={`comet comet-${index + 1}`} />
        ))}
      </div>

      <section className="dashboard-intro">
        <p className="section-label">DASHBOARD</p>
        <h1 className="dashboard-greeting">
          Good morning, {firstName ?? "Creator"} ☀️
        </h1>
        <p className="dashboard-subtitle">Create your first content plan to get started.</p>

        <div className="dashboard-empty-state">
          <div className="empty-state-box">
            <div className="empty-state-icon">
              <Sparkles size={24} />
            </div>
            <h2>No plans yet</h2>
            <Link className="create-plan-button" href="/dashboard/create-plan">
              + Create First Plan
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
