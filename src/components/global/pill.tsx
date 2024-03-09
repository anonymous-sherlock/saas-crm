import { cn } from '@/lib/utils'
import { FC } from 'react'

interface PillProps {
  content: string | React.ReactNode
  className?: string
}

const Pill: FC<PillProps> = ({ content, className }) => {
  return (
    <article className={cn("rounded-full p-[1px] text-sm bg-gradient-to-r from-brand-primaryBlue to-brand-primaryPurple", className)} >
      <div className="rounded-full px-3 py-1 bg-white"  >
        {content}
      </div>
    </article>
  )
}

export default Pill