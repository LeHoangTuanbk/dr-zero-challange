'use client';

import { useState, useEffect, useRef } from 'react';
import type { MiniAppProps } from '@shared/lib/workflow/types';
import { withWorkflowStep } from '@shared/ui/mini-app/with-workflow-step';
import {
  ExtractionUploadView,
  type UploadPhase,
} from './ui/extraction-upload-view';

const UPLOAD_DURATION = 900;
const EXTRACT_DURATION = 2000;
const EXTRACT_TIMEOUT = 8000;

const ExtractionUploadContainer = ({ onComplete }: MiniAppProps) => {
  const [phase, setPhase] = useState<UploadPhase>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleFileDrop = (file: File) => {
    setFileName(file.name);
    setPhase('uploading');
    setProgress(0);
  };

  useEffect(() => {
    if (phase === 'idle') return;

    if (phase === 'uploading') {
      let p = 0;
      const interval = setInterval(() => {
        p += 12;
        setProgress(Math.min(p, 100));
        if (p >= 100) {
          clearInterval(interval);
          timerRef.current = setTimeout(() => {
            setProgress(0);
            setPhase('extracting');
          }, 200);
        }
      }, UPLOAD_DURATION / 10);
      return () => clearInterval(interval);
    }

    if (phase === 'extracting') {
      let p = 0;
      const interval = setInterval(() => {
        p += 8;
        setProgress(Math.min(p, 95));
        if (p >= 95) clearInterval(interval);
      }, EXTRACT_DURATION / 15);

      timerRef.current = setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
        setPhase('done');
      }, EXTRACT_DURATION);

      timeoutRef.current = setTimeout(() => {
        clearInterval(interval);
        if (timerRef.current) clearTimeout(timerRef.current);
        setPhase('error');
      }, EXTRACT_TIMEOUT);

      return () => {
        clearInterval(interval);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }

    if (phase === 'done') {
      timerRef.current = setTimeout(() => {
        onComplete({ fileName, extractedAt: Date.now() });
      }, 800);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, fileName, onComplete]);

  const handleRetry = () => {
    setPhase('idle');
    setFileName(null);
    setProgress(0);
  };

  return (
    <ExtractionUploadView
      phase={phase}
      fileName={fileName}
      progress={progress}
      onFileDrop={handleFileDrop}
      onRetry={handleRetry}
    />
  );
};

export const ExtractionUploadApp = withWorkflowStep(ExtractionUploadContainer, {
  skeleton: 'review',
});
