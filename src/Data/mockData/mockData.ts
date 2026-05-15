// Mock data used by the BridgeUp company dashboard.
// In a real app this would come from an API — keeping it here makes the
// pages easy to read and easy to swap with `fetch()` calls later.

import type {
  Graduate,
  ShortlistedCandidate,
  SentRequest,
  AppNotification,
} from "../../Types";

export const company = {
  name: "TechCorp Egypt",
  status: "Active",
  industry: "IT & Software",
  email: "hr@techcorp.eg",
  phone: "+20 100 000 0000",
  website: "www.techcorp.eg",
  location: "Cairo, Egypt",
  size: "51 - 200 employees",
  stats: {
    graduatesContacted: 18,
    shortlisted: 4,
    acceptedOffers: 3,
  },
};

export const graduates: Graduate[] = [
  { id: "1", initials: "AH", name: "Ahmed Hassan",  track: "Frontend Track", iqScore: 87, englishScore: 91, technicalScore: 84 },
  { id: "2", initials: "SM", name: "Sara Mahmoud",  track: "Backend Track",  iqScore: 94, englishScore: 88, technicalScore: 92 },
  { id: "3", initials: "OZ", name: "Omar Zaid",     track: "UI/UX Track",    iqScore: 81, englishScore: 90, technicalScore: 85 },
  { id: "4", initials: "LA", name: "Layla Ahmed",   track: "Full Stack Track", iqScore: 89, englishScore: 86, technicalScore: 90 },
];

export const shortlisted: ShortlistedCandidate[] = [
  { id: "1", initials: "AH", name: "Ahmed Hassan", track: "Frontend Track", addedAgo: "2 days ago" },
  { id: "2", initials: "SM", name: "Sara Mohamed", track: "Backend Track",  addedAgo: "4 days ago" },
  { id: "3", initials: "KA", name: "Khaled Ali",   track: "Frontend Track", addedAgo: "1 week ago" },
  { id: "4", initials: "NM", name: "Nour Mostafa", track: "UI/UX Track",    addedAgo: "1 week ago" },
];

export const sentRequests: SentRequest[] = [
  { id: "1", initials: "AH", name: "Ahmed Hassan",  position: "Junior Frontend Developer", status: "Pending", sentAgo: "2 days ago" },
  { id: "2", initials: "SM", name: "Sara Mohamed",  position: "Backend Developer",         status: "Pending", sentAgo: "3 days ago" },
  { id: "3", initials: "OY", name: "Omar Youssef",  position: "Frontend Developer",        status: "Accepted", sentAgo: "5 days ago" },
  { id: "4", initials: "LI", name: "Layla Ibrahim", position: "Full Stack Developer",      status: "Pending", sentAgo: "1 week ago" },
];

export const notifications: AppNotification[] = [
  {
    id: "1",
    type: "accepted",
    title: "Application Accepted",
    message: "Omar Youssef accepted your job offer for Frontend Developer position",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: "2",
    type: "match",
    title: "New Match",
    message: "A new graduate matching your criteria has registered",
    time: "3 hours ago",
    unread: true,
  },
  {
    id: "3",
    type: "rejected",
    title: "Application Rejected",
    message: "Youssef Ahmed declined your offer for Backend Developer",
    time: "1 day ago",
    unread: true,
  },
];
