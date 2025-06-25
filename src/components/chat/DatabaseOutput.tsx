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

import React, { useState } from "react"
import { DatabaseResults } from "@/utils/types"

interface ResultsProps {
  dbResults: DatabaseResults[]
}

const CHAT_BATCH_SIZE = 5

const DatabaseOutput: React.FC<ResultsProps> = ({ dbResults }) => {
  const [visibleResults, setVisibleResults] = useState(CHAT_BATCH_SIZE) // Initial number of items to show

  const showMoreResults = () => {
    setVisibleResults(prevVisibleResults => Math.min(prevVisibleResults + CHAT_BATCH_SIZE, dbResults.length)) // Show more items upon each click
  }

  const showLessResults = () => {
    setVisibleResults(CHAT_BATCH_SIZE) // Reset to showing only the first 5 items
  }

  const capitalizeFirstLetter = (content: string) => {
    return content.charAt(0).toUpperCase() + content.slice(1)
  }

  const camelCaseToTitle = (text: string) => {
    return text
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map(word => word.length <= 3 ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  const columnNames = dbResults[0] ? Object.keys(dbResults[0]).map(camelCaseToTitle) : []

  return (
    <div className="ml-16 mr-2">
      {dbResults.length > 0 && (
        <table className="table w-full">
          <thead>
            <tr>
              {columnNames.map((columnName, index) => (
                <th key={index} className="text-left pb-2">{columnName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dbResults.slice(0, visibleResults).map((result, rowIndex) => (
              <tr key={rowIndex}>
                {Object.keys(result).map((key, colIndex) => (
                  <td key={colIndex} className="text-left">{capitalizeFirstLetter(String(result[key]))}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {dbResults.length > visibleResults ? (
        <p 
          className="pt-4 w-fit text-info hover:text-info-content cursor-pointer transition-colors" 
          onClick={showMoreResults}
        >
          Show More
        </p>
      ) : dbResults.length > CHAT_BATCH_SIZE && (
        <p 
          className="pt-4 w-fit text-info hover:text-info-content cursor-pointer transition-colors" 
          onClick={showLessResults}
        >
          Show Less
        </p>
      )}
    </div>
  )
}

export default DatabaseOutput
