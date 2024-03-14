import { CampaignStatusProp, LeadStatusProp, StatusType } from '@/constants/index';
import { cn } from '@/lib/utils';
import { FC } from 'react'


interface CustomBadgeProps {
    status: StatusType[]
    badgeValue: string,
    className?: string
}

export const CustomBadge: FC<CustomBadgeProps> = ({ status, badgeValue, className }) => {
    return (
        <span className={cn("inline-flex flex-shrink-0 items-center rounded-full px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset",
            className,
            badgeValue && status.find((s) => s.value === badgeValue)?.color?.textColor,
            badgeValue && status.find((s) => s.value === badgeValue)?.color?.bgColor,
            badgeValue && status.find((s) => s.value === badgeValue)?.color?.ringColor
        )} >
            {(() => {
                const existedStatus = status.find((status) => status.value === badgeValue);
                if (existedStatus) {
                    const IconComponent = existedStatus?.icon;
                    return (
                        <>
                            {IconComponent && <IconComponent className="inline-block mr-1.5 h-3 w-3" />}
                            <span>{existedStatus.label}</span>
                        </>
                    )
                }
                return badgeValue
            })()}
        </span>
    )
}

