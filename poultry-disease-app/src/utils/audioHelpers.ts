import { useEffect, useState, useRef } from 'react';
import { Audio } from 'expo-av';

/**
 * useAudio – simple hook to manage playback of a single audio asset.
 * Supports play, pause, stop, loading state and error handling.
 * Cleans up the sound object on unmount.
 */
export const useAudio = (source: any) => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync().catch(() => {});
      soundRef.current = null;
      setStatus('idle');
    };
  }, []);

  const loadSound = async () => {
    if (!source) {
      setError('Audio source not provided');
      setStatus('error');
      return;
    }
    try {
      setStatus('loading');
      const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: false });
      soundRef.current = sound;
      setStatus('paused'); // ready to play
    } catch (e) {
      console.warn('[useAudio] load error', e);
      setError('Failed to load audio');
      setStatus('error');
    }
  };

  const play = async () => {
    if (!soundRef.current) {
      await loadSound();
    }
    if (soundRef.current) {
      try {
        await soundRef.current.playAsync();
        setStatus('playing');
      } catch (e) {
        console.warn('[useAudio] play error', e);
        setError('Failed to play audio');
        setStatus('error');
      }
    }
  };

  const pause = async () => {
    if (soundRef.current && status === 'playing') {
      try {
        await soundRef.current.pauseAsync();
        setStatus('paused');
      } catch (e) {
        console.warn('[useAudio] pause error', e);
        setError('Failed to pause audio');
        setStatus('error');
      }
    }
  };

  const stop = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setStatus('idle');
      } catch (e) {
        console.warn('[useAudio] stop error', e);
        setError('Failed to stop audio');
        setStatus('error');
      }
    }
  };

  return { status, error, play, pause, stop };
};
