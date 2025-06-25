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
import { QueryReferences } from "@/utils/types"
import Markdown from "react-markdown"
import rehypeRaw from "rehype-raw"

interface ReferencesProps {
  references: QueryReferences[]
}

const References: React.FC<ReferencesProps> = ({ references }) => {
  const dedupList = <T extends Record<string, any>>(items: T[], dedupKey: keyof T): T[] => {
    const map = new Map<string, T>()
    items.forEach(item => {
      const key: string = String(item[dedupKey])
        map.set(key, item)
    })
    return Array.from(map.values())
  }

  const renderCloudStorageUrl = (url: string): string => {
    if (url.startsWith("/b/")) {
      return url
        .replace("/b/", "https://storage.googleapis.com/")
        .replace("/o/", "/")
    }
    return url
  }

  const uniqueReferences = dedupList(references, "chunk_id")

  return (
    <div className="max-h-[calc(100vh-20.5rem)] overflow-auto custom-scrollbar">
      {uniqueReferences.map((ref, index) => (
        <div key={ref.chunk_id} className={`mb-4 mr-4 ${index < uniqueReferences.length - 1 && 'border-b pb-4'}`}>
          <div className="pb-1">
            <strong>Site:</strong>
          </div>
          <div className="pb-4">
            <a href={renderCloudStorageUrl(ref.document_url)}
               target="_blank"
               rel="noopener noreferrer"
               className="text-info hover:text-info-content block overflow-hidden transition-colors">
              {renderCloudStorageUrl(ref.document_url)}
            </a>
          </div>
          <div className="pb-1">
            <strong>Overview:</strong>
          </div>
          <div className="pb-1">
            <Markdown children={ref.document_text} rehypePlugins={[rehypeRaw]} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default References
