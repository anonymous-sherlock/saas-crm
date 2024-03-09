import { Shell } from '@/components/shells/shell'
import Password from '@/components/template/profile/password'
import React from 'react'

function PasswordPage() {
  return (
    <Shell className="bg-background px-6 py-2 border rounded-sm">
      <Password />
    </Shell>
  )
}

export default PasswordPage