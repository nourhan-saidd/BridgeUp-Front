import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";
import { Bell, Briefcase, Mail, CheckCircle, Clock } from "lucide-react";

type Notification = {
  _id: string;
  title?: string;
  message?: string;
  type?: string;
  isRead?: boolean;
  createdAt?: string;
};

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("jwt")
  );
}

async function getNotifications() {
  const { data } = await axiosinstance.get("/api/v1/notifications", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return data;
}

async function markAllAsRead() {
  const { data } = await axiosinstance.patch(
    "/api/v1/notifications/read-all",
    {},
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return data;
}

async function markAsRead(id: string) {
  const { data } = await axiosinstance.patch(
    `/api/v1/notifications/${id}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return data;
}

export default function NotificationPageGraduate() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const markAllMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const notifications: Notification[] =
    data?.data?.notifications || data?.notifications || data?.data || [];

  const unreadCount =
    data?.unreadCount ?? notifications.filter((item) => !item.isRead).length;

  if (isLoading) return <div className="p-8">Loading...</div>;

  if (isError) {
    return <div className="p-8 text-red-500">Error Loading Notifications</div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f7fb] p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>

        <button
          onClick={() => markAllMutation.mutate()}
          disabled={markAllMutation.isPending || unreadCount === 0}
          className="rounded-xl bg-[#5a4cc7] px-5 py-2 font-semibold text-white disabled:opacity-50"
        >
          Mark all as read
        </button>
      </div>

      <div className="mb-6 rounded-2xl border border-[#dddaf3] bg-[#f0effb] p-5 text-[#5a4cc7]">
        You have {unreadCount} unread notifications
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-[#dddaf3] bg-white p-8 text-center text-gray-500">
            No notifications found
          </div>
        ) : (
          notifications.map((item) => (
            <NotificationCard
              key={item._id}
              item={item}
              onRead={() => markReadMutation.mutate(item._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function NotificationCard({
  item,
  onRead,
}: {
  item: Notification;
  onRead: () => void;
}) {
  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(true);

    if (!item.isRead) {
      onRead();
    }
  }

  return (
    <>
      <div
        onClick={handleOpen}
        className={`flex cursor-pointer items-center justify-between rounded-2xl border p-6 shadow-sm ${
          item.isRead
            ? "border-gray-200 bg-white"
            : "border-[#c9c4f4] bg-[#f0effb]"
        }`}
      >
        <div className="flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#dedbf7] text-[#5a4cc7]">
            {getIcon(item.type)}
          </div>

          <div>
            <h2 className="font-bold text-gray-900">
              {item.title || "Notification"}
            </h2>

            <p className="mt-1 text-[#6f6d99]">
              {item.message || "No message"}
            </p>

            <p className="mt-2 text-sm text-gray-400">
              {formatDate(item.createdAt)}
            </p>
          </div>
        </div>

        {!item.isRead && (
          <span className="h-2.5 w-2.5 rounded-full bg-[#5a4cc7]" />
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Notification Details
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="text-2xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <Detail label="Title" value={item.title || "Notification"} />
              <Detail label="Message" value={item.message || "No message"} />
              <Detail label="Type" value={item.type || "General"} />
              <Detail label="Status" value={item.isRead ? "Read" : "Unread"} />
              <Detail label="Date" value={formatDate(item.createdAt)} />
            </div>

            <button
              onClick={() => setOpen(false)}
              className="mt-6 w-full rounded-xl bg-[#5a4cc7] px-5 py-2 font-medium text-white hover:bg-[#4b3fba]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-xs font-semibold text-gray-400">{label}</p>
      <p className="mt-1 text-gray-700">{value || "-"}</p>
    </div>
  );
}

function getIcon(type?: string) {
  const value = type?.toLowerCase();

  if (value?.includes("offer")) return <Briefcase size={22} />;
  if (value?.includes("assessment")) return <Clock size={22} />;
  if (value?.includes("roadmap")) return <CheckCircle size={22} />;
  if (value?.includes("message")) return <Mail size={22} />;

  return <Bell size={22} />;
}

function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleString();
}