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

interface ChatInputProps {
  onSubmit: (message: string) => void
  activeJob: boolean
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, activeJob }) => {
  return (
    <form
      className="flex items-center gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        const input = document.getElementById("chat-input") as HTMLInputElement
        onSubmit(input.value)
        input.value = ""
      }}
    >
      <input
        className="border-base-content/50 w-full outline-none focus:outline-none focus:border-info focus:ring-1 focus:ring-info rounded-xl border p-3 placeholder:text-sm transition"
        id="chat-input"
        type="text"
        placeholder="Enter a prompt here"
        autoComplete="off"
      />
      <button
        type="submit"
        className="hover:bg-base-200 group rounded-full p-2 transition"
      >
        <div className={`i-material-symbols-send-outline-rounded h-8 w-8 shrink-0 transition ${
          activeJob ? 'text-base-content/50' : 'text-base-content/75'
        }`}>
        </div>
      </button>
    </form>
  )
}

export default ChatInput
