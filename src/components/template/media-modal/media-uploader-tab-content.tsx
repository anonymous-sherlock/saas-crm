import { FileUploadDialog } from '@/components/media/file-upload-form'
import { FC } from 'react'

interface MediaUploaderTabContentProps {

}

const MediaUploaderTabContent: FC<MediaUploaderTabContentProps> = ({ }) => {
    return (
        <div >
            <FileUploadDialog />
        </div>
    )
}

export default MediaUploaderTabContent