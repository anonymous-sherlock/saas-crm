import { FC } from 'react'
import { Button } from '@/ui/button'
import { Switch } from '@/ui/switch'
import { Card, CardContent, CardFooter } from '@/ui/card'
import Image from 'next/image'
import { Avatar } from '@nextui-org/react'
interface IntegrationProps {

}
const data = {
    installed: [
        {
            name: 'Google Drive',
            desc: 'Upload your files to Google Drive',
            img: '/img/thumbs/google-drive.png',
            type: 'Cloud storage',
            active: true,
        },
        {
            name: 'Slack',
            desc: 'Post to a Slack channel',
            img: '/img/thumbs/slack.png',
            type: 'Notifications and events',
            active: true,
        },
        {
            name: 'Notion',
            desc: 'Retrieve notion note to your project',
            img: '/img/thumbs/notion.png',
            type: 'Content management',
            active: false,
        },
    ],
    available: [
        {
            name: 'Jira',
            desc: 'Create Jira issues',
            img: '/img/thumbs/jira.png',
            type: 'Project management',
            active: false,
        },
        {
            name: 'Zendesk',
            desc: 'Exchange data with Zendesk',
            img: '/img/thumbs/zendesk.png',
            type: 'Customer service',
            active: false,
        },
        {
            name: 'Dropbox',
            desc: 'Exchange data with Dropbox',
            img: '/img/thumbs/dropbox.png',
            type: 'Cloud storage',
            active: false,
        },
        {
            name: 'Github',
            desc: 'Exchange files with a GitHub repository',
            img: '/img/thumbs/github.png',
            type: 'Code repositories',
            active: false,
        },
        {
            name: 'Gitlab',
            desc: 'Exchange files with a Gitlab repository',
            type: 'Code repositories',
            img: '/img/thumbs/gitlab.png',
            active: false,
        },
        {
            name: 'Figma',
            desc: 'Exchange screenshots with Figma',
            img: '/img/thumbs/figma.png',
            type: 'Design tools',
            active: false,
        },
        {
            name: 'Adobe XD',
            desc: 'Exchange screenshots with Adobe XD',
            img: '/img/thumbs/adobe-xd.png',
            type: 'Design tools',
            active: false,
        },
        {
            name: 'Sketch',
            desc: 'Exchange screenshots with Sketch',
            img: '/img/thumbs/sketch.png',
            type: 'Design tools',
            active: false,
        },
        {
            name: 'Hubspot',
            desc: 'Exchange data with Hubspot',
            img: '/img/thumbs/hubspot.png',
            type: 'Content management',
            active: false,
        },
        {
            name: 'Zapier',
            desc: 'Integrate with hundreds of services.',
            img: '/img/thumbs/zapier.png',
            type: 'Notifications and events',
            active: false,
        },
    ],
}

export const Integration: FC<IntegrationProps> = ({ }) => {
    return (
        <>
            <h5 className='font-semibold text-xl'>Installed</h5>
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-4">
                {data?.installed?.map((app) => (
                    <Card
                        key={app.name}
                        className="p-0"
                    >
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Image
                                        className="bg-transparent dark:bg-transparent"
                                        src={app.img}
                                        alt=''
                                        width={50}
                                        height={50}
                                    />
                                    <div className="ltr:ml-2 rtl:mr-2">
                                        <h6>{app.name}</h6>
                                    </div>
                                </div>
                                <Switch />
                            </div>
                            <p className="mt-6">{app.desc}</p>
                        </CardContent>
                        <CardFooter className='flex justify-end p-2'>
                            <Button variant="ghost" size="sm">
                                View Intergration
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <div className="mt-10">
                <h5 className='font-semibold text-xl'>Available</h5>
                <div className="grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-4">
                    {data?.available?.map((app) => (
                        <Card key={app.name} className="p-0"  >
                            <div className="p-6">
                                <div className="flex items-center">
                                    <Avatar
                                        className="bg-transparent dark:bg-transparent"
                                        src={app.img}
                                    />
                                    <div className="ltr:ml-2 rtl:mr-2">
                                        <h6>{app.name}</h6>
                                    </div>
                                </div>
                                <p className="mt-6">{app.desc}</p>
                            </div>

                            <CardFooter className='flex justify-end p-2'>
                                <Button variant="ghost" size="sm" >
                                    View Intergration
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    )
}

