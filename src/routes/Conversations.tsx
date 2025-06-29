// Copyright 2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the License);
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import Loading from "@/navigation/Loading"
import { deleteChat, fetchChatHistory } from "@/utils/api"
import { fallBackConversations } from "@/utils/data"
import { classNames } from "@/utils/dom"
import { Chat } from "@/utils/types"
import { useMutation, useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

interface ConversationsProps {
  token: string
}

const MAX_CHAT_DISPLAY = 20

const Conversations: React.FC<ConversationsProps> = ({ token }) => {
  const [chats, setChats] = useState<Chat[]>([])

  const { isLoading, data: chatHistory } = useQuery(
    ["ChatHistory"],
    fetchChatHistory(token),
  )

  const removeChat = useMutation({
    mutationFn: deleteChat(token),
  })

  const handleDelete = (id: string) => {
    setChats((chats) => chats.filter((c) => c.id !== id))
    removeChat.mutate(id)
  }

  useEffect(() => {
    setChats(chatHistory ?? fallBackConversations)
  }, [chatHistory])

  if (isLoading) return <Loading />

  return (
    <div className="overflow-x-auto">
      <table className="table-lg table-zebra table w-full">
        {/* head */}
        <thead>
          <tr className="text-left">
            <th>Link</th>
            <th>Created at</th>
            <th>Title</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="opacity-80">
          {chats
            .sort((a, b) => (b.created_time > a.created_time ? 1 : -1))
            .slice(0, MAX_CHAT_DISPLAY)
            .map((chat, i) => (
              <tr
                key={chat.id}
                className={classNames(
                  "text-sm lg:text-base",
                  i % 2 === 0 ? "bg-base-200" : "bg-base-100",
                )}
              >
                <td className="text-sm lg:text-base">
                  <Link
                    to={`/ai?chat_id=${chat.id}`}
                    className="text-primary text-sm transition hover:underline lg:text-base"
                  >
                    Link
                  </Link>
                </td>
                <td className="text-xs md:text-sm lg:min-w-56 lg:text-base">
                  {dayjs(chat.created_time).format("MMM D, YYYY - H:mma")}
                </td>
                <td className="text-xs md:text-sm lg:min-w-56 lg:text-base">
                  {chat.history[0].HumanInput}
                </td>
                <td>
                  <div
                    className="hover:bg-error group w-8 cursor-pointer rounded p-1 transition"
                    onClick={() => handleDelete(chat.id)}
                  >
                    <div className="i-mdi-trash-outline text-error group-hover:text-error-content h-6 w-6 shrink-0  opacity-80  transition group-hover:opacity-100"></div>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default Conversations
