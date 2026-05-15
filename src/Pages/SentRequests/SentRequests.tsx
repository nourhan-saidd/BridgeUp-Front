// SentRequests — job offers / contact requests sent to graduates.

import { sentRequests } from "../../Data/mockData/mockData";
import type { RequestStatus, SentRequest } from "../../Types";
import "../../Components/Styles/sentRequests.css";

export default function SentRequests() {
  return (
    <div>
      <h1 className="sr__title">Sent Requests</h1>

      <div className="sr__list">
        {sentRequests.map((r) => (
          <RequestRow key={r.id} request={r} />
        ))}
      </div>
    </div>
  );
}

function RequestRow({ request }: { request: SentRequest }) {
  return (
    <div className="sr__item">
      <div className="sr__person">
        <div className="sr__avatar">{request.initials}</div>
        <div>
          <div className="sr__name">{request.name}</div>
          <div className="sr__position">{request.position}</div>
        </div>
      </div>

      <div className="sr__right">
        <div className="sr__meta">
          <span className={`sr__status ${statusClass(request.status)}`}>{request.status}</span>
          <div className="sr__sent">Sent {request.sentAgo}</div>
        </div>
        <button type="button" className="sr__follow">Follow Up</button>
      </div>
    </div>
  );
}

// Map a status string -> the matching CSS modifier class.
function statusClass(status: RequestStatus) {
  switch (status) {
    case "Pending":  return "sr__status--pending";
    case "Accepted": return "sr__status--accepted";
    case "Rejected": return "sr__status--rejected";
  }
}
