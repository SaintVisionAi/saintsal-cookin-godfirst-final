import { Card, CardContent } from "@/components/ui/card"

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <Card>
        <CardContent>
          <p className="text-sm">Welcome to the SaintSAL™ Agent Dashboard.</p>
        </CardContent>
      </Card>
    </div>
  )
}
