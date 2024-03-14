"use client"
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lead } from '@prisma/client'
import { FC } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface LeadsDetailsViewProps {
    data: Partial<Lead>
}

const LeadSchema = z.object({
    id: z.string().uuid(),
    ip: z.string(),
    name: z.string(),
    phone: z.string(),
    address: z.string(),
    state: z.string(),
    region: z.string(),
    country: z.string(),
    status: z.enum(['OnHold']),
    createdAt: z.string().refine((value) => !isNaN(new Date(value).getTime()), {
        message: 'Invalid createdAt date',
    }),
    updatedAt: z.string().refine((value) => !isNaN(new Date(value).getTime()), {
        message: 'Invalid updatedAt date',
    }),
    campaignId: z.string(),
    userId: z.string().optional(),
});

export const LeadsDetailsView: FC<LeadsDetailsViewProps> = ({ data }) => {
    const form = useForm<z.infer<typeof LeadSchema>>({
        resolver: zodResolver(LeadSchema),
    });
    return (
        <div className='max-w-[850px] mx-auto grid grid-cols-4 py-4 gap-6 justify-center items-center'>
            <div className='bg-red-200 text-right capitalize'>
                name
            </div>
            <div className='bg-green-200 col-span-3'>
                <div className='max-w-sm'>
                <Input className='' value={'Fasdfasdf'} />
                </div>
            </div>
        </div>
    )
}