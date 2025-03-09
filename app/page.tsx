'use server'
import ChatPage from "./chat/[...slug]/page";

export default async function Home() {
  return (
  <ChatPage slugParam=""/>
  )
}