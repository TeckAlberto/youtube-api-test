import { IChannelStatistics } from "../types/types"

interface IChannel {
    channel: IChannelStatistics;
    name: string;
    showVideos: boolean;
    setShowVideos(bool: boolean): void;
}

export default function Channel({name, channel, showVideos, setShowVideos} : IChannel) {
  return (
    <div className="grid grid-cols-2 text-left mb-4">
          <div>
            <p className='text-[18px]'>Channel: <span className='font-bold'>{name}</span></p>

            <img
              className='w48 h-48 my-12' 
              src={channel.image} 
              alt="channel image" 
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Channel Statistics:</h2>
            <p>
              Subscribers: {channel.subscriberCount}
              <br />
              Videos: {channel.videoCount}
              <br />
              Channel Created At: {new Date(channel.publishedAt).toLocaleDateString()}
            </p>

          </div>
          <button 
            className='p-3 bg-blue-400 hover:bg-blue-600 text-white rounded-md text-[18px] my-3'
            onClick={() => setShowVideos(!showVideos)}
          >
            {`${showVideos ? 'Hide videos': 'Show popular videos'}`}
          </button>
        </div>
  )
}
