import { Plan } from "@/utils/types"

interface PlanCardProps {
  plan: Plan
}

const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
  return (
    <div className="card bg-base-100 ring-base-200 max-w-md shadow-lg ring">
      <figure>
        <img src={plan.img} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{plan.name}</h2>
        <p>{plan.description}</p>
        <div className="card-actions justify-end">
          <a href={plan.link} target="_blank" rel="noreferrer">
            <button className="btn btn-primary">View</button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default PlanCard
