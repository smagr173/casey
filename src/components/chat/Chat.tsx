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

import React, { useState, useEffect, useRef } from "react"
import ChatWindow from "@/components/chat/ChatWindow"
import References from "@/components/chat/References"
import PlanSteps from "@/components/chat/PlanSteps"
import Collapse from "@/components/Collapse"
import { ChatContents, ChatResponse, PlanContents } from "@/utils/types"
import { createChat, fetchChat, getJobStatus, executePlan, fetchPlan } from "@/utils/api"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import Loading from "@/navigation/Loading"

interface GenAIChatProps {
  userToken: string
  initialChatId: string | null
  model?: string
  route?: string
  chatId?: string
}

const initialOutput = {"AIOutput": "You can ask me anything."}
const LLM_MODELS = [
  "VertexAI-Gemini-Pro",
  "VertexAI-Chat-Palm2V2-Langchain",
  "VertexAI-Chat-Palm2-V2",
  "VertexAI-Chat-Palm2-32k-Langchain",
  "VertexAI-Chat-Palm2-32k",
  "VertexAI-Chat",
  "OpenAI-GPT4-latest",
  "OpenAI-GPT4",
  "OpenAI-GPT3.5",
  "Cohere",
]


const GenAIChat: React.FC<GenAIChatProps> = ({
  userToken,
  initialChatId,
  model = "VertexAI-Chat-Palm2-32k-Langchain",
  route = "Casey",
}) => {

  const [planId, setPlanId] = useState<string | null>(null)
  const [planData, setPlanData] = useState<PlanContents[]>([])
  const [messages, setMessages] = useState<ChatContents[]>([initialOutput])
  const [activeJob, setActiveJob] = useState(false)
  const [newChatId, setNewChatId] = useState<string | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState(model)
  const [paramUpdate, setParamUpdate] = useState(false)
  const initialChatRef = useRef(initialChatId)

  const {
    isLoading,
    data: chat,
    refetch,
  } = useQuery(["Chat", initialChatId, planId], fetchChat(userToken, initialChatId ?? ""),
    { enabled: !!initialChatId }
  )

  const { data: planObj } = useQuery(["PlanSteps", planId], fetchPlan(userToken, planId ?? ""),
    { enabled: !!planId }
  )

  useEffect(() => {
    if (!paramUpdate) {
      setActiveJob(false)
    } else {
      setParamUpdate(false)
    }
  }, [initialChatId])

  useEffect(() => {
    chat?.history ? setMessages(chat.history) : setMessages([initialOutput])
    const planContent = chat?.history.findLast((item): item is any => 'plan' in item)
    if (planContent?.plan) {
      setPlanId(planContent.plan.id)
    } else {
      setPlanData([])
    }
  }, [chat])

  useEffect(() => {
    if (planObj?.plan_steps) {
      setPlanData(planObj.plan_steps)
    }
  }, [planObj])

  const addChat = useMutation({
    mutationFn: createChat(userToken),
  })

  const runPlan = useMutation({
    mutationFn: executePlan(userToken),
  })

  const navigate = useNavigate()

  const updateUrlParam = (chatId: string | null) => {
    navigate(`?chat_id=${chatId}`, { replace: true })
  }

  const onSubmit = (userInput: string) => {
    setActiveJob(true)
    setPlanId(null)

    // Display user prompt in chat immediately
    setMessages((prev) => [...prev, { "HumanInput": userInput }])

    addChat.mutate(
      {
        userInput,
        route,
        chatId: initialChatId ?? null,
        llmType: selectedModel,
        runAsBatchJob: true
      },
      {
        onSuccess: (response?: ChatResponse) => {
          const newChatResponseId = response?.chat?.id.toString()

          if (response?.batch_job) {
            const newJobId = response.batch_job.id.toString()
            setJobId(newJobId)
          }
          if (typeof newChatResponseId === "string") {
            setNewChatId(newChatResponseId)
            updateUrlParam(newChatResponseId)
            setParamUpdate(true)
            initialChatRef.current = newChatResponseId
          }
        },
        onError: (error) => {
          setActiveJob(false)
          console.error("Send failed", error)
        }
      }
    )
  }

  const runAgentPlan = () => {
    setActiveJob(true)

    runPlan.mutate(
      {
        planId,
        chatId: initialChatId ?? null,
      },
      {
        onSuccess: (response?: any) => {
          console.log(response?.agent_logs)
          if (response?.agent_logs) {
            setMessages((prev) => [...prev, { "plan_logs": response.agent_logs }])
            setPlanId(null)
            setActiveJob(false)
          }
        },
        onError: (error) => {
          setActiveJob(false)
          runAgentPlan()
          console.error("Send failed", error)
        }
      }
    )
  }

  // Poll for job status
  useEffect(() => {
    if (!jobId || !userToken) {
      setActiveJob(false)
      return
    }

    const startTime = new Date()

    const pollStatus = async () => {
      if (!startTime) return

      const timeElapsed = (new Date().getTime() - startTime.getTime())
      if (timeElapsed > 180000) {
        setActiveJob(false)
        return
      }

      try {
        const job = await getJobStatus(jobId, userToken)
        if (job?.status === "succeeded" || job?.status === "failed") {
          if (initialChatRef.current == newChatId) {
            refetch()
          }
          setActiveJob(false)
          setJobId(null)
        } else {
          setTimeout(pollStatus, 1000)
        }
      } catch (error) {
        setActiveJob(false)
        console.log("Error polling")
      }
    }

    pollStatus()

    return () => {
      setActiveJob(false)
      setJobId(null)
    }
  }, [jobId, userToken])

  const references = messages.flatMap(msg => msg.query_references || [])

  if (initialChatId && isLoading) return <Loading />

  return (
    <div className="bg-primary/20 flex flex-grow flex-col gap-4 rounded-lg p-3 lg:flex-row">
      <div className="bg-base-100 flex flex-grow flex-col rounded-lg px-8 py-6">
        <ChatWindow onSubmit={onSubmit} runAgentPlan={runAgentPlan} messages={messages} chatId={initialChatId} activeJob={activeJob} planId={planId} />
      </div>

      <div className="flex w-full min-w-64 max-w-full lg:max-w-96 flex-col gap-4">
        <Collapse title={"References"} initiallyOpen={references.length > 0 && planData.length == 0}>
          {references.length > 0 ? (
            <References references={references} />
          ) : (
            <div>No references to display</div>
          )}
        </Collapse>
        {planData.length > 0 &&
          <Collapse title={"Plan Steps"} initiallyOpen={planData.length > 0}>
            <PlanSteps planSteps={planData} />
          </Collapse>
        }
        <Collapse title={"Advanced Settings"}>
          <div>
            <label htmlFor="model-select" className="label"><span className="label-text">Model:</span></label>
            <select
              id="model-select"
              className="select select-bordered"
              onChange={(e) => setSelectedModel(e.target.value)}
              defaultValue="VertexAI-Chat-Palm2-32k-Langchain"
            >
              {LLM_MODELS.map((modelOpt) => <option key={modelOpt} value={modelOpt}>{modelOpt}</option>)}
            </select>
          </div>
        </Collapse>
      </div>
    </div>
  )
}

export default GenAIChat
