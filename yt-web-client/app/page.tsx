"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { getVideos } from "./firebase/functions";
import { Heart, Bookmark, Loader } from "lucide-react";



// Fake comments data
const fakeComments = [
  { id: 1, user: "EmmaJ", text: "This video is fire! 🔥🔥🔥" },
  { id: 2, user: "Alex_23", text: "Can't stop watching 👀 So good!" },
  { id: 3, user: "SophieSmiles", text: "You're killing it! 💪 Keep it up!" },
  { id: 4, user: "TechGuru101", text: "Mind blown 🤯 Awesome content!" },
  { id: 5, user: "LiamRocks", text: "This made my day 😊 Thanks for sharing!" },
  { id: 6, user: "AvaXO", text: "Obsessed with this 😍 More please!" },
  { id: 7, user: "JayGaming", text: "Legendary stuff 🏆 You're the best!" },
  { id: 8, user: "MiaBeauty", text: "This is everything 💖 Love your work!" },
  {
    id: 9,
    user: "EthanAdventures",
    text: "Wow, just wow! 🌟 Incredible video!",
  },
  { id: 10, user: "OliviaArt", text: "You never disappoint 🎨 So inspiring!" },
  { id: 11, user: "NoahFoodie", text: "This content is *chef's kiss* 👨‍🍳💋" },
  { id: 12, user: "ZoeyFitness", text: "You're crushing it! 💪💯 Go you!" },
];

function VideoModal({ video, onClose }) {
  const [isLoved, setIsLoved] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVideoAvailable, setIsVideoAvailable] = useState(true);
  const commentsRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (commentsRef.current) {
        setScrollPosition((prevPosition) => {
          const newPosition = prevPosition + 1;
          if (newPosition >= commentsRef.current.scrollHeight) {
            return 0;
          }
          return newPosition;
        });
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (commentsRef.current) {
      commentsRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  const handleVideoError = () => {
    setIsVideoAvailable(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-4xl aspect-video bg-zinc-800 rounded-lg overflow-hidden">
        {isVideoAvailable ? (
          <video
            src={`https://storage.googleapis.com/ycleee-yt-processed-videos/${video.filename}`}
            className="w-full h-full object-cover"
            controls={false}
            autoPlay
            onError={handleVideoError}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white">
            <Loader className="w-16 h-16 animate-spin mb-4" />
            <p className="text-xl font-semibold">Video is processing</p>
            <p className="text-sm text-gray-400 mt-2">
              Please check back later
            </p>
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white truncate">
            {video.title || "Untitled Video"}
          </h3>
          <p className="text-sm text-rose-300 line-clamp-2">
            {video.description || "No description"}
          </p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl rounded-full px-3 py-1"
        >
          ✕
        </button>
        <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-4">
          <button
            onClick={() => setIsLoved(!isLoved)}
            className={`p-3 rounded-full bg-gray-800 bg-opacity-50 transition-all duration-300 ${
              isLoved ? "text-red-500" : "text-white"
            }`}
          >
            <Heart
              size={30}
              className={`transition-transform duration-300 ${
                isLoved ? "scale-125" : "scale-100"
              }`}
              fill={isLoved ? "currentColor" : "none"}
            />
          </button>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-3 rounded-full bg-gray-800 bg-opacity-50 transition-all duration-300 ${
              isBookmarked ? "text-yellow-500" : "text-white"
            }`}
          >
            <Bookmark
              size={30}
              className={`transition-transform duration-300 ${
                isBookmarked ? "scale-125" : "scale-100"
              }`}
              fill={isBookmarked ? "currentColor" : "none"}
            />
          </button>
        </div>
        {isVideoAvailable && (
          <div
            ref={commentsRef}
            className="absolute right-4 bottom-10 w-64 h-16 overflow-hidden"
          >
            <div className="space-y-2 animate-scroll">
              {fakeComments.concat(fakeComments).map((comment, index) => (
                <div
                  key={`${comment.id}-${index}`}
                  className="text-white text-sm bg-gray-800 bg-opacity-50 p-2 rounded"
                >
                  <span className="font-bold">{comment.user}: </span>
                  {comment.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function VideoGrid({ videos }) {
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="group cursor-pointer"
            onClick={() => setSelectedVideo(video)}
          >
            <div className="relative aspect-video overflow-hidden rounded-lg shadow-lg">
              <Image
                src={video.thumbnailUrl || "/thumbnail.png"}
                alt={video.title || "Video thumbnail"}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-2 left-2 right-2 p-2 backdrop-blur-sm bg-black/30 rounded-lg transition-all duration-300 group-hover:bg-black/50 mr-32">
                <h3 className="text-xs font-light text-white truncate">
                  {video.title || "Untitled Video"}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </>
  );
}

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    async function fetchVideos() {
      const fetchedVideos = await getVideos();
      setVideos(fetchedVideos);
    }
    fetchVideos();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <VideoGrid videos={videos} />
    </main>
  );
}
