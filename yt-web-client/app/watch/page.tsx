"use client";

import { Suspense, useRef, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Player,
  ControlBar,
  ReplayControl,
  ForwardControl,
  CurrentTimeDisplay,
  TimeDivider,
  PlaybackRateMenuButton,
  VolumeMenuButton,
} from "video-react";
import "video-react/dist/video-react.css";

export default function Watch() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WatchContent />
    </Suspense>
  );
}

function WatchContent() {
  const videoPrefix =
    "https://storage.googleapis.com/ycleee-yt-processed-videos/";
  const searchParams = useSearchParams();
  const videoSrc = searchParams.get("v");
  const playerRef = useRef(null);
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      if (playerRef.current) {
        const player = playerRef.current.video.video;
        setIsVertical(player.videoHeight > player.videoWidth);
      }
    };

    const timer = setInterval(checkOrientation, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Watch Page</h1>
      {videoSrc ? (
        <div
          className={`max-w-3xl mx-auto ${
            isVertical ? "h-[80vh]" : "aspect-video"
          }`}
        >
          <div
            className={`${isVertical ? "h-full flex items-center" : "w-full"}`}
          >
            <Player
              ref={playerRef}
              src={videoPrefix + videoSrc}
              fluid={!isVertical}
              className={
                isVertical ? "h-auto max-h-full w-auto max-w-full mx-auto" : ""
              }
            >
              <ControlBar>
                <ReplayControl seconds={10} order={1.1} />
                <ForwardControl seconds={30} order={1.2} />
                <CurrentTimeDisplay order={4.1} />
                <TimeDivider order={4.2} />
                <PlaybackRateMenuButton rates={[0.5, 1, 1.5, 2]} order={7.1} />
                <VolumeMenuButton />
              </ControlBar>
            </Player>
          </div>
        </div>
      ) : (
        <p>No video selected</p>
      )}
    </div>
  );
}
