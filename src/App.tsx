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

  useEffect(() => {
    if (channelStatistics) {
      fetchPopularVideos();
    }
  }, [channelStatistics, setMaxVideos, maxVideos]);


  const fetchPopularVideos = async () => {
    try {
      if (channelStatistics) {
        if(!maxVideos) setMaxVideos(5);
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&order=viewCount&type=video&maxResults=${maxVideos}&key=${apiKey}&channelId=${channelStatistics.id}`
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
        throw new Error('Error obtaining channel statistics');
      }
      
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const channelStats = data.items[0].statistics;
        console.log(data.items[0].id, data.items[0].snippet.country);
        setChannelStatistics({
          id: data.items[0].id,
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
    <div className="App text-center m-0">
      <h1 className="text-3xl font-bold mb-4">YouTube Channel Statistics</h1>
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
          className="border p-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Get Statistics
        </button>
      </div>

      {channelStatistics === undefined ? (
        <h1 className='text-3xl text-red-600'>This channel does not allow the use of your information or no exists</h1>
      ) : channelStatistics ? (
        <Channel
          name={channelName}
          channel={channelStatistics}
          showVideos={showVideos}
          setShowVideos={setShowVideos}
        />
      ) : null }

      {(popularVideos.length > 0 && showVideos) && (
        <div className=''>
          <h2 className="text-lg font-semibold mb-2">Popular Videos:</h2>
          <div className='grid grid-cols-2 gap-2'>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {popularVideos.map((video: IVideo, index: number) => (
                <Video
                  key={index}
                  video={video}
                />
              ))}
            </div>

            <select 
              className='h-8 w-52 border-2 border-slate-400 rounded-lg mx-auto' onChange={(e) => setMaxVideos(Number(e.target.value))}>
              <option value="">Select an option: </option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
