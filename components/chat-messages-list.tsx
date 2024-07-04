"use client";

import Image from "next/image";
import { useState } from "react";
import { InitialChatMessages } from "@/app/chats/[id]/page";
import { formatToTimeAgo } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";

interface ChatMessagesListProps {
  initialMessages: InitialChatMessages;
  userId: number;
}

export default function ChatMessagesList({
  initialMessages,
  userId,
}: ChatMessagesListProps) {
  const [messages, setMessages] = useState(initialMessages);
  return (
    <div className="flex flex-col p-5 gap-5">
      {messages.map((message) => {
        const isMyMessage = message.userId === userId;
        return (
          <div
            key={message.id}
            className={`flex gap-2 items-start ${
              isMyMessage ? "justify-end" : ""
            }`}
          >
            {isMyMessage ? null : message.user.avatar !== null ? (
              <Image
                src={message.user.avatar}
                alt={message.user.username}
                width={32}
                height={32}
                className="size-8 rounded-full"
              />
            ) : (
              <UserIcon className="size-8" />
            )}
            <div
              className={`flex flex-col gap-1 ${
                isMyMessage ? "items-end" : ""
              }`}
            >
              <span
                className={`${
                  isMyMessage ? "bg-neutral-500" : "bg-orange-500"
                } p-2.5 rounded-md`}
              >
                {message.payload}
              </span>
              <span className="text-xs">
                {formatToTimeAgo(message.created_at.toString())}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
