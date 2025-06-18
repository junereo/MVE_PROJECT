// app/video/[videoId]/page.tsx
import { fetchYoutubeVideos } from '@/lib/youtube'; // API 만들어놨다면
import Image from 'next/image';

type Props = {
    params: {
        videoId: string;
    };
};

export default async function VideoDetail({ params }: Props) {
    const { videoId } = params;
    const video = await fetchYoutubeVideos(videoId); // 썸네일, 제목, 설명 등

    if (!video) return <div>존재하지 않는 영상입니다.</div>;

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
            <Image
                src={video.thumbnail}
                alt={video.title}
                className="rounded w-full"
            />
            <p className="mt-4 text-gray-700">{video.description}</p>
            <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mt-4 block"
            >
                유튜브에서 보기
            </a>
        </div>
    );
}
