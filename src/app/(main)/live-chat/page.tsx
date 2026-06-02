"use client";

import { useEffect, useState, useRef } from "react";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import { ChatClient, ChatThreadClient, ChatMessageReceivedEvent } from "@azure/communication-chat";
import { Send } from "lucide-react";
import { apiFetch } from "@/services/api-client";

// CONSTANTS
const CHAT_API_URL = "https://azure-chat-webapp-crf4ded2dzf0b5d0.swedencentral-01.azurewebsites.net";
const COURSE_ID = "a4b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c2e"; // keep course id for general chat

// INTERFACES 
interface ChatRoomResponse {
  azureThreadId: string;
  endpoint: string;
  acsUserId: string;
  token: string;
  expiresOn: string;
}

interface Message {
  sender: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

// HELPERS
function parseJwt(token: string) {
  const base64 = token.split(".")[1];
  return JSON.parse(atob(base64));
}

function getCurrentTime() {
  return new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
}

export default function LiveChat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [chatThreadClient, setChatThreadClient] = useState<ChatThreadClient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // EFFECT: Get token and username from session storage
  useEffect(() => {
    const jwt = sessionStorage.getItem("token");
    if (!jwt) return;

    try {
      const decoded = parseJwt(jwt);
      setUserToken(jwt);
      setUsername(decoded.email || "Class mate");
    } catch (err) {
      console.error("Could not parse token", err);
    }
  }, []);

  // EFFECT: Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // EFFECT: Initialize Azure Chat when token is available
  useEffect(() => {
    if (!userToken || !username) return;

    let mounted = true;

    async function initAzureChat() {
      try {
        setLoading(true);
        setError(null);

        // Call backend to join global chat
        const response = await apiFetch(`${CHAT_API_URL}/api/chat/join/${COURSE_ID}`, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`,
          },
        });

        if (!response.ok) throw new Error(`API-error: ${response.status}`);

        const data: ChatRoomResponse = await response.json();

        console.log("ACS USER:", data.acsUserId);
        console.log("TOKEN EXPIRES:", data.expiresOn);

        // Initialize ACS chat client with flat object data
        const tokenCredential = new AzureCommunicationTokenCredential(data.token);
        const chatClient = new ChatClient(data.endpoint, tokenCredential);
        const threadClient = chatClient.getChatThreadClient(data.azureThreadId);

        // Verify thread access
        await threadClient.getProperties();

        if (!mounted) return;

        setChatThreadClient(threadClient);

        // LOAD OLD MESSAGES
        const history: Message[] = [];

        for await (const msg of threadClient.listMessages()) {
          if (msg.type !== "text") continue;

          history.push({
            sender: msg.senderDisplayName || "Unknown",
            text: msg.content?.message || "",
            isMe: (msg.sender as any)?.communicationUserId === data.acsUserId,
            timestamp: new Date(msg.createdOn!).toLocaleTimeString("sv-SE", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          });
        }

        // ACS returns newest first, flip it
        history.reverse();
        setMessages(history);

        // Start real time notifications
        await chatClient.startRealtimeNotifications();

        chatClient.on("chatMessageReceived", (e: ChatMessageReceivedEvent) => {
          if (e.threadId !== data.azureThreadId) return;
          if ((e.sender as any)?.communicationUserId === data.acsUserId) return;

          setMessages((prev) => [
            ...prev,
            {
              sender: e.senderDisplayName || "Class mate",
              text: e.message || "",
              isMe: false,
              timestamp: new Date(e.createdOn!).toLocaleTimeString("sv-SE", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
        });

        // System message to confirm connection
        setMessages((prev) => [
          ...prev,
          {
            sender: "System",
            text: "Connected to chat!",
            isMe: false,
            timestamp: getCurrentTime(),
          },
        ]);

      } catch (err: any) {
        console.error(err);
        if (mounted) {
          setError(err?.message || "Could not connect to chat..");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAzureChat();

    return () => {
      mounted = false;
    };
  }, [userToken, username]);

  // Handle send-message
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputText.trim() || !chatThreadClient) return;

    try {
      await chatThreadClient.sendMessage({
        content: inputText,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: username ?? "You:",
          text: inputText,
          isMe: true,
          timestamp: getCurrentTime(),
        },
      ]);

      setInputText("");
    } catch (err) {
      console.error("Message could not be sent", err);
      setError("Message could not be sent.");
    }
  };

  return (
     <section className="flex flex-col h-150 max-w-3xl mx-auto bg-gray-50 border border-gray-200 rounded-xl shadow-sm overflow-hidden mt-6">

      {/* header */}
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">General Chat </h1>
        </div>

        {/* button to wiew other chats */}
        {/* <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={20} />
        </button> */}
      </div>

      {/*message list */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex flex-col ${msg.isMe ? "items-end ml-auto" : "items-start"} max-w-[80%]`}>
            <span className="text-xs text-gray-400 mb-1 px-2">{msg.sender}</span>
            <div className={`p-3 rounded-2xl shadow-sm border ${
              msg.isMe
                ? "bg-p2 text-white rounded-tr-none"
                : "bg-white text-gray-800 rounded-tl-none border-gray-100"
            }`}>
              {msg.text}
            </div>
            <span className="text-xs text-gray-400 mt-1 px-2">{msg.timestamp}</span>
          </div>
        ))}

        {loading && <p className="text-center text-sm text-gray-400 animate-pulse">Connecting..</p>}
        {error && <p className="text-center text-sm text-red-500 font-medium">⚠️ Fel: {error}</p>}

        <div ref={messagesEndRef} />
      </div>

      {/* input fields */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
          
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            placeholder={loading ? "Connecting.." : "Enter message.."}
            className="flex-1 bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-p2 text-white p-2 rounded-lg cursor-pointer"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

    </section>
  );
}

