import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import type { CassetteSide } from '../types/cassette';

interface AudioPlayerProps {
  side: CassetteSide;
}

export function AudioPlayer({ side }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Convert duration string (MM:SS) to seconds
  const durationToSeconds = (side: CassetteSide) => {
    let totalSeconds = 0;
    side.sessions.forEach(session => {
      session.tracks.forEach(track => {
        totalSeconds += track.duration_min * 60 + track.duration_sec;
      });
    });
    return totalSeconds;
  };

  // Mock duration from side duration
  useEffect(() => {
    setDuration(durationToSeconds(side));
    setCurrentTime(0);
    setIsPlaying(false);
  }, [side.filename]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const skipBackward = () => {
    setCurrentTime(Math.max(0, currentTime - 10));
  };

  const skipForward = () => {
    setCurrentTime(Math.min(duration, currentTime + 10));
  };

  // Simulate playback progress
  useEffect(() => {
    let interval: number;
    if (isPlaying && currentTime < duration) {
      interval = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration]);

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, rgb(217, 119, 6) 0%, rgb(217, 119, 6) ${(currentTime / duration) * 100}%, rgb(254, 243, 199) ${(currentTime / duration) * 100}%, rgb(254, 243, 199) 100%)`
          }}
        />
        <div className="flex justify-between text-sm text-amber-900/70">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={skipBackward}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-200 text-amber-900 hover:bg-amber-300 transition-colors"
            title="Skip backward 10s"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-lg"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </button>

          <button
            onClick={skipForward}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-200 text-amber-900 hover:bg-amber-300 transition-colors"
            title="Skip forward 10s"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={toggleMute}
            className="text-amber-900 hover:text-amber-700 transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, rgb(217, 119, 6) 0%, rgb(217, 119, 6) ${(isMuted ? 0 : volume) * 100}%, rgb(254, 243, 199) ${(isMuted ? 0 : volume) * 100}%, rgb(254, 243, 199) 100%)`
            }}
          />
        </div>
      </div>

      {/* Playback info */}
      <div className="text-center text-sm text-amber-900/60">
        {isPlaying ? (
          <span>▶ Now playing Side {side.side_letter}</span>
        ) : (
          <span>⏸ Ready to play</span>
        )}
      </div>
    </div>
  );
}