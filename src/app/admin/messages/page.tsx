import { messageTopics } from "@/lib/message-schema";
import { listMessages } from "@/lib/repo/messages";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  let messages: Awaited<ReturnType<typeof listMessages>> = [];
  let problem = "";
  try {
    messages = await listMessages();
  } catch {
    problem = "The message list could not be loaded.";
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl font-extrabold text-ink">Website messages</h1>
      <p className="mt-2 text-copy">These are the messages people send from the contact form.</p>
      {problem && <p className="mt-6 text-sm font-semibold text-[#E5231B]">{problem}</p>}
      {!problem && messages.length === 0 && <p className="mt-6 text-sm font-medium text-copy">No messages yet.</p>}
      <ul className="mt-6 space-y-3">
        {messages.map((message) => (
          <li key={message.id} className="rounded-[24px] border border-line bg-white p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-bold text-ink">{message.fullName}</h2>
              <span className="text-sm font-medium text-copy">{new Date(message.createdAt).toLocaleString("en-NG")}</span>
            </div>
              <p className="mt-1 text-sm font-semibold text-blurple">
                {messageTopics.find((item) => item.id === message.topic)?.label ?? message.topic}
              </p>
            <p className="mt-3 text-sm font-medium leading-6 text-ink">{message.body}</p>
            <p className="mt-3 text-sm text-copy">
              {message.phone}
              {message.email ? ` · ${message.email}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
