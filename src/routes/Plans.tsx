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

import PlanCard from "@/components/medicaid/PlanCard"
import Header from "@/components/typography/Header"
import { AppConfig } from "@/utils/AppConfig"
import { Plan } from "@/utils/types"

const PLANS: Plan[] = [
  {
    id: 1,
    name: "Traditional Medicaid",
    description:
      "This is the basic, original structure of Medicaid. The state pays healthcare providers directly for each service delivered to eligible individuals.",
    link: "https://www.medicaid.gov/",
    img: `${AppConfig.imagesPath}/plan-1.jpg`,
  },
  {
    id: 2,
    name: "Managed Care",
    description:
      "These plans are similar to private health insurance. The state contracts with health plans, and the plan coordinates and manages your care.",
    link: "https://www.medicaid.gov/",
    img: `${AppConfig.imagesPath}/plan-2.jpg`,
  },
  {
    id: 3,
    name: "Long Term Care",
    description:
      "For those needing assistance with daily living activities, such as nursing home care or home health services.",
    link: "https://www.medicaid.gov/",
    img: `${AppConfig.imagesPath}/plan-3.jpg`,
  },
  {
    id: 4,
    name: "Dual Eligible Plans",
    description:
      "Dual Eligible Plans are a type of Medicaid that is available to people who are eligible for both Medicaid and Medicare. These plans offer a combination of Medicaid and Medicare benefits.",
    link: "https://www.medicaid.gov/",
    img: `${AppConfig.imagesPath}/plan-4.jpg`,
  },
  {
    id: 5,
    name: "CHIP",
    description:
      "CHIP is a type of Medicaid that is available to children and pregnant women. These plans offer a combination of Medicaid and CHIP benefits.",
    link: "https://www.medicaid.gov/",
    img: `${AppConfig.imagesPath}/plan-5.jpg`,
  },
]

interface PlansProps {}

const Plans: React.FunctionComponent<PlansProps> = ({}) => {
  return (
    <>
      <Header className="mb-10">Medicaid Plans</Header>
      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 xl:grid-cols-3">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </>
  )
}

export default Plans
