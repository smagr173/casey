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

import React, { useRef, useEffect, ReactNode } from "react"
import ChatInput from "./ChatInput"
import IconBar from "./IconBar"
import DatabaseOutput from "./DatabaseOutput"
import { ChatContents, AIOutputItem } from "@/utils/types"
import Expander from "@/components/Expander"
import Markdown from "react-markdown"
import rehypeRaw from "rehype-raw"

interface ChatWindowProps {
  onSubmit: (message: string) => void
  runAgentPlan: () => void
  messages: ChatContents[]
  chatId: string | null
  activeJob: boolean
  planId: string | null
}

const preprocessMarkdown = (text: string) => {
  // Split the entire text by lines for processing
  const lines = text.split('\n')

  // Process each line
  const processedLines = lines.map(line => {
    // Make "Task:", "Thought:", and "Plan:" bold with <strong>
    line = line.replace(/(Task:)/g, '<strong>$1</strong>')
    line = line.replace(/(Thought:)/g, '<br><br><strong>$1</strong>')
    line = line.replace(/(Plan:)/g, '<br><br>')

    // Process numbered list items as before
    if (line.match(/^\d+\./)) {
      return line
    }
    return line
  })

  // Rejoin the processed lines into a single string
  return processedLines.join('\n')
}

const preprocessAgentLogs = (logs: string) => {
  let formattedLogs = logs
  const replacements = [
    { pattern: "Task:", replacement: "- **Task**:" },
    { pattern: "Observation:", replacement: "---\n**Observation**:" },
    { pattern: "Thought:", replacement: "- **Thought**:" },
    { pattern: "Action:", replacement: "- **Action**:" },
    { pattern: "Action Input:", replacement: "- **Action Input**:" },
    { pattern: "Route:", replacement: "- **Route**:" },
    { pattern: "> Finished chain", replacement: "**Finished chain**" }
  ];

  replacements.forEach(({ pattern, replacement }) => {
    formattedLogs = formattedLogs.replace(new RegExp(pattern, 'g'), replacement)
  })

  return formattedLogs
}

const htmlToMarkdown = (html: string): string => {
  return html
    .replaceAll("<strong>", "**")
    .replaceAll("</strong>", "**")
    .replaceAll("<b>", "**")
    .replaceAll("</b>", "**")
    .replaceAll("<em>", "*")
    .replaceAll("</em>", "*")
    .replaceAll("<br>", "\n")
    .replaceAll("<p>", "\n")
    .replaceAll("</p>", "\n")
    .replaceAll("<li>", "-")
    .replaceAll("</li>", "")
}

const renderValue = (value: unknown): ReactNode => {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value.toString()
  } else if (Array.isArray(value)) {
    return value.join(", ")
  } else if (typeof value === "object" && value !== null) {
    return JSON.stringify(value)
  }
  return null
}

const renderJsonContent = (jsonContent: any, type: string) => {
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  switch (type) {
    case "Action":
      return (
        <div className="border-b mt-4 space-plan">
          <strong>Action</strong>
          <ul>
            {jsonContent.action_input && (
              <li>
                <strong>Action Input: </strong>
                {typeof jsonContent.action_input === "object" ? (
                  <ul>
                    {Object.entries(jsonContent.action_input).map(([key, value]) => (
                      <li key={key}>
                        {capitalizeFirstLetter(key)}: {typeof value === "string" ? value : Array.isArray(value) ? value.join(", ") : JSON.stringify(value)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  jsonContent.action_input
                )}
              </li>
            )}
            {jsonContent.action && (
              <li>
                <strong>Action:</strong> {jsonContent.action}
              </li>
            )}
          </ul>
        </div>
      );
    case "Observation":
      return (
        <div className="border-b mt-4 space-plan">
          <strong>Observation</strong>
          <ul>
            {jsonContent.recipients && (
              <li>
                <strong>Recipients:</strong> {renderValue(jsonContent.recipients)}
              </li>
            )}
          </ul>
        </div>
      )
    default:
      return null
  }
}

const renderObservationTextContent = (item: AIOutputItem) => {
  // Check if the item is of type "Observation" and has text_content
  if (item.type === "Observation" && item.text_content) {
    return (
      <div className="mt-4">
        <strong>Observation</strong>
        <ul>
          <li>{item.text_content}</li>
        </ul>
      </div>
    )
  }
  return null
}

const renderAIOutput = (AIOutput: string | AIOutputItem[]) => {
  if (typeof AIOutput === 'string') {
    return <Markdown children={AIOutput} rehypePlugins={[rehypeRaw]} />
  } else {
    return (
      <>
        {AIOutput.map((item, idx) => {
          const keyPrefix = item.type ? `${item.type}-` : 'generic-'
          if (item.text_content) {
            if (item.type === "Observation" && item.text_content) {
              return <React.Fragment key={`${keyPrefix}${idx}`}>{renderObservationTextContent(item)}</React.Fragment>
            } else if (item.text_content) {
              return (
                <Markdown key={`${keyPrefix}text-${idx}`} children={item.text_content} rehypePlugins={[rehypeRaw]} />
              )
            }
          } else if (item.json_content) {
            return <div key={`${keyPrefix}json-${idx}`}>{renderJsonContent(item.json_content, item.type as string)}</div>
          }
          return null
        })}
      </>
    )
  }
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onSubmit, runAgentPlan, messages, chatId, activeJob, planId }) => {
  let index = 0
  const renderChat = (message: ChatContents) => {
    if (message.HumanInput) {
      return (
        <div key={index++}>
          <div className="flex items-center gap-6 pb-7 mx-2">
            <div className="i-material-symbols-face-outline color-info h-8 w-8 shrink-0 self-start"/>
            <div>{message.HumanInput}</div>
          </div>
        </div>
      )
    } else if (message.route_name && !message.AIOutput) {
      console.log(message.route_name)
      return (
        <div key={index++}>
          <div className="flex items-center gap-6 pb-7 mx-2">
            <div className="i-logos-google-bard-icon h-8 w-8 shrink-0 self-start"/>
            <div className="flex-grow">
              <Markdown children={`Using route **${message.route_name}** to respond`} rehypePlugins={[rehypeRaw]}/>
            </div>
          </div>
        </div>
      )
    } else if (message.AIOutput && !message.plan && !Array.isArray(message.AIOutput)) {
      return (
        <div key={index++}>
          <div className={`flex items-center gap-6 mx-2 ${message.db_result ? 'pb-2' : 'pb-7'}`}>
            <div className="i-logos-google-bard-icon h-8 w-8 shrink-0 self-start"/>
            <div className="flex-grow">
              <Markdown children={htmlToMarkdown(message.AIOutput)} rehypePlugins={[rehypeRaw]} />
            </div>
          </div>
          <div>
            {message.db_result && <DatabaseOutput dbResults={message.db_result} />}
          </div>
          <div>
            {message.resources &&
              Object.entries(message.resources).map(([name, link], index) => (
                <div key={index++} className="mt-4 ml-12">
                  <span className="font-medium">Resource: </span>
                  <a href={link as string}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-info hover:text-info-content transition-colors">
                    {name as string}
                  </a>
                </div>
              ))
            }
          </div>
          <div className="space-output space-logs">
            {message.agent_logs &&
              <Expander title={"Thought Process"}>
                <Markdown children={preprocessAgentLogs(message.agent_logs ?? "")} rehypePlugins={[rehypeRaw]} />
              </Expander>
            }
            {message.route_logs &&
              <Expander title={"Thought Process"}>
                <Markdown children={preprocessAgentLogs(message.route_logs ?? "")} rehypePlugins={[rehypeRaw]} />
              </Expander>
            }
          </div>
        </div>
      )
    } else if (Array.isArray(message.AIOutput)) {
      return (
        <div key={index++}>
          <div className="flex items-center gap-6 pb-7 mx-2">
            <div className="i-logos-google-bard-icon h-8 w-8 shrink-0 self-start"/>
            <div className="flex-grow plan-output">
              {renderAIOutput(message.AIOutput)}
            </div>
          </div>
        </div>
      )
    } else if (message.plan) {
      return (
        <div key={index++}>
          <div className="flex items-center gap-6 pb-7 mx-2">
            <div className="i-logos-google-bard-icon h-8 w-8 shrink-0 self-start"/>
            <div className="flex-grow">
              <Markdown children={preprocessMarkdown(message.AIOutput ?? "")} rehypePlugins={[rehypeRaw]}/>
            </div>
          </div>
          <button
            className={`bg-info px-4 py-2 mb-6 ml-12 text-base-100 transition-colors rounded-lg focus:outline-none ${!planId || !activeJob ? 'hover:bg-info-content focus:bg-info-content' : 'opacity-75 cursor-not-allowed'}`}
            onClick={runAgentPlan}
            disabled={!!planId && !!activeJob}
          >
            Execute Plan
          </button>
        </div>
      )
    } else {
      return
    }
  }

  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log(messages)

    // Scroll into view when activeJob is false
    if (activeJob) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    if (!messages[messages.length - 1].HumanInput && !activeJob) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, activeJob])

  return (
    <div className="flex flex-grow flex-col justify-between">
      <div className="text-md flex-grow overflow-auto custom-scrollbar max-h-[calc(100vh-18.3rem)]">
        {messages.map(renderChat)}
        {activeJob && (
          <div className="flex items-center gap-6 pb-7 pt-2 mx-2">
            <div className="i-logos-google-bard-icon h-8 w-8 shrink-0 self-start loader ease-linear"/>
            {planId &&
              <div>Executing plan {planId}</div>
            }
          </div>
        )}
        {(!messages[0].AIOutput && !messages[messages.length - 1].HumanInput && !activeJob) && <IconBar chatId={chatId} />}
        <div ref={endOfMessagesRef} />
      </div>
      <ChatInput onSubmit={onSubmit} activeJob={activeJob} />
    </div>
  )
}

export default ChatWindow
