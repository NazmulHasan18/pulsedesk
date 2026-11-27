import { Suspense } from "react";
import { InboxView } from "@/components/dashboard/inbox/inbox-view";

export default function MyConversationsPage() {
  return (
    <Suspense>
      <InboxView title="My conversations" description="Chats you are handling right now." views={["mine"]} />
    </Suspense>
  );
}
