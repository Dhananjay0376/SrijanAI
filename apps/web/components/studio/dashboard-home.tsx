"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";

export function DashboardHome({
  firstName,
  initialCalendars = [],
}: {
  firstName?: string | null;
  initialCalendars?: any[];
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
          Good morning, {firstName ?? "Creator"}
        </h1>
        {initialCalendars.length === 0 ? (
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
        ) : (
          <div className="dashboard-grid">
            <div className="grid-header">
              <h2>Your Content Plans</h2>
              <Link className="create-plan-button-small" href="/dashboard/create-plan">
                + New Plan
              </Link>
            </div>
            <div className="plans-grid">
              {initialCalendars.map((calendar) => (
                <Link 
                  key={calendar.id} 
                  href={`/dashboard/calendar/${calendar.id}`}
                  className="plan-card-link"
                >
                  <GlassCard className="plan-card">
                    <div className="plan-card-content">
                      <div className="plan-card-month">{calendar.month}</div>
                      <div className="plan-card-year">{calendar.year}</div>
                      <div className="plan-card-stats">
                        <span>{calendar.days?.length || 0} scheduled days</span>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
