// app/dashboard/page.tsx
import LogoutButton from '../auth/components/LogoutButton'  // adjust path as needed

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <LogoutButton />
    </div>
  )
}