// Shared TypeScript types used across the dashboard pages.

export type Track = "Frontend Track" | "Backend Track" | "UI/UX Track" | "Full Stack Track";

export interface Graduate {
  id: string;
  initials: string;
  name: string;
  track: Track;
  iqScore: number;
  englishScore: number;
  technicalScore: number;
  shortlisted?: boolean;
}

export interface ShortlistedCandidate {
  id: string;
  initials: string;
  name: string;
  track: Track;
  addedAgo: string; // e.g. "2 days ago"
}

export type RequestStatus = "Pending" | "Accepted" | "Rejected";

export interface SentRequest {
  id: string;
  initials: string;
  name: string;
  position: string;
  status: RequestStatus;
  sentAgo: string;
}

export type NotificationType = "accepted" | "match" | "rejected";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}
