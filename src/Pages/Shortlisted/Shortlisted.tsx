// Shortlisted — list of candidates the company saved for review.

import { useState } from "react";
import { Award } from "lucide-react";
import { shortlisted as initialList } from "../../Data/mockData/mockData";
import type { ShortlistedCandidate } from "../../Types";
import "../../Components/Styles/shortlisted.css";
export default function Shortlisted() {
  const [list, setList] = useState<ShortlistedCandidate[]>(initialList);

  const handleRemove = (id: string) => {
    setList((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div>
      <h1 className="sl__title">Shortlisted Candidates</h1>

      <div className="sl__banner">
        <div className="sl__banner-icon">
          <Award size={20} />
        </div>
        <div>
          <div className="sl__banner-title">Shortlisted Candidates</div>
          <p className="sl__banner-text">
            These graduates are marked as potential candidates for your open positions
          </p>
        </div>
      </div>

      <div className="sl__list">
        {list.map((c) => (
          <CandidateRow key={c.id} candidate={c} onRemove={() => handleRemove(c.id)} />
        ))}
      </div>
    </div>
  );
}

function CandidateRow({
  candidate,
  onRemove,
}: {
  candidate: ShortlistedCandidate;
  onRemove: () => void;
}) {
  return (
    <div className="sl__item">
      <div className="sl__person">
        <div className="sl__avatar">{candidate.initials}</div>
        <div>
          <div className="sl__name">{candidate.name}</div>
          <div className="sl__row">
            <span className="sl__track">{candidate.track}</span>
            <span className="sl__added">Added {candidate.addedAgo}</span>
          </div>
        </div>
      </div>

      <div className="sl__actions">
        <button type="button" className="sl__view">View Profile</button>
        <button type="button" className="sl__send">Send Offer</button>
        <button type="button" className="sl__remove" onClick={onRemove}>
          Remove
        </button>
      </div>
    </div>
  );
}
