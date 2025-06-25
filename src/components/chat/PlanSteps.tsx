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

import React from "react"
import { PlanContents } from "@/utils/types"
import Markdown from "react-markdown"
import rehypeRaw from "rehype-raw"

interface PlanStepProps {
  planSteps: PlanContents[]
}

const PlanSteps: React.FC<PlanStepProps> = ({ planSteps }) => {
  return (
    <div className="max-h-[calc(100vh-20.5rem)] overflow-auto custom-scrollbar">
      {planSteps.map((ref) => (
        <div key={ref.id} className="mb-4 mr-4">
          <Markdown children={ref.description} rehypePlugins={[rehypeRaw]} />
        </div>
      ))}
    </div>
  )
}

export default PlanSteps
