'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Options = {
  autoStopOnSilence?: boolean;
  silenceTimeout?: number;
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onFinalResult?: (transcript: string) => void;
};

export function useSpeechRecognition({
  autoStopOnSilence,
  silenceTimeout = 3_000,
  language = 'en-US',
  continuous = true,
  interimResults = true,
  onFinalResult,
}: Options = {}) {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = language;

    recognition.onaudioend = () => {
      setIsListening(false);
    };

    recognition.onaudiostart = () => {
      setIsListening(true);
    };

    // Handle speech results
    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        // setTranscript((prev) => prev + final + ' ');
        onFinalResult?.(final);
        setInterimTranscript('');
      } else {
        setInterimTranscript(interim);
      }

      // Reset silence timer on speech
      if (autoStopOnSilence && silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        }, silenceTimeout);
      }
    };

    // Handle errors
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);

      switch (event.error) {
        case 'not-allowed':
        case 'service-not-allowed':
          setError('Microphone permission denied');
          break;
        case 'no-speech':
          // Silent - let auto-stop handle this
          break;
        case 'network':
          setError('Network error - check your connection');
          break;
        case 'aborted':
          // Intentional stop - no error
          break;
        default:
          setError('Speech recognition error');
      }
    };

    // Handle recognition end
    recognition.onend = () => {
      setInterimTranscript('');
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    };

    recognitionRef.current = recognition;

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    };
  }, [autoStopOnSilence, continuous, interimResults, language, silenceTimeout]);

  const startListening = useCallback(async () => {
    if (!recognitionRef.current || !isSupported) {
      return;
    }

    try {
      setError(null);
      await recognitionRef.current.start();
      setIsListening(true);

      // Start silence timer if auto-stop enabled
      if (autoStopOnSilence) {
        silenceTimerRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        }, silenceTimeout);
      }
    } catch (err) {
      console.error('Failed to start recognition:', err);
      setError('Failed to start microphone');
    }
  }, [isSupported, autoStopOnSilence, silenceTimeout]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) {
      return;
    }

    recognitionRef.current.stop();

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setInterimTranscript('');
    setError(null);
  }, []);

  return {
    isSupported,
    isListening,
    interimTranscript,
    error,

    startListening,
    stopListening,
    resetTranscript,
  };
}
