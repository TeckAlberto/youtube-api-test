import { IVideo } from "../types/types"

interface IVideoProp {
    video: IVideo
}

export default function Video({video}: IVideoProp) {
    
    
    return (
        <div className="videoItem p-4 border-2 border-slate-300 rounded-lg">
            <img
                src={video.snippet.thumbnails.default.url}
                alt={video.snippet.title}
                className="mb-2 mx-auto w-32 h-32 cursor-pointer"
            />
            <div>
            <h3 className="text-md font-semibold">{video.snippet.title}</h3>
            <p className="text-gray-600">
                Views: {video.statistics.viewCount}
                <br />
                Likes: {video.statistics.likeCount}
            </p>
            </div>
        </div>
    )
}
