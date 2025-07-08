import axios from 'axios';
import { YoutubeVideo } from '@/types'; // 위에서 정의한 인터페이스 위치 맞게 조정
const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY!;

interface YoutubeSearchItem {
    id: { videoId: string };
    snippet: {
        title: string;
        channelTitle: string;
        thumbnails: { medium: { url: string } };
    };
}

interface YoutubeVideoItem {
    id: string;
    snippet: {
        title: string;
        channelTitle: string;
        thumbnails: { medium: { url: string } };
    };
}

export const fetchYoutubeVideos = async (
    query: string,
    isIdSearch = false,
): Promise<YoutubeVideo[] | YoutubeVideo | null> => {
    if (isIdSearch) {
        const res = await axios.get<{ items: YoutubeVideoItem[] }>(
            'https://www.googleapis.com/youtube/v3/videos',
            {
                params: {
                    part: 'snippet',
                    id: query,
                    key: API_KEY,
                },
            },
        );

        const item = res.data.items?.[0];
        if (!item) return null;

        return {
            videoId: item.id,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium.url,
            channelTitle: item.snippet.channelTitle,
        };
    }

    const res = await axios.get<{ items: YoutubeSearchItem[] }>(
        'https://www.googleapis.com/youtube/v3/search',
        {
            params: {
                part: 'snippet',
                q: query,
                type: 'video',
                maxResults: 8,
                key: API_KEY,
            },
        },
    );

    return res.data.items.map(
        (item): YoutubeVideo => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium.url,
            channelTitle: item.snippet.channelTitle,
        }),
    );
};
