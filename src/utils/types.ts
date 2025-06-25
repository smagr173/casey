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

import { ReactNode } from "react"
import { z } from "zod"

export type INavigationItem = {
  name: string
  href: string
  show: () => boolean
  icon?: ReactNode
}

export type IAuthProvider = "google" | "password"

export type IAppConfig = {
  siteName: string
  locale: string
  logoPath: string
  simpleLogoPath: string
  imagesPath: string
  theme: string
  authProviders: IAuthProvider[]
  authorizedDomains: RegExp[]
}

export const User = z.object({
  firstName: z.string(),
  lastName: z.string(),
})

export type IUser = z.infer<typeof User>

export const Users = z.array(User)

const FIELD_TYPE = [
  "string",
  "number",
  "bool",
  "select",
  "list(string)",
  "file",
] as const

const FIELD_TYPE_ENUM = z.enum(FIELD_TYPE)

export const FormVariable = z.object({
  name: z.string(),
  display: z.string(),
  type: FIELD_TYPE_ENUM,
  description: z.string(),
  default: z.any().optional(),
  required: z.boolean(),
  group: z.number(),
  options: z.string().array().optional(),
  tooltip: z.string().optional(),
  fileLabel: z.string().optional(),
  multiple: z.boolean().default(false).optional(),
  accept: z.string().optional(),
})

export type IFormVariable = z.infer<typeof FormVariable>

export type IFormData = {
  [key: string]: string | number | boolean
}

export type IFieldValidateValue = { value: string | number | boolean }

export type IFormValidationData = {
  [key: string]: any
}

export enum ALERT_TYPE {
  INFO,
  SUCCESS,
  WARNING,
  ERROR,
}

export interface IAlert {
  type: ALERT_TYPE
  message: string | React.ReactNode
  durationMs?: number
  closeable?: boolean
}

export interface PlanContents {
  plan_steps: never[]
  id: string
  description: string
}

export interface QueryReferences {
  chunk_id: string
  document_url: string
  document_text: string
}

export interface DatabaseResults {
  cdtCodeId: string
  codeDescription: string
  [key: string]: string | number
}

export interface ChatPlanContent {
  id: string
  task_response: string
}

export type AIOutputItem = {
  text_content?: string
  json_content?: any // Be more specific if possible
  type?: string
}

export type ChatContents = {
  HumanInput?: string
  AIOutput?: string | AIOutputItem[]
  query_references?: QueryReferences[]
  db_result?: DatabaseResults[]
  plan?: ChatPlanContent[]
  resources?: []
  agent_logs?: string
  route_logs?: string
  plan_logs?: string
  route_name?: string
}

export interface ResponseContents {
  id: string
}

export interface ChatResponse extends Chat {
  batch_job?: ResponseContents
  chat?: ResponseContents
  route_name?: string
}

export type Chat = {
  agent_name: string | null
  archived_at_timestamp: string | null
  archived_by: string
  created_by: string
  created_time: string
  deleted_at_timestamp: string | null
  deleted_by: string
  id: string
  last_modified_by: string
  last_modified_time: string
  llm_type: string | null
  title: string
  user_id: string
  history: ChatContents[]
}

export type Plan = {
  id: number
  name: string
  description: string
  link: string
  img: string
  plan_steps?: PlanContents[]
}

export type Case = {
  id: number
  assignedAt: Date
  submittedAt: Date
  submitterName: string
  type:
    | "General Questions"
    | "Application Process"
    | "Approval Process"
    | "Medicaid Type A"
    | "Medicaid Type B"
    | "Eligibility Question"
  responseMethod: "Email" | "Callback" | "Scheduled Callback"
  status: "New" | "Unassigned" | "Overdue" | "Resolved" | "Canceled"
  assign: "Unassign" | "Assign to me"
}

export const CASE_STATUSES: Case["status"][] = [
  "New",
  "Unassigned",
  "Overdue",
  "Resolved",
  "Canceled",
] as const

export const CASE_TYPES: Case["type"][] = [
  "General Questions",
  "Application Process",
  "Approval Process",
  "Medicaid Type A",
  "Medicaid Type B",
  "Eligibility Question",
] as const
