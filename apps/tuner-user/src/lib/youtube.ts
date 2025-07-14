"use client";

import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export const fetchYoutubeVideos = async (query: string) => {
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  const urlPattern =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
  const match = query.match(urlPattern);

  if (match) {
    // URL 직접 입력한 경우: videoId 추출
    const videoId = match[1];
    const res = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "snippet",
          id: videoId,
          key: API_KEY,
        },
      }
    );

    const item = res.data.items[0];

    if (!item) return [];

    return [
      {
        music_title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnail_uri: `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
        channelTitle: item.snippet.channelTitle,
        music_uri: `https://www.youtube.com/watch?v=${videoId}`,
        select_url: `https://www.youtube.com/embed/${videoId}`,
      },
    ];
  }

  // 일반 검색어 처리
  const res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
    params: {
      part: "snippet",
      q: query,
      type: "video",
      maxResults: 5,
      key: API_KEY,
    },
  });

  return res.data.items.map((item: any) => ({
    music_title: item.snippet.title,
    artist: item.snippet.channelTitle,
    thumbnail_uri: `https://i.ytimg.com/vi/${item.id.videoId}/sddefault.jpg`,
    channelTitle: item.snippet.channelTitle,
    music_uri: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    select_url: `https://www.youtube.com/embed/${item.id.videoId}`,
  }));
};
