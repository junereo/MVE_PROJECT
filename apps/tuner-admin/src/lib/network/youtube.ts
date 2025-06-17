// src/lib/youtube.ts
'use client';
import axios from 'axios';
const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
console.log(API_KEY);

export const fetchYoutubeVideos = async (query: string) => {
    const res = await axios.get(
        'https://www.googleapis.com/youtube/v3/search',
        {
            params: {
                part: 'snippet',
                q: query,
                type: 'video',
                maxResults: 5,
                key: API_KEY,
            },
        },
    );

    return res.data.items.map(
        (item: {
            snippet: { title: string; thumbnails: { medium: { url: string } } };
            id: { videoId: string };
        }) => ({
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium.url,
            videoId: item.id.videoId,
        }),
    );
};
