import axios from "axios";
import { NextResponse } from "next/server";

async function postHandler(req: Request) {
  const { title, content } = await req.json();
  const chatSessionId = await createChatSession();
  const prompt = `Title: ${title}\nContent: ${content}\nReturn only the enhanced content as per instructions. No additional information. Strict text format only, no markdown or HTML.`;
  const response = await getResponseForPrompt(chatSessionId, prompt);
  const enhancedContent = response.data;
  console.log(enhancedContent);
  return NextResponse.json({ enhancedContent });
}

async function createChatSession() {
  const payload = { name: "Chat Session for AI, do not reply!" };
  const URL: string = `${process.env.NEXT_PUBLIC_BASE_URL}/ai/${process.env.NEXT_PUBLIC_AI_ID}/chats`;
  const HEADERS = {
    "X-Authorization": `Bearer ${process.env.AI_KEY}`,
  };

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: URL,
    headers: HEADERS,
    data: payload,
  };

  const response = await axios.request(config);
  return response.data.id;
}

async function getResponseForPrompt(chatId: string, prompt: string) {
  const payload = { date: new Date().toISOString(), prompt: `${prompt}` };
  const URL: string = `${process.env.NEXT_PUBLIC_BASE_URL}/chats/${chatId}`;
  const HEADERS = {
    "X-Authorization": `Bearer ${process.env.AI_KEY}`,
  };

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: URL,
    headers: HEADERS,
    data: payload,
  };

  const response = await axios.request(config);
  return { data: response.data };
}

export const POST = postHandler;
