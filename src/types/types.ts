export interface IChannelStatistics  {
    id: string;
    name: string;
    image: string
    subscriberCount: string;
    videoCount: string;
    publishedAt: string;
    country: string;
}
  
export interface IVideo {
    id: { videoId: string };
    snippet: {
      title: string;
      description: string;
      thumbnails: { default: { url: string } };
    };
    statistics: {
      viewCount: string;
      likeCount: string;
      dislikeCount: string;
    };
  }