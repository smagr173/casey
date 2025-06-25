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

import { useEffect, useState } from "react"
import { getAnalytics } from "@/utils/firebase"
import Authenticated from "@/templates/Authenticated"
import Unauthenticated from "@/templates/Unauthenticated"
import "@/assets/styles.css"

function App() {
  const [loadedGA, setLoadedGA] = useState(false)
  const user = {
    uid: "dev-user",
    email: "dev@example.com",
    displayName: "Dev User",
    emailVerified: true,
    isAnonymous: false,
    providerData: [],
    getIdToken: async () => "mock-token",
    getIdTokenResult: async () =>
      ({ token: "mock-token" } as any),
    reload: async () => {},
    delete: async () => {},
    toJSON: () => ({}),
    providerId: "firebase",
    refreshToken: "mock-refresh-token",
    tenantId: null,
    metadata: {} as any,
    phoneNumber: null,
    photoURL: null,
  }

  useEffect(() => {
    if (!loadedGA) {
      getAnalytics()
      setLoadedGA(true)
    }
  }, [])

  if (!user) return <Unauthenticated />

  return <Authenticated user={user} />
}

export default App
