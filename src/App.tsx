import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

const CHANNELS = ["general", "random", "announcements"];
const USERS = ["alice", "bob", "charlie"];

function App() {
  const [currentUser, setCurrentUser] = useState("alice");
  const [selectedChannel, setSelectedChannel] = useState("general");

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20, fontFamily: "system-ui" }}>
      <h1 style={{ marginBottom: 4 }}>Unread Tracking Demo</h1>
      <p style={{ color: "#666", marginTop: 0 }}>
        Built with{" "}
        <code style={{ background: "#f0f0f0", padding: "2px 6px", borderRadius: 4 }}>
          convex-unread-tracking
        </code>
      </p>

      <UserSelector currentUser={currentUser} onSelect={setCurrentUser} />

      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <ChannelList
          userId={currentUser}
          selected={selectedChannel}
          onSelect={setSelectedChannel}
        />
        <ChatPanel userId={currentUser} channelId={selectedChannel} />
      </div>
    </div>
  );
}

function UserSelector({
  currentUser,
  onSelect,
}: {
  currentUser: string;
  onSelect: (u: string) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <span style={{ fontWeight: 600 }}>User:</span>
      {USERS.map((u) => (
        <button
          key={u}
          onClick={() => onSelect(u)}
          style={{
            padding: "6px 16px",
            borderRadius: 20,
            border: "none",
            background: u === currentUser ? "#2563eb" : "#e5e7eb",
            color: u === currentUser ? "white" : "#333",
            cursor: "pointer",
            fontWeight: u === currentUser ? 600 : 400,
          }}
        >
          {u}
        </button>
      ))}
    </div>
  );
}

function ChannelList({
  userId,
  selected,
  onSelect,
}: {
  userId: string;
  selected: string;
  onSelect: (c: string) => void;
}) {
  const batchUnreads = useQuery(api.unreads.getBatchUnreads, {
    userId,
    channelIds: CHANNELS,
  });
  const totalUnread = useQuery(api.unreads.getTotalUnread, { userId });
  const subscribeMut = useMutation(api.unreads.subscribe);

  const unreadMap = new Map(
    batchUnreads?.map((r: any) => [r.channelId, r.count]) ?? []
  );

  return (
    <div style={{ width: 220, flexShrink: 0 }}>
      <div
        style={{
          fontWeight: 700,
          fontSize: 14,
          marginBottom: 8,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Channels</span>
        {totalUnread !== undefined && totalUnread > 0 && (
          <span
            style={{
              background: "#ef4444",
              color: "white",
              borderRadius: 10,
              padding: "1px 8px",
              fontSize: 12,
            }}
          >
            {totalUnread}
          </span>
        )}
      </div>

      {CHANNELS.map((ch) => {
        const count = unreadMap.get(ch) ?? 0;
        return (
          <div
            key={ch}
            onClick={() => onSelect(ch)}
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              cursor: "pointer",
              background: ch === selected ? "#dbeafe" : "transparent",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 2,
              fontWeight: count > 0 ? 700 : 400,
            }}
          >
            <span># {ch}</span>
            {count > 0 && (
              <span
                style={{
                  background: "#2563eb",
                  color: "white",
                  borderRadius: 10,
                  padding: "1px 8px",
                  fontSize: 12,
                  minWidth: 20,
                  textAlign: "center",
                }}
              >
                {count}
              </span>
            )}
          </div>
        );
      })}

      <button
        onClick={() => {
          CHANNELS.forEach((ch) => subscribeMut({ userId, channelId: ch }));
        }}
        style={{
          marginTop: 12,
          padding: "8px 12px",
          borderRadius: 6,
          border: "1px solid #d1d5db",
          background: "white",
          cursor: "pointer",
          width: "100%",
          fontSize: 13,
        }}
      >
        Subscribe to all
      </button>
    </div>
  );
}

function ChatPanel({
  userId,
  channelId,
}: {
  userId: string;
  channelId: string;
}) {
  const [text, setText] = useState("");
  const messages = useQuery(api.unreads.getMessages, { channelId });
  const unreadCount = useQuery(api.unreads.getUnreadCount, {
    userId,
    channelId,
  });
  const lastRead = useQuery(api.unreads.getLastRead, { userId, channelId });

  const sendMessage = useMutation(api.unreads.sendMessage);
  const markRead = useMutation(api.unreads.markRead);
  const markOneUnread = useMutation(api.unreads.markOneUnread);

  const handleSend = async () => {
    if (!text.trim()) return;
    await sendMessage({ channelId, userId, text: text.trim() });
    setText("");
  };

  const handleMarkAllRead = async () => {
    if (!messages?.length) return;
    const latest = messages[messages.length - 1].timestamp;
    await markRead({ userId, channelId, timestamp: latest });
  };

  return (
    <div style={{ flex: 1 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h2 style={{ margin: 0 }}>
          # {channelId}
          {unreadCount !== undefined && unreadCount > 0 && (
            <span
              style={{
                background: "#2563eb",
                color: "white",
                borderRadius: 10,
                padding: "2px 10px",
                fontSize: 14,
                marginLeft: 10,
                verticalAlign: "middle",
              }}
            >
              {unreadCount} unread
            </span>
          )}
        </h2>
        <button
          onClick={handleMarkAllRead}
          style={{
            padding: "6px 14px",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            background: "white",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Mark all read
        </button>
      </div>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          height: 400,
          overflowY: "auto",
          padding: 12,
          marginBottom: 12,
          background: "#fafafa",
        }}
      >
        {messages?.length === 0 && (
          <div style={{ color: "#999", textAlign: "center", marginTop: 180 }}>
            No messages yet. Send one!
          </div>
        )}
        {messages?.map((msg: any) => {
          const isUnread = lastRead != null ? msg.timestamp > lastRead : true;
          return (
            <div
              key={msg._id}
              style={{
                padding: "8px 12px",
                marginBottom: 6,
                borderRadius: 6,
                background: isUnread ? "#dbeafe" : "white",
                borderLeft: isUnread ? "3px solid #2563eb" : "3px solid transparent",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span style={{ fontWeight: 600, marginRight: 8 }}>
                  {msg.userId}
                </span>
                <span>{msg.text}</span>
                <span style={{ color: "#999", fontSize: 12, marginLeft: 8 }}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              {!isUnread && (
                <button
                  onClick={() =>
                    markOneUnread({
                      userId,
                      channelId,
                      timestamp: msg.timestamp,
                    })
                  }
                  style={{
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 4,
                    border: "1px solid #d1d5db",
                    background: "white",
                    cursor: "pointer",
                    color: "#666",
                  }}
                >
                  Mark unread
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={`Message #${channelId} as ${userId}...`}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            fontSize: 14,
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: "#2563eb",
            color: "white",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
