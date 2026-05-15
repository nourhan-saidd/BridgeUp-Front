// BrowseGraduates — list / filter graduates and add them to the shortlist.

import { useState } from "react";
import { Search, Star } from "lucide-react";
import { graduates as initialGraduates } from "../../Data/mockData/mockData";
import type { Graduate } from "../../Types";
import "../../Components/Styles/browseGraduates.css";

export default function BrowseGraduates() {
  // Local state: which cards are starred (shortlisted in the UI).
  const [list, setList] = useState<Graduate[]>(initialGraduates);

  const toggleStar = (id: string) => {
    setList((prev) =>
      prev.map((g) => (g.id === id ? { ...g, shortlisted: !g.shortlisted } : g)),
    );
  };

  return (
    <div>
      <h1 className="bg__title">Browse Graduates</h1>

      {/* Filters */}
      <section className="bg__filters">
        <div className="bg__filters-grid">
          <FilterSelect label="Track" options={["All Tracks", "Frontend", "Backend", "UI/UX", "Full Stack"]} />
          <FilterSelect label="English Score (min)" options={["Select Score", "60", "70", "80", "90"]} />
          <FilterSelect label="Technical Score (min)" options={["Select Score", "60", "70", "80", "90"]} />
          <FilterSelect label="IQ Score (min)" options={["Select Score", "60", "70", "80", "90"]} />
          <FilterSelect label="Gender" options={["All", "Male", "Female"]} />
          <FilterSelect label="Graduation Year" options={["All Years", "2024", "2025", "2026"]} />
        </div>
        <div className="bg__filters-actions">
          <button type="button" className="bg__clear">Clear Filters</button>
          <button type="button" className="bg__search-btn">
            <Search size={16} />
            Search
          </button>
        </div>
      </section>

      {/* Graduate cards */}
      <div className="bg__grid">
        {list.map((g) => (
          <GraduateCard key={g.id} graduate={g} onToggleStar={() => toggleStar(g.id)} />
        ))}
      </div>

      {/* Pagination (visual only) */}
      <Pagination />
    </div>
  );
}

// --- Sub-components ---

function FilterSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="bg__filter-label">{label}</label>
      <select className="bg__filter-input">
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function GraduateCard({ graduate, onToggleStar }: { graduate: Graduate; onToggleStar: () => void }) {
  return (
    <article className="bg__card">
      <div className="bg__card-top">
        <div className="bg__avatar">{graduate.initials}</div>
        <button
          type="button"
          aria-label="Add to shortlist"
          className={`bg__star ${graduate.shortlisted ? "bg__star--active" : ""}`}
          onClick={onToggleStar}
        >
          <Star size={20} fill={graduate.shortlisted ? "currentColor" : "none"} />
        </button>
      </div>

      <h3 className="bg__name">{graduate.name}</h3>
      <p className="bg__track">{graduate.track}</p>

      <ScoreBar label="IQ Score"        value={graduate.iqScore} />
      <ScoreBar label="English Score"   value={graduate.englishScore} />
      <ScoreBar label="Technical Score" value={graduate.technicalScore} />

      <button type="button" className="bg__contact-btn">Contact</button>
    </article>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg__score-row">
      <div className="bg__score-head">
        <span>{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="bg__score-bar">
        <div className="bg__score-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Pagination() {
  const pages = [1, 2, 3, "...", 12];
  return (
    <div className="bg__pagination">
      <button type="button" className="bg__page">{"<"}</button>
      {pages.map((p, i) => (
        <button
          key={i}
          type="button"
          className={`bg__page ${p === 1 ? "bg__page--active" : ""}`}
        >
          {p}
        </button>
      ))}
      <button type="button" className="bg__page">{">"}</button>
    </div>
  );
}
