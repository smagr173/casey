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

import Chat from "@/components/chat/Chat"
import { useAuth } from "@/contexts/auth"
import { useQueryParams } from "@/utils/routing"
import { envOrFail } from "@/utils/env"

const streamlitUrl = envOrFail(
  "VITE_PUBLIC_STREAMLIT_URL",
  import.meta.env.VITE_PUBLIC_STREAMLIT_URL,
)

const AIRoute = () => {
  const params = useQueryParams()
  const token = "1223213"

  if (!token) return <></>

  if (params.has("embed_streamlit")) {
    const iframeParams = new URLSearchParams({
      auth_token: token,
      chat_llm_types: "VertexAI-Chat-Palm2-32k-Langchain",
      default_route: "Casey",
    })

    if (params.has("chat_id")) {
      iframeParams.append("chat_id", params.get("chat_id") as string)
    }

    return (
      <iframe
        className="min-h-[calc(100vh-10rem)] w-full rounded-xl"
        src={`${streamlitUrl}/?${iframeParams.toString()}`}
      />
    )
  } else {
    return <Chat userToken={token} initialChatId={params.get("chat_id")} />
  }
}

export default AIRoute
