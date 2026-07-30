'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './AudioPlayer.module.css';

type Props = {
  src: string;
  title?: string;
  /** Optional length from Sanity, used before the file's metadata loads. */
  durationHint?: number;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

const SPEEDS = [1, 1.25, 1.5, 2];

export default function AudioPlayer({ src, title, durationHint }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationHint ?? 0);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      setIsLoading(true);
      audio
        .play()
        .then(() => setError(null))
        .catch(() => setError('This episode could not be played. Please try again.'))
        .finally(() => setIsLoading(false));
    } else {
      audio.pause();
    }
  }, []);

  const seekBy = useCallback((delta: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(Math.max(audio.currentTime + delta, 0), audio.duration || 0);
  }, []);

  const onScrub = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const next = Number(event.target.value);
    setCurrentTime(next);
    if (audio) audio.currentTime = next;
  };

  const cycleSpeed = () => {
    const nextIndex = (speedIndex + 1) % SPEEDS.length;
    setSpeedIndex(nextIndex);
    if (audioRef.current) audioRef.current.playbackRate = SPEEDS[nextIndex];
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || durationHint || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => setIsLoading(false);
    const onError = () => {
      setIsLoading(false);
      setError('This episode could not be loaded.');
    };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('durationchange', onMeta);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('durationchange', onMeta);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('error', onError);
    };
  }, [durationHint]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={styles.player}>
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className={styles.row}>
        <button
          type="button"
          onClick={togglePlay}
          className={styles.playButton}
          aria-label={isPlaying ? `Pause${title ? ` ${title}` : ''}` : `Play${title ? ` ${title}` : ''}`}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <rect x="7" y="5" width="3.5" height="14" rx="1" />
              <rect x="13.5" y="5" width="3.5" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5Z" />
            </svg>
          )}
        </button>

        <div className={styles.main}>
          {title && <p className={styles.title}>{title}</p>}

          <input
            type="range"
            className={styles.scrubber}
            min={0}
            max={duration || 0}
            step={1}
            value={currentTime}
            onChange={onScrub}
            aria-label="Seek within the episode"
            aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
            style={{ ['--progress' as string]: `${progress}%` }}
            disabled={!duration}
          />

          <div className={styles.meta}>
            <span className={styles.time}>{formatTime(currentTime)}</span>
            <div className={styles.controls}>
              <button
                type="button"
                onClick={() => seekBy(-15)}
                className={styles.textButton}
                aria-label="Skip back 15 seconds"
              >
                −15s
              </button>
              <button
                type="button"
                onClick={() => seekBy(30)}
                className={styles.textButton}
                aria-label="Skip forward 30 seconds"
              >
                +30s
              </button>
              <button
                type="button"
                onClick={cycleSpeed}
                className={styles.textButton}
                aria-label={`Playback speed, currently ${SPEEDS[speedIndex]} times`}
              >
                {SPEEDS[speedIndex]}×
              </button>
            </div>
            <span className={styles.time}>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <p className={styles.status} role="status" aria-live="polite">
        {error ? error : isLoading ? 'Loading…' : ''}
      </p>
    </div>
  );
}
