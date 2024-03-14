import { CampaignsFilterValues, campaignsFilterSchema } from '@/schema/filter.schema';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { redirect } from 'next/navigation';
import React from 'react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    defaultValues: CampaignsFilterValues
    baseUrl: string
}
export function CampaignSearchInput({ defaultValues, baseUrl, ...props }: SearchInputProps) {
    async function filterUsers(formData: FormData) {
        "use server"
        const values = Object.fromEntries(formData.entries());
        const { q } = campaignsFilterSchema.parse(values);
        const searchParams = new URLSearchParams({
            ...(q && { q: q.trim() }),
            ...(defaultValues.status && { status: defaultValues.status }),
        });
        redirect(`${baseUrl}?${searchParams.toString()}`);
    }

    return (
        <form action={filterUsers} key={JSON.stringify(defaultValues)}>
            <div className='flex flex-col md:flex-row gap-4 '>
                <Input placeholder="Search" className="pl-4 grow"  {...props} name='q' defaultValue={defaultValues.q} />
                <Button variant="default" type='submit' >Search</Button>
            </div>
        </form>
    )
}
