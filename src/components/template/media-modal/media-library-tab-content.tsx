import MediaComponent from '@/components/media';
import { getMedia } from '@/lib/actions/media.action';
import { GetMediaFiles } from '@/types';
import { useSession } from 'next-auth/react';
import { FC, useEffect, useState } from 'react';

interface MediaLibraryTabContentProps { }

const MediaLibraryTabContent: FC<MediaLibraryTabContentProps> = () => {
    const { data: session } = useSession();
    const [data, setData] = useState<GetMediaFiles | null>(null)
    const user = session?.user;
    const actor = session?.user.actor;
    const companyId = actor ? actor.company.id ?? '' : user?.company.id

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const data = await getMedia(companyId ?? '');
                setData(data)
            } catch (error) {
                console.error('Error fetching media:', error);
            }
        };

        fetchMedia();
        return () => {

        };
    }, [companyId]);

    return <MediaComponent companyId={companyId ?? ""} data={data} />;
};

export default MediaLibraryTabContent;
