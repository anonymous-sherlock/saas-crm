import { Icons } from '@/components/Icons';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Listbox, ListboxItem, ListboxSection } from '@nextui-org/react';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react'
import { FC, useState } from 'react'

interface DeleteLeadAlertProps {
    onDelete: () => void,
    isDeleting: boolean
}

export const DeleteLeadAlert: FC<DeleteLeadAlertProps> = ({ onDelete, isDeleting }) => {
    const [open, setOpen] = useState<boolean>(false)
    const { data: session, status } = useSession()
    const isAdmin = session?.user?.role === 'ADMIN';
    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

    if (!isAdmin) return null
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Listbox variant="faded" aria-label="Leads Danger zone menu">
                    <ListboxSection title="Danger zone" aria-label='Danger zone' >
                        <ListboxItem key="delete" className="text-danger" color="danger"
                            aria-label='Permanently delete Lead'
                            description="Permanently delete Lead"
                            onClick={() => setOpen(true)}
                            startContent={isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icons.DeleteIcon className={cn(iconClasses, "text-danger")} />} >
                            Delete
                        </ListboxItem>
                    </ListboxSection>
                </Listbox>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this
                        lead from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onDelete}
                        disabled={isDeleting}
                        className={buttonVariants({ variant: "destructive" })}>
                        {isDeleting ? "Deleting..." : "Delete Lead"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
