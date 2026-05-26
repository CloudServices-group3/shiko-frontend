"use client";

import { useEffect, useState, useRef } from "react";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import { ChatClient, ChatThreadClient } from "@azure/communication-chat";
import { Send } from "lucide-react";


// CONSTANTS
const CHAT_API_URL = "https://azure-chat-webapp-crf4ded2dzf0b5d0.swedencentral-01.azurewebsites.net";
// using a coursID to keep a general chat only
const COURSE_ID = "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c9e";

// INTERFACES
interface ChatRoomResponse {
  room: { id: string; courseId: string; azureThreadId: string; created: string };
  tokenData: { userId: string; acsUserId: string; token: string; expiresOn: string; endpoint: string };
}

interface Message {
  sender: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

// HELPERS

// Decode JWT token to get user info from claims
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
      setUsername(decoded.name || decoded.email || "Användare");
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
    if (!userToken) return;

    async function initAzureChat() {
      try {
        setLoading(true);

        // Call backend to get or create chat room and ACS token
        const response = await fetch(`${CHAT_API_URL}/api/chat/join/${COURSE_ID}`, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${userToken}`,
          },
        });

        if (!response.ok) throw new Error(`API-error: ${response.status}`);

        const data: ChatRoomResponse = await response.json();

        // Initialize ACS chat client with token from backend
        const tokenCredential = new AzureCommunicationTokenCredential(data.tokenData.token);
        const chatClient = new ChatClient(data.tokenData.endpoint, tokenCredential);
        const threadClient = chatClient.getChatThreadClient(data.room.azureThreadId);

        setChatThreadClient(threadClient);

        // Start real time notifications and listen for incoming messages
        await chatClient.startRealtimeNotifications();
        chatClient.on("chatMessageReceived", (e) => {
          // Only handle messages from this thread, and not from ourselves
          if (e.threadId !== data.room.azureThreadId) return;
          if ((e.sender as any).communicationUserId === data.tokenData.acsUserId) return;

          setMessages((prev) => [...prev, {
            sender: e.senderDisplayName || "Class mate",
            text: e.message,
            isMe: false,
            timestamp: new Date(e.createdOn).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" }),
          }]);
        });

        // Add system message to confirm connection
        setMessages([{
          sender: "System",
          text: "Connected to chat!",
          isMe: false,
          timestamp: getCurrentTime(),
        }]);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    initAzureChat();
  }, [userToken]);

  // handle send-message
  const handleSendMessage = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !chatThreadClient) return;

    try {
      await chatThreadClient.sendMessage({ content: inputText });

      setMessages((prev) => [...prev, {
        sender: username ?? "Du",
        text: inputText,
        isMe: true,
        timestamp: getCurrentTime(),
      }]);

      setInputText("");
    } catch (err) {
      console.error("Message could not be sent", err);
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
                ? "bg-blue-600 text-white rounded-tr-none border-blue-700"
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

