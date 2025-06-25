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

import Filter from "@/components/Filter"
import Header from "@/components/typography/Header"
import { AppConfig } from "@/utils/AppConfig"
import { classNames } from "@/utils/dom"
import { Case } from "@/utils/types"
import dayjs from "dayjs"

const getColor = (status: string) => {
  if (status === "Unassigned")
    return "border border-warning bg-warning-content text-warning"
  if (status === "Resolved")
    return "bg-info-content border border-info text-info"
  if (status === "New")
    return "border border-success text-success bg-success-content"
  if (status === "Overdue")
    return "border border-error text-error bg-error-content"
  else return "border border-base-300 text-base-content bg-base-200"
}

// TODO: Add more cases. Put newer cases towards the top (higher id and subtract fewer days)
const cases: Case[] = [
  {
    id: 5010,
    submittedAt: dayjs().toDate(),
    assignedAt: dayjs().toDate(),
    submitterName: "John Doe",
    type: "General Questions",
    responseMethod: "Email",
    status: "New",
    assign: "Assign to me",
  },
  {
    id: 6708,
    submittedAt: dayjs().subtract(2, "day").toDate(),
    assignedAt: dayjs().subtract(1, "day").toDate(),
    submitterName: "Denver Herente",
    type: "Eligibility Question",
    responseMethod: "Scheduled Callback",
    status: "Unassigned",
    assign: "Assign to me",
  },
  {
    id: 6570,
    submittedAt: dayjs().subtract(3, "day").toDate(),
    assignedAt: dayjs().subtract(2, "day").toDate(),
    submitterName: "Alision Parker",
    type: "Medicaid Type B",
    responseMethod: "Callback",
    status: "Unassigned",
    assign: "Assign to me",
  },
  {
    id: 6480,
    submittedAt: dayjs().subtract(4, "day").toDate(),
    assignedAt: dayjs().subtract(3, "day").toDate(),
    submitterName: "Julia Cuesta",
    type: "General Questions",
    responseMethod: "Callback",
    status: "Resolved",
    assign: "Unassign",
  },
  {
    id: 5902,
    submittedAt: dayjs().subtract(5, "day").toDate(),
    assignedAt: dayjs().subtract(4, "day").toDate(),
    submitterName: "Alicia Sierra",
    type: "Approval Process",
    responseMethod: "Scheduled Callback",
    status: "Resolved",
    assign: "Unassign",
  },
  {
    id: 5678,
    submittedAt: dayjs().subtract(6, "day").toDate(),
    assignedAt: dayjs().subtract(5, "day").toDate(),
    submitterName: "Helsinki Peric",
    type: "General Questions",
    responseMethod: "Callback",
    status: "Resolved",
    assign: "Unassign",
  },
  {
    id: 5456,
    submittedAt: dayjs().subtract(7, "day").toDate(),
    assignedAt: dayjs().subtract(6, "day").toDate(),
    submitterName: "Nairobi Flores",
    type: "Medicaid Type A",
    responseMethod: "Email",
    status: "Canceled",
    assign: "Assign to me",
  },
  {
    id: 5125,
    submittedAt: dayjs().subtract(8, "day").toDate(),
    assignedAt: dayjs().subtract(7, "day").toDate(),
    submitterName: "Berlin John",
    type: "Application Process",
    responseMethod: "Email",
    status: "Resolved",
    assign: "Unassign",
  },
  {
    id: 4564,
    submittedAt: dayjs().subtract(9, "day").toDate(),
    assignedAt: dayjs().subtract(8, "day").toDate(),
    submitterName: "Lauren Dole",
    type: "General Questions",
    responseMethod: "Email",
    status: "Overdue",
    assign: "Assign to me",
  },
]

const renderCases = () => {
  return (
    <div className="overflow-x-auto">
      <table className="table-md table w-full">
        {/* head */}
        <thead className="border-b text-left text-sm">
          <tr>
            <th>Case Number</th>
            <th>Submitted Date</th>
            <th>Assigned Date</th>
            <th>Submitted Name</th>
            <th>Case Type</th>
            <th>Response Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="text-left">
          {cases.map((c) => (
            <tr key={c.id} className="border-b opacity-80">
              <td>{c.id}</td>
              <td>{c.submittedAt.toLocaleDateString()}</td>
              <td>{c.assignedAt.toLocaleDateString()}</td>
              <td>{c.submitterName}</td>
              <td>{c.type}</td>
              <td>{c.responseMethod}</td>
              <td>
                <p
                  className={classNames(
                    `rounded-md p-1 text-center ${getColor(c.status)}`,
                  )}
                >
                  {c.status}
                </p>
              </td>
              <td>
                <p className="btn btn-primary btn-sm btn-outline w-full text-xs">
                  {c.assign}
                </p>
              </td>
              <td>
                <div className="hover:bg-primary group w-8 cursor-pointer rounded p-1 transition">
                  <div className="i-heroicons-flag text-primary h-6 w-6 group-hover:text-white" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Cases() {
  return (
    <>
      <div className="flex gap-2">
        <img src={`${AppConfig.imagesPath}/genai.png`} className="h-10 w-10" />
        <Header className="mb-4">Medikate Cases and Ticket Hub</Header>
      </div>
      <Filter />
      <div className="ring-base-300 rounded-lg px-4 py-2 ring lg:px-4 lg:py-2 xl:px-4 xl:py-3">
        {renderCases()}
      </div>
      <div className="join mt-4 flex justify-center">
        <button className="join-item btn">«</button>
        <button className="join-item bg-base-200 flex cursor-default items-center gap-2 px-2">
          <span>Page 1</span>
          <span className="text-xs"> (of 22)</span>
        </button>
        <button className="join-item btn">»</button>
      </div>
    </>
  )
}
