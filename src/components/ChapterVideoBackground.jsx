import React, { memo, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDeviceProfile } from '../hooks/useDeviceProfile';

/**
 * High-Performance Dual-Video Cinematic Background
 * Sequential Playback:
 * - Stage 1: Video 1 (Jeddah City) plays first.
 * - Stage 2: Smooth crossfade into Video 2 (Clinic Sanctuary), which loops continuously.
 * - Fully hardware-accelerated with CSS opacity crossfade.
 * - Mobile & weak-device aware: pauses off-screen, releases decoders when scrolled away.
 */
function ChapterVideoBackground({
  videoSequence = null, // Array: [{ src, duration, label }, { src, loop: true, label }]
  videoSrc = null,      // Fallback single video string or array
  posterSrc,
  alt = 'Health Lines Center Physical Therapy & Rehabilitation',
  glowClass = 'bg-[#9d237a]/25',
  glowSecondaryClass = 'bg-[#629131]/20',
  brightness = 'brightness-[1.0] dark:brightness-[0.72]',
  contrast = 'contrast-[1.0] dark:contrast-[1.02]',
  parallaxY = null,
  scale = '',
  isPriority = false,
  priority = false,
  retentionMargin = '500px 0px 500px 0px',
  onSequenceChange = null,
}) {
  const isPriorityEffective = isPriority || priority;
  const containerRef = useRef(null);
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);

  const { isMobile, isWeakOrSaveData, shouldDisableVideo } = useDeviceProfile();

  // Active video sequence memoized to prevent unnecessary hook re-evaluation
  const sequence = useMemo(() => {
    return videoSequence || (videoSrc ? [{ src: videoSrc, loop: true }] : null);
  }, [videoSequence, videoSrc]);
  const hasDualVideo = Array.isArray(sequence) && sequence.length > 1;

  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [shouldMountVideo, setShouldMountVideo] = useState(
    Boolean(sequence) && isPriorityEffective && !shouldDisableVideo
  );
  const isVideoMounted = Boolean(sequence) && !shouldDisableVideo && (isPriorityEffective || shouldMountVideo);
  const [isVideo1Loaded, setIsVideo1Loaded] = useState(false);
  const [isVideo2Loaded, setIsVideo2Loaded] = useState(false);

  // Transition to next video in sequence
  const transitionToNextVideo = useCallback(() => {
    if (!hasDualVideo) return;
    setActiveVideoIndex(1);
    const v2 = video2Ref.current;
    if (v2) {
      v2.play().catch(() => {});
    }
    if (onSequenceChange) {
      onSequenceChange(1);
    }
  }, [hasDualVideo, onSequenceChange]);

  // Release non-priority video decoders when scrolled far off-screen
  useEffect(() => {
    if (!sequence || shouldDisableVideo || isPriorityEffective) return undefined;

    const container = containerRef.current;
    if (!container) return undefined;

    const retentionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldMountVideo(true);
          } else {
            const v1 = video1Ref.current;
            const v2 = video2Ref.current;
            if (v1) v1.pause();
            if (v2) v2.pause();
            setIsVideo1Loaded(false);
            setIsVideo2Loaded(false);
            setShouldMountVideo(false);
          }
        });
      },
      {
        root: null,
        rootMargin: isMobile ? '150px 0px 150px 0px' : retentionMargin,
        threshold: 0,
      }
    );

    retentionObserver.observe(container);
    return () => retentionObserver.disconnect();
  }, [sequence, shouldDisableVideo, isPriorityEffective, isMobile, retentionMargin]);

  // Playback observer & timer for dual video transition
  useEffect(() => {
    if (!sequence || !isVideoMounted || shouldDisableVideo) return undefined;

    const container = containerRef.current;
    if (!container) return undefined;

    let isSubscribed = true;
    let timerId = null;

    const v1 = video1Ref.current;
    const v2 = video2Ref.current;

    const markV1Ready = () => {
      if (isSubscribed) setIsVideo1Loaded(true);
    };
    const markV2Ready = () => {
      if (isSubscribed) setIsVideo2Loaded(true);
    };

    const safePlay = (videoEl) => {
      if (!videoEl) return;
      videoEl.muted = true;
      const playPromise = videoEl.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // On iOS Low Power Mode or strict mobile browsers, retry play on first user gesture
          const resumeOnTouch = () => {
            if (isSubscribed && videoEl) {
              videoEl.muted = true;
              videoEl.play().catch(() => {});
            }
            window.removeEventListener('touchstart', resumeOnTouch);
            window.removeEventListener('pointerdown', resumeOnTouch);
          };
          window.addEventListener('touchstart', resumeOnTouch, { once: true, passive: true });
          window.addEventListener('pointerdown', resumeOnTouch, { once: true, passive: true });
        });
      }
    };

    if (v1) {
      v1.muted = true;
      if (v1.readyState >= 2) markV1Ready();
      else {
        v1.addEventListener('loadeddata', markV1Ready);
        v1.addEventListener('canplay', markV1Ready);
        v1.addEventListener('playing', markV1Ready);
      }
    }
    if (v2) {
      v2.muted = true;
      if (v2.readyState >= 2) markV2Ready();
      else {
        v2.addEventListener('loadeddata', markV2Ready);
        v2.addEventListener('canplay', markV2Ready);
        v2.addEventListener('playing', markV2Ready);
      }
    }

    const playbackObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!isSubscribed) return;
          if (entry.isIntersecting) {
            if (activeVideoIndex === 0 && v1) {
              safePlay(v1);
            } else if (activeVideoIndex === 1 && v2) {
              safePlay(v2);
            }
          } else {
            if (v1) v1.pause();
            if (v2) v2.pause();
          }
        });
      },
      {
        root: null,
        rootMargin: isMobile ? '40px 0px 40px 0px' : '120px 0px 120px 0px',
        threshold: 0.05,
      }
    );

    playbackObserver.observe(container);

    // If dual video, schedule crossfade after duration (default 5.5s)
    if (hasDualVideo && activeVideoIndex === 0) {
      const v1Duration = sequence[0]?.duration || 5.5;
      timerId = setTimeout(() => {
        if (isSubscribed) {
          transitionToNextVideo();
        }
      }, v1Duration * 1000);
    }

    return () => {
      isSubscribed = false;
      if (timerId) clearTimeout(timerId);
      playbackObserver.disconnect();
      if (v1) {
        v1.removeEventListener('loadeddata', markV1Ready);
        v1.removeEventListener('canplay', markV1Ready);
        v1.removeEventListener('playing', markV1Ready);
        v1.pause();
      }
      if (v2) {
        v2.removeEventListener('loadeddata', markV2Ready);
        v2.removeEventListener('canplay', markV2Ready);
        v2.removeEventListener('playing', markV2Ready);
        v2.pause();
      }
    };
  }, [sequence, isVideoMounted, shouldDisableVideo, isMobile, activeVideoIndex, hasDualVideo, transitionToNextVideo]);

  const webpSrc = posterSrc
    ? posterSrc.replace(/\.jpg$/i, '.webp').replace(/\.jpeg$/i, '.webp')
    : null;

  const WrapperTag = parallaxY && !isMobile && !isWeakOrSaveData ? motion.div : 'div';
  const wrapperProps =
    parallaxY && !isMobile && !isWeakOrSaveData ? { style: { y: parallaxY } } : {};

  const v1Config = sequence?.[0];
  const v2Config = sequence?.[1];

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      <WrapperTag className="absolute inset-0 w-full h-full" {...wrapperProps}>
        {/* Optimized Static Image Fallback */}
        {posterSrc && (
          <picture className="absolute inset-0 w-full h-full">
            {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
            <img
              src={posterSrc}
              alt={alt}
              loading={isPriorityEffective ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={isPriorityEffective ? 'high' : 'auto'}
              className={`absolute inset-0 w-full h-full object-cover object-center ${brightness} ${contrast} ${scale} transition-opacity duration-700 ${
                isVideoMounted && (isVideo1Loaded || isVideo2Loaded) ? 'opacity-0' : 'opacity-100'
              }`}
            />
          </picture>
        )}

        {/* Video 1: Jeddah City / First Clip */}
        {v1Config && isVideoMounted && !shouldDisableVideo && (
          <video
            ref={video1Ref}
            poster={posterSrc}
            autoPlay
            muted
            loop={v1Config.loop ?? !hasDualVideo}
            playsInline
            preload={isPriorityEffective ? 'auto' : 'metadata'}
            aria-hidden="true"
            onEnded={() => transitionToNextVideo()}
            className={`absolute inset-0 w-full h-full object-cover object-center ${brightness} ${contrast} ${scale} transition-opacity duration-1000 ${
              isVideo1Loaded && activeVideoIndex === 0 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {Array.isArray(v1Config.src) ? (
              v1Config.src.map((src) => (
                <source key={src} src={src} type={src.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
              ))
            ) : (
              <source src={v1Config.src} type={v1Config.src.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
            )}
          </video>
        )}

        {/* Video 2: Clinic Sanctuary / Second Clip */}
        {v2Config && isVideoMounted && !shouldDisableVideo && (
          <video
            ref={video2Ref}
            autoPlay={activeVideoIndex === 1}
            muted
            loop={v2Config.loop ?? true}
            playsInline
            preload="metadata"
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover object-center ${brightness} ${contrast} ${scale} transition-opacity duration-1000 ${
              isVideo2Loaded && activeVideoIndex === 1 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {Array.isArray(v2Config.src) ? (
              v2Config.src.map((src) => (
                <source key={src} src={src} type={src.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
              ))
            ) : (
              <source src={v2Config.src} type={v2Config.src.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
            )}
          </video>
        )}

        {/* Multi-layer theme-adaptive scrim ensuring text legibility over city & clinic media */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#160720]/70 via-[#1b0826]/30 to-[#12061c]/85 dark:from-[#160720]/80 dark:via-[#220a2c]/45 dark:to-[#10180d]/90 transition-colors duration-500" />

        {/* Soft radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(16,5,24,0.65)_100%)] opacity-75" />

        {/* Atmospheric Medical Color Glows */}
        <div className={`atmosphere-glow w-[260px] h-[260px] sm:w-[480px] sm:h-[480px] -top-24 -left-24 ${glowClass}`} />
        <div className={`atmosphere-glow w-[280px] h-[280px] sm:w-[560px] sm:h-[560px] -bottom-32 -right-32 ${glowSecondaryClass}`} />
      </WrapperTag>
    </div>
  );
}

export default memo(ChapterVideoBackground);
