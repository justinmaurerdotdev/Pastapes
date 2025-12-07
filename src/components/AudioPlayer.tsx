import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import type { CassetteSide } from '@/types/cassette';

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

  // Build the audio source URL from env base + filename (without extension)
  // Env var: VITE_AUDIO_BASE_URL (e.g., https://your-bucket.s3.amazonaws.com/audio)
  const audioBase = (import.meta as any).env?.VITE_AUDIO_BASE_URL as string | undefined;
  const audioSrc = `${(audioBase || '').replace(/\/$/, '')}/${side.filename}.mp3`;

  // Convert side track durations to seconds
  const durationToSeconds = (side: CassetteSide) => {
    let totalSeconds = 0;
    side.sessions.forEach(session => {
      session.tracks.forEach(track => {
        totalSeconds += track.duration_min * 60 + track.duration_sec;
      });
    });
    return totalSeconds;
  };

  // Reset player when side changes
  useEffect(() => {
    setDuration(durationToSeconds(side));
    setCurrentTime(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      // Reload metadata for the new source
      audioRef.current.load();
    }
  }, [side]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch(error => {
          console.error('Playback failed:', error);
          setIsPlaying(false);
        });
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
    }
  };

  // Sync volume and mute state with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  return (
    <div className="space-y-4">
      {/* Native audio element; src is built from env base URL + filename.mp3 */}
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        className="hidden"
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current && isFinite(audioRef.current.duration)) {
            setDuration(audioRef.current.duration);
          }
        }}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

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
            background: `linear-gradient(to right, rgb(217, 119, 6) 0%, rgb(217, 119, 6) ${duration ? (currentTime / duration) * 100 : 0}%, rgb(254, 243, 199) ${duration ? (currentTime / duration) * 100 : 0}%, rgb(254, 243, 199) 100%)`
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