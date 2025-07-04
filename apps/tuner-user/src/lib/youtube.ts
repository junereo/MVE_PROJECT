"use client";

import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export const fetchYoutubeVideos = async (query: string) => {
  const res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
    params: {
      part: "snippet",
      q: query,
      type: "video",
      maxResults: 5,
      key: API_KEY,
    },
  });

  return res.data.items.map(
    (item: {
      snippet: {
        title: string;
        channelTitle: string;
        thumbnails: { medium: { url: string } };
      };
      id: { videoId: string };
    }) => ({
      music_title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail_uri: `https://i.ytimg.com/vi/${item.id.videoId}/sddefault.jpg`,
      channelTitle: item.snippet.channelTitle,
      music_uri: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      select_url: `https://www.youtube.com/embed/${item.id.videoId}`,
    })
  );
};
