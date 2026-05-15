// CompanyProfile — overview page showing company stats and contact info.

import { Users, Award, Briefcase, Mail, Phone, Globe, MapPin, Building2 } from "lucide-react";
import { company } from "../../Data/mockData/mockData";
import "../../Components/Styles/companyProfile.css";

export default function CompanyProfile() {
  const { stats } = company;

  return (
    <div>
      <h1 className="cp__title">Company Profile</h1>

      {/* Top stat cards */}
      <div className="cp__stats">
        <StatCard
          variant="primary"
          label="Graduates Contacted"
          value={stats.graduatesContacted}
          sub="This month"
          icon={<Users size={28} />}
        />
        <StatCard
          variant="secondary"
          label="Shortlisted"
          value={stats.shortlisted}
          sub="In review"
          icon={<Award size={28} />}
        />
        <StatCard
          variant="secondary"
          label="Accepted Offers"
          value={stats.acceptedOffers}
          sub="This quarter"
          icon={<Briefcase size={28} />}
        />
      </div>

      {/* Profile card */}
      <section className="cp__card">
        <div className="cp__banner" />
        <div className="cp__avatar-wrap">
          <div className="cp__avatar">TC</div>
        </div>

        <div className="cp__header">
          <div>
            <h2 className="cp__name">{company.name}</h2>
            <div className="cp__meta">
              <span className="cp__status">{company.status}</span>
              <span className="cp__industry">{company.industry}</span>
            </div>
          </div>
          <button type="button" className="cp__edit-btn">Edit Profile</button>
        </div>

        <div className="cp__info-grid">
          <InfoRow icon={<Mail size={18} />}     label="Email Address" value={company.email} />
          <InfoRow icon={<Phone size={18} />}    label="Phone Number"  value={company.phone} />
          <InfoRow icon={<Globe size={18} />}    label="Website"       value={company.website} />
          <InfoRow icon={<MapPin size={18} />}   label="Location"      value={company.location} />
          <InfoRow icon={<Users size={18} />}    label="Company Size"  value={company.size} />
          <InfoRow icon={<Building2 size={18} />} label="Industry"     value={company.industry} />
        </div>
      </section>
    </div>
  );
}

// --- Small presentational helpers ---

interface StatCardProps {
  variant: "primary" | "secondary";
  label: string;
  value: number;
  sub: string;
  icon: React.ReactNode;
}

function StatCard({ variant, label, value, sub, icon }: StatCardProps) {
  const variantClass = variant === "primary" ? "cp__stat-card--primary" : "cp__stat-card--secondary";
  return (
    <div className={`cp__stat-card ${variantClass}`}>
      <div className="cp__stat-icon">{icon}</div>
      <div className="cp__stat-label">{label}</div>
      <div className="cp__stat-value">{value}</div>
      <div className="cp__stat-sub">{sub}</div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="cp__info-row">
      <div className="cp__info-icon">{icon}</div>
      <div>
        <div className="cp__info-label">{label}</div>
        <div className="cp__info-value">{value}</div>
      </div>
    </div>
  );
}
