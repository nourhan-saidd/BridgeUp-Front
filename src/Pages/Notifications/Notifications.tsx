// Notifications — feed of recent events for the company account.

import { notifications } from "../../Data/mockData/mockData";
import type { AppNotification } from "../../Types";
import "../../Components/Styles/notifications.css";

export default function Notifications() {
  return (
    <div>
      <h1 className="nt__title">Notifications</h1>

      <div className="nt__list">
        {notifications.map((n) => (
          <NotificationItem key={n.id} notification={n} />
        ))}
      </div>
    </div>
  );
}

function NotificationItem({ notification }: { notification: AppNotification }) {
  const cls = `nt__item ${notification.unread ? "nt__item--unread" : ""}`;
  return (
    <div className={cls}>
      <div>
        <div className="nt__title-text">{notification.title}</div>
        <p className="nt__message">{notification.message}</p>
        <div className="nt__time">{notification.time}</div>
      </div>
      {notification.unread && <span className="nt__dot" />}
    </div>
  );
}
