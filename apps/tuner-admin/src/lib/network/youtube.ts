// src/lib/youtube.ts
import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY;

export const fetchYoutubeVideos = async (query: string) => {
    const res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
        params: {
            part: "snippet",
            q: query,
            type: "video",
            maxResults: 5,
            key: "AIzaSyB8Z7l090kpX7Nltdm2L56bwE59h2U7tUs",
        },
    });

    return res.data.items.map((item: any) => ({
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        videoId: item.id.videoId,
    }));
};