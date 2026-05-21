"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import { ChatClient } from "@azure/communication-chat";

interface ChatRoomResponse {
  room: { id: string; courseId: string; azureThreadId: string; created: string; };
  tokenData: { userId: string; acsUserId: string; token: string; expiresOn: string; endpoint: string; };
}

export default function LiveChat() {
  const params = useParams();
  const courseId = params.courseId as string;

  // test jwt token from jwt.io
  const userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik5ldHRlIiwiaXNzIjoiYXV0aC1hcGkiLCJhdWQiOiJtaWNyb3NlcnZpY2UifQ.UAn3H87o_eiOV_AaY_EEeVsvSZqjctWA42n8nuiwWSM"; 
  const username = "Nette";

  //const [chatData, setChatData] = useState<ChatRoomResponse | null>(null); <... use this later to get data from chatroomresponse ???
  const [messages, setMessages] = useState<{ sender: string; text: string; isMe: boolean }[]>([]);
  const [inputText, setInputText] = useState("");
  const [chatThreadClient, setChatThreadClient] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


 
  //set test guid for course-id , remove when using the real from course-api
  useEffect(() => {
    const targetCourseId = courseId || "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d";

    //testing remove later
    console.log("--- TESTING ---");
    console.log("courseId from URL:", courseId);
    console.log("targetCourseId:", targetCourseId);

    if (!targetCourseId || !userToken) {
      console.log(" return - targetCourseId or userToken missing!");
      return;
    }

    async function initAzureChat() {
      try {
        console.log(" runing initAzureChat()");
        setLoading(true);
        
        // Call backend 
        const response = await fetch(`https://localhost:7164/api/chat/join/${targetCourseId}?userId=${encodeURIComponent(username)}`,
         {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${userToken}`
          }
        });

        if (!response.ok) throw new Error(`API-error: ${response.status}`);
        const data: ChatRoomResponse = await response.json();
        //setChatData(data);

        // start chat client
        const tokenCredential = new AzureCommunicationTokenCredential(data.tokenData.token);
        const chatClient = new ChatClient(data.tokenData.endpoint, tokenCredential);
        const threadClient = chatClient.getChatThreadClient(data.room.azureThreadId);
        
        setChatThreadClient(threadClient);

        // add welcome-message for testing only
        setMessages([
          { sender: "System", text: `Connected to Azure-thread: ${data.room.azureThreadId.substring(0, 8)}...`, isMe: false }
        ]);

      } catch (err: any) {
        console.error("errror in initAzureChat:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    initAzureChat();
  }, [courseId, userToken]);

  // handle message with azure when clicking send-button
  const handleSendMessage = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !chatThreadClient) return;

    try {
      // send inputText with chatThreadClient
      await chatThreadClient.sendMessage({ content: inputText });

      // render screen when message sent and clear inputtext
      setMessages((prev) => [...prev, { sender: username, text: inputText, isMe: true }]);
      setInputText("");
    } catch (err) {
      console.error("could not send message to azure", err);
    }
  }; 

  return (
    <div>Chat UI</div>
  );
}