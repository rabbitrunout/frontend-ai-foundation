interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}

async function getHealthData(): Promise<Todo> {
  const response = await fetch(
    'https://jsonplaceholder.typicode.com/todos/1',
    {
      cache: 'no-store',
    },
  )

  if (!response.ok) {
    throw new Error('Failed to fetch health-check data')
  }

  return response.json()
}

export default async function HealthPage() {
  const data = await getHealthData()

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Glowi System
      </p>

      <h1 className="mt-2 text-3xl font-bold">Health Check</h1>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <p className="font-semibold text-green-700">
          Application is running
        </p>

        <dl className="mt-4 space-y-2 text-sm">
          <div>
            <dt className="font-medium text-slate-500">Fetched record</dt>
            <dd className="text-slate-900">{data.title}</dd>
          </div>

          <div>
            <dt className="font-medium text-slate-500">Record ID</dt>
            <dd className="text-slate-900">{data.id}</dd>
          </div>

          <div>
            <dt className="font-medium text-slate-500">Status</dt>
            <dd className="text-slate-900">
              {data.completed ? 'Completed' : 'Pending'}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}