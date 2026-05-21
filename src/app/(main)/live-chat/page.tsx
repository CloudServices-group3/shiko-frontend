"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import { ChatClient } from "@azure/communication-chat";
import { MoreHorizontal, Paperclip, Send } from "lucide-react";

interface ChatRoomResponse {
  room: { id: string; courseId: string; azureThreadId: string; created: string; };
  tokenData: { userId: string; acsUserId: string; token: string; expiresOn: string; endpoint: string; };
}

interface Message {
  sender: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

//Decode jwt token
// function parseJwt(token: string) {
//   const base64 = token.split(".")[1];
//   const decoded = JSON.parse(atob(base64));
//   return decoded;
// }


export default function LiveChat() {
  console.log("test")
  console.log("LiveChat renderas!");  


  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- test values ---
  const [userToken, setUserToken] = useState<string | null>(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMWIzYzNkNC1lNWY2LTdhOGItOWMwZC0xZTJmM2E0YjVjNmQiLCJlbWFpbCI6Im5ldHRlQHRlc3QuY29tIiwibmFtZSI6Ik5ldHRlIiwiaXNzIjoiYXV0aC1hcGkiLCJhdWQiOiJtaWNyb3NlcnZpY2UiLCJleHAiOjk5OTk5OTk5OTl9.X-yDIozSqqYGjuAejl9qNFCn0U-7k5eo6oBgnJx6TQ4"
  );

  const [username, setUsername] = useState<string | null>("Nette");

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [chatThreadClient, setChatThreadClient] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const courseId = "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e";

  // =========================================================
  // GET FROM LOCALSTORAGE
  // =========================================================
  /*
  useEffect(() => {
    const jwt = localStorage.getItem("accessToken"); 
    if (!jwt) return;

    const decoded = parseJwt(jwt);
    setUserToken(jwt);
    setUserId(decoded.sub);       // userId från sub-claim
    setUsername(decoded.name || decoded.email); // namn från JWT
  }, []);
  */
  // =========================================================


    // auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

//Initialize azure chat
  useEffect(() => {
    const targetCourseId = courseId || "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d";

  console.log("userToken:", userToken);
  console.log("courseId:", courseId);
  console.log("targetCourseId:", targetCourseId);
  
 
  if (!targetCourseId || !userToken ) {
    console.log("RETURN - något saknas!");
    return;
  }


  console.log("Kör initAzureChat!");

    async function initAzureChat() {
      try {
        setLoading(true);

        // call backend
     
        const response = await fetch(
          `https://azure-chat-webapp-crf4ded2dzf0b5d0.swedencentral-01.azurewebsites.net/api/chat/join/${targetCourseId}?userId=${encodeURIComponent(username ?? "Du")}`,
          {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        if (!response.ok) throw new Error(`API-error: ${response.status}`);
        const data: ChatRoomResponse = await response.json();
        //setChatData(data);

        // start chat client
        const tokenCredential = new AzureCommunicationTokenCredential(data.tokenData.token);
        const chatClient = new ChatClient(data.tokenData.endpoint, tokenCredential);
        const threadClient = chatClient.getChatThreadClient(data.room.azureThreadId);
        
        setChatThreadClient(threadClient);

        // add welcome-message 
        setMessages([
          {
            sender: "System",
            text: `Connected to chat!`,
            isMe: false,
            timestamp: new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    initAzureChat();
  }, [courseId, userToken]);

  // handle message with azure when clicking send-button
  const handleSendMessage = async (e:React.SyntheticEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !chatThreadClient) return;

    try {
      // send inputText with chatThreadClient
      await chatThreadClient.sendMessage({ content: inputText });

      setMessages((prev) => [
        ...prev,
        {
          sender: username ?? "Du",
          text: inputText,
          isMe: true,
          timestamp: new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setInputText("");
    } catch (err) {
      console.error("Message could not be sent", err);
    }
  };

  return (
     <section className="flex flex-col h-150 max-w-3xl mx-auto bg-gray-50 border border-gray-200 rounded-xl shadow-sm overflow-hidden mt-6">

      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Kurschatt (Azure ACS)</h1>
          <p className="text-xs text-gray-500 font-mono">Kurs: {courseId || "test-kurs-101"}</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* MEDDELANDELISTA */}
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

        {loading && <p className="text-center text-sm text-gray-400 animate-pulse">Ansluter till Azure-tråden...</p>}
        {error && <p className="text-center text-sm text-red-500 font-medium">⚠️ Fel: {error}</p>}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT-FÄLT */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
          <button type="button" className="text-gray-400 hover:text-gray-600">
            <Paperclip size={18} />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading ? true : false}
            placeholder={loading ? "Väntar på anslutning..." : "Skriv ett meddelande..."}
            className="flex-1 bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading ? true : false}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

    </section>
  );
}

