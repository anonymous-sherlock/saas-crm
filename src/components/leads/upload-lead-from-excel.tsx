"use client"
import { useModal } from '@/providers/modal-provider'
import { AddLeadFormSchema, AddLeadFormType } from '@/schema/lead.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { UploadIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import CustomModal from '../global/custom-modal'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { z } from 'zod'


const UploadLeadFromExcel = () => {
  const [leadModelOpen, setLeadModelOpen] = useState<boolean>(false)
  const router = useRouter()
  const form = useForm<z.infer<typeof AddLeadFormSchema>>({
    resolver: zodResolver(AddLeadFormSchema),
    defaultValues: {
      campaignId: "",
      name: "",
      phone: "",
      address: "",

    },
  });

  async function onSubmit(values: AddLeadFormType) {
    console.log(values)
  }
  return (
    <Dialog open={leadModelOpen} onOpenChange={setLeadModelOpen}>
      <DialogTrigger asChild>
        <Button className="h-8 px-2 lg:px-3 text-sm relative">
          <UploadIcon className="w-4 h-4 mr-2" />
          Upload Leads
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            method="post">
            <DialogHeader>
              <DialogTitle>Upload Leads</DialogTitle>
              <DialogDescription>
                upload the excel or csv file to upload the leads
              </DialogDescription>
            </DialogHeader>
            <DialogContent>
              heelo
            </DialogContent>
            <DialogFooter>
              <Button type="submit">Upload Lead</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UploadLeadFromExcel
