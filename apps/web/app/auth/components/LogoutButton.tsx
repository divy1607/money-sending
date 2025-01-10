// app/components/LogoutButton.tsx
'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter();

  const handleSubmit = () => {
    router.push('/login');
  }
  return (
    <button onClick={handleSubmit}>
      Logout
    </button>
  )
}