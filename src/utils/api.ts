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

import { envOrFail } from "@/utils/env"
import { Chat, Plan } from "@/utils/types"
import axios from "axios"
import { path } from "ramda"

interface RunDispatchParams {
  userInput: string
  route: string
  chatId: string | null
  llmType: string
  runAsBatchJob: boolean
}

interface RunPlanParams {
  planId: string | null
  chatId: string | null
}

interface JobStatusResponse {
  status: "succeeded" | "failed" | "active"
}

interface CreateChatResponse {
  id: string
}

interface AgentResponse {
  agent_process_output: string
}

const endpoint = envOrFail(
  "VITE_PUBLIC_API_ENDPOINT",
  import.meta.env.VITE_PUBLIC_API_ENDPOINT,
)

const jobsEndpoint = envOrFail(
  "VITE_PUBLIC_API_JOBS_ENDPOINT",
  import.meta.env.VITE_PUBLIC_API_JOBS_ENDPOINT,
)

// https://gcp-mira-develop.cloudpssolutions.com/llm-service/api/v1/docs#/Chat/Get_user_chat_chat__chat_id__get
export const fetchChat =
  (token: string, chatID: string | null) => (): Promise<Chat | undefined | null> => {
    if (!chatID) return Promise.resolve(null)
    const url = `${endpoint}/chat/${chatID}`
    const headers = { Authorization: `Bearer ${token}` }
    return axios.get(url, { headers }).then(path(["data", "data"]))
  }

// https://gcp-mira-develop.cloudpssolutions.com/llm-service/api/v1/docs#/Chat/Get_all_user_chats_chat_get
export const fetchChatHistory =
  (token: string) => (): Promise<Chat[] | undefined> => {
    const params = new URLSearchParams({
      skip: "0",
      limit: "100",
      with_all_history: "false",
      with_first_history: "true",
    })
    const url = `${endpoint}/chat?${params.toString()}`
    const headers = { Authorization: `Bearer ${token}` }
    return axios.get(url, { headers }).then(path(["data", "data"]))
  }

// https://gcp-mira-develop.cloudpssolutions.com/llm-service/api/v1/docs#/Chat/Delete_user_chat_chat__chat_id__delete
export const deleteChat =
  (token: string) =>
  (chatID: string): Promise<void> => {
    const url = `${endpoint}/chat/${chatID}`
    const headers = { Authorization: `Bearer ${token}` }
    return axios.delete(url, { headers })
  }

// https://gcp-mira-develop.cloudpssolutions.com/llm-service/api/v1/docs#/Chat/Create_new_chat_chat_post
export const createChat =
  (token: string) => async ({
    userInput,
    route,
    chatId = null,
    llmType,
    runAsBatchJob,
  }: RunDispatchParams): Promise<Chat | undefined> => {
    const url = `${endpoint}/agent/dispatch/${route}`
    const headers = { Authorization: `Bearer ${token}` }
    const data = {
      prompt: userInput,
      chat_id: chatId,
      llm_type: llmType,
      run_as_batch_job: runAsBatchJob,
    }
    return axios.post<CreateChatResponse>(url, data, { headers }).then(path(["data", "data"]))
  }

// https://gcp-mira-develop.cloudpssolutions.com/jobs-service/api/v1/docs#/Jobs/get_batch_job_status_jobs__job_type_const___job_name__get
export const getJobStatus =
  async (jobId: string, token: string): Promise<JobStatusResponse | undefined> => {
    if (!token) return Promise.resolve(undefined)
    const url = `${jobsEndpoint}/jobs/agent_run_dispatch/${jobId}`
    const headers = { Authorization: `Bearer ${token}` }
    return axios.get(url, { headers }).then(path(["data", "data"]))
 }

export const fetchPlan =
  (token: string, planID: string | null) => (): Promise<Plan | undefined> => {
    if (!planID) return Promise.resolve(undefined)
    const url = `${endpoint}/agent/plan/${planID}`
    const headers = { Authorization: `Bearer ${token}` }
    return axios.get(url, { headers }).then(path(["data", "data"]))
  }

export const executePlan =
  (token: string) => async ({
    planId,
    chatId,
  }: RunPlanParams): Promise<AgentResponse | undefined> => {
    const url = `${endpoint}/agent/plan/${planId}/run?chat_id=${chatId}`
    const headers = { Authorization: `Bearer ${token}` }
    return axios.post<AgentResponse>(url, {}, { headers }).then(path(["data", "data"]))
  }