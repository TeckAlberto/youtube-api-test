// src/App.tsx
import { useState, useEffect } from 'react';
import { IVideo, IChannelStatistics  } from './types/types';
import Video from './components/Video';
import Channel from './components/Channel';
import './App.css';


const apiKey = 'AIzaSyDtU6pgdLudfZoDP2G9nLRaTGRfqvRwrp0';

function App() {
  const [channelName, setChannelName] = useState('');
  const [channelStatistics, setChannelStatistics] = useState<IChannelStatistics | null | undefined>(null);
  const [popularVideos, setPopularVideos] = useState<IVideo[]>([]);
  const [showVideos, setShowVideos] = useState<boolean>(false);
  const [maxVideos, setMaxVideos] = useState(5);
  const [orderVideos, setOrderVideos] = useState<string | undefined>('videoCount');

  useEffect(() => {
    if (channelStatistics) {
      fetchPopularVideos();
    }
  }, [channelStatistics, setMaxVideos, maxVideos, orderVideos, setOrderVideos]);


  const fetchPopularVideos = async () => {
    try {
      if (channelStatistics) {
        if(!maxVideos) setMaxVideos(5);
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&order=${orderVideos}&type=video&maxResults=${maxVideos}&key=${apiKey}&channelId=${channelStatistics.id}`
        );
  
        if (!response.ok) {
          throw new Error('Error getting popular videos');
        }
  
        const data = await response.json();
        const videoIds = data.items.map((item: IVideo) => item.id.videoId).join(',');
  
        const videosResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${apiKey}`
        );
  
        if (!videosResponse.ok) {
          throw new Error('Error getting video details');
        }
  
        const videosData = await videosResponse.json();
        setPopularVideos(videosData.items);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const handleSearch = async () => {
    setShowVideos(false);

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics%2CcontentOwnerDetails&forUsername=${channelName}&key=${apiKey}`
      );
      if (!response.ok) {
        setChannelStatistics(null)
        throw new Error('Error obtaining channel statistics');
      }
      
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const channelStats = data.items[0].statistics;
        
        setChannelStatistics({
          id: data.items[0].id,
          name: channelName,
          image: data.items[0].snippet.thumbnails.default.url,
          subscriberCount: channelStats.subscriberCount,
          videoCount: channelStats.videoCount,
          publishedAt: data.items[0].snippet.publishedAt,
          country: data.items[0].snippet.country
        });
      } else {
        setChannelStatistics(undefined);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="m-0 text-center App">
      <h1 className="mb-4 text-3xl font-bold">YouTube Channel Statistics</h1>
      <div className="mb-4">
        <label htmlFor="channelName" className="mr-2">
          Enter Channel Name:
        </label>
        <input
          type="text"
          id="channelName"
          placeholder="Enter channel name"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          className="p-2 border"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Get Statistics
        </button>
      </div>

      {channelStatistics === undefined ? (
        <h1 className='text-3xl text-red-600'>This channel does not allow the use of your information or no exists</h1>
      ) : channelStatistics ? (
        <Channel
          channel={channelStatistics}
          showVideos={showVideos}
          setShowVideos={setShowVideos}
        />
      ) : null }

      {(popularVideos.length > 0 && showVideos) && (
        <>
          <h2 className="mb-2 text-lg font-semibold">Popular Videos:</h2>
          <div className='grid grid-cols-2 gap-6'>
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
              {popularVideos.map((video: IVideo, index: number) => (
                <Video
                  key={index}
                  video={video}
                />
              ))}
            </div>
            <div className='flex flex-col space-y-4 '>
             <div className='p-2 border rounded-lg border-slate-600'>
              <h2 className='mb-2 font-semibold text-md'>Choose the number of videos to display</h2>
                <select 
                  className='h-8 mx-auto text-center border-2 rounded-lg w-52 border-slate-400' onChange={(e) => setMaxVideos(Number(e.target.value))}>
                  <option value="">Select an option: </option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                  <option value="25">25</option>
                </select>
              </div>
              <div className='p-2 border rounded-lg border-slate-600'>
              <h2 className='mb-2 font-semibold text-md'>Choose of way to show data</h2>
                <select 
                  className='h-8 mx-auto text-center border-2 rounded-lg w-52 border-slate-400' onChange={(e) => setOrderVideos((e.target.value))}>
                  <option value="">Select an option: </option>
                  <option value="date">Date</option>
                  <option value="relevance">Relevance</option>
                  <option value="rating">Rating</option>
                  <option value="title">Title</option>
                  <option value="viewCount">Count of views</option>
                </select>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
