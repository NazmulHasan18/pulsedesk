import { Suspense } from "react";
import { InboxView } from "@/components/dashboard/inbox/inbox-view";

export default function InboxPage() {
  return (
    <Suspense>
      <InboxView
        title="Inbox"
        description="Claim waiting chats, reply live and resolve them."
        views={["waiting", "mine", "all", "resolved"]}
      />
    </Suspense>
  );
}
