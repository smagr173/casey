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

import RecentConversations from "@/components/chat/RecentConversations"
import { useAuth } from "@/contexts/auth"
import Footer from "@/navigation/Footer"
import MainRoutes from "@/navigation/MainRoutes"
import { AppConfig } from "@/utils/AppConfig"
import { Link } from "react-router-dom"

const TeamLogo = () => (
  <div className="flex items-center justify-center py-4">
    <Link to="/">
      <div className="bg-base-100 cursor-pointer rounded-lg px-4 py-2">
        <img src={AppConfig.logoPath} />
      </div>
    </Link>
  </div>
)

interface SideBarProps {
  handleClick?: () => void
}

const Sidebar: React.FC<SideBarProps> = ({ handleClick }) => {
  const { token } = useAuth()

  return (
    <div className="relative flex h-full w-64 shrink-0 flex-col">
      <div className="absolute right-0 z-10 flex justify-end md:hidden ">
        <span
          className="text-base-100 bg-base-100 mr-2 mt-2 cursor-pointer rounded-lg bg-opacity-90 p-2 transition hover:bg-opacity-100"
          onClick={handleClick}
        >
          <div className="i-heroicons-chevron-left text-primary h-6 w-6" />
        </span>
      </div>

      <div className="hidden pl-3 md:block">
        <TeamLogo />
      </div>

      <div className="border-primary-content text-primary-content mx-4 mb-4 border-b pb-1 text-center text-lg font-semibold">
        Case Management
      </div>

      <MainRoutes />

      {token && (
        <div className="pl-3">
          <RecentConversations token={token} />
        </div>
      )}

      {/* Spacer */}
      <div className="flex-grow grow"></div>

      <Footer />
    </div>
  )
}

export default Sidebar
