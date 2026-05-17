import React, { useState, useEffect, useRef } from 'https://esm.sh/react@18';
import ReactDOM from 'https://esm.sh/react-dom@18/client';
import { motion, useMotionValue, useTransform, useSpring } from 'https://esm.sh/framer-motion@10.16.4';

const IMAGES = [
  "hero section image/hero (1).png",
  "hero section image/hero (2).png",
  "hero section image/hero (3).png",
  "hero section image/hero (4).png",
  "hero section image/hero (5).png",
  "hero section image/hero (6).png"
];

// Custom Hook to manage responsive dimensions
const useWindowSize = () => {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};

const FloatingParticle = ({ index }) => {
  // Random starting position and animation parameters
  const x = useRef(Math.random() * 100);
  const y = useRef(Math.random() * 100);
  const size = useRef(Math.random() * 5 + 3); // 3px to 8px
  const duration = useRef(Math.random() * 8 + 6); // 6s to 14s
  const delay = useRef(Math.random() * -10); // Start immediately at a random phase

  return (
    <motion.div
      className="absolute rounded-full bg-blue-400/20 blur-[1px] pointer-events-none"
      style={{
        left: `${x.current}%`,
        top: `${y.current}%`,
        width: size.current,
        height: size.current,
      }}
      animate={{
        y: [0, -60, 0],
        x: [0, 20, 0],
        opacity: [0.15, 0.55, 0.15],
      }}
      transition={{
        duration: duration.current,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay.current,
      }}
    />
  );
};

const ShowcaseCard = ({ src, index, rotation, radius, cardWidth, cardHeight, totalCards, isMobile }) => {
  const baseAngle = (index * 360) / totalCards;

  // Use Framer Motion's useTransform to update card styles based on rotation at 60/120fps
  const x = useTransform(rotation, (r) => {
    const angleRad = ((r + baseAngle) * Math.PI) / 180;
    return Math.sin(angleRad) * radius;
  });

  const z = useTransform(rotation, (r) => {
    const angleRad = ((r + baseAngle) * Math.PI) / 180;
    return Math.cos(angleRad) * radius;
  });

  const scale = useTransform(rotation, (r) => {
    const angleRad = ((r + baseAngle) * Math.PI) / 180;
    const cos = Math.cos(angleRad); // -1 (back) to 1 (front)
    
    // Scale goes from 0.72 (backmost) to 1.05 (frontmost)
    return 0.72 + (cos + 1) * 0.165;
  });

  const opacity = useTransform(rotation, (r) => {
    const angleRad = ((r + baseAngle) * Math.PI) / 180;
    const cos = Math.cos(angleRad);
    
    // Opacity goes from 0.45 (back) to 1.0 (front)
    return 0.45 + (cos + 1) * 0.275;
  });

  const filter = useTransform(rotation, (r) => {
    const angleRad = ((r + baseAngle) * Math.PI) / 180;
    const cos = Math.cos(angleRad);
    
    // Dynamic blur: front is sharp (0px), back has cinematic blur (5px)
    const blurAmt = (1 - cos) * 2.5; 
    return `blur(${blurAmt}px) brightness(${0.5 + (cos + 1) * 0.25})`;
  });

  const rotateYVal = useTransform(rotation, (r) => {
    const angleRad = ((r + baseAngle) * Math.PI) / 180;
    const sin = Math.sin(angleRad);
    
    // Subtly rotate cards inward toward the center cylinder as they move to the edges
    return sin * -16;
  });

  // Unique floating animation offset per card so they bounce organicially at different rates
  const floatOffset = useRef(Math.random() * Math.PI * 2);
  const floatY = useTransform(rotation, (r) => {
    // Combine orbit angle with floating speed to create dynamic organic bounce
    const angleRad = ((r * 1.5 + baseAngle) * Math.PI) / 180 + floatOffset.current;
    
    // Stagger layout: Shift even cards slightly up, odd cards slightly down
    const staggerAmt = isMobile ? 22 : 45;
    const staggerY = index % 2 === 0 ? -staggerAmt : staggerAmt;
    
    return Math.sin(angleRad * 2) * 10 + staggerY; // Float bounce + stagger offset
  });

  return (
    <motion.div
      className="absolute origin-center"
      style={{
        x,
        z,
        y: floatY,
        scale,
        opacity,
        filter,
        rotateY: rotateYVal,
        width: cardWidth,
        height: cardHeight,
        left: `calc(50% - ${cardWidth / 2}px)`,
        top: `calc(50% - ${cardHeight / 2}px)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Premium Glassmorphism Container with static subtle sheen reflection */}
      <div
        className="relative w-full h-full rounded-xl md:rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md"
        style={{
          boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Soft elegant reflection sheen */}
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            opacity: 0.15,
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, transparent 60%, rgba(255, 255, 255, 0.05) 100%)",
            mixBlendMode: "overlay"
          }}
        />

        {/* Portfolio Website Mockup Image */}
        <img
          src={src}
          alt={`Luxury Showcase ${index + 1}`}
          className="w-full h-full object-cover select-none"
        />
      </div>
    </motion.div>
  );
};

const RotatingShowcase = () => {
  const size = useWindowSize();
  const containerRef = useRef(null);

  // Motion values for tracking cursor parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for mouse parallax movements
  const smoothMouseX = useSpring(mouseX, { damping: 30, stiffness: 80 });
  const smoothMouseY = useSpring(mouseY, { damping: 30, stiffness: 80 });

  // Rotating angle motion value
  const rotation = useMotionValue(0);

  // Setup dimensions based on screen width
  const isMobile = size.width < 768;
  const isTablet = size.width >= 768 && size.width < 1024;

  // Exact 3:2 landscape aspect ratios to match the mockup images (1536x1024)
  const cardWidth = isMobile ? 260 : (isTablet ? 360 : 450);
  const cardHeight = isMobile ? 173 : (isTablet ? 240 : 300);
  const radius = isMobile ? 130 : (isTablet ? 220 : 320);

  // continuous orbit loop
  useEffect(() => {
    let animationFrameId;
    let lastTime = performance.now();
    let currentRotation = 0;

    const animateLoop = (time) => {
      const delta = time - lastTime;
      lastTime = time;

      // Smooth constant cinematic orbit speed (0.022 degrees per millisecond)
      const speed = 0.022; 
      currentRotation = (currentRotation + speed * delta) % 360;
      rotation.set(currentRotation);

      animationFrameId = requestAnimationFrame(animateLoop);
    };

    animationFrameId = requestAnimationFrame(animateLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Normalize coordinates to range [-1, 1] relative to center
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    // Smoothly return to center
    mouseX.set(0);
    mouseY.set(0);
  };

  // Map mouse springs to container tilt rotations
  const tiltX = useTransform(smoothMouseY, [-1, 1], [15, -15]); // Up/down tilt
  const tiltY = useTransform(smoothMouseX, [-1, 1], [-15, 15]); // Left/right tilt

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[380px] md:h-[600px] flex items-center justify-center overflow-visible select-none"
      style={{
        perspective: "1600px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Background Soft Blue Ambient Glow Behind Cards */}
      <motion.div
        className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-blue-600/15 blur-[100px] md:blur-[140px] pointer-events-none z-0"
        style={{
          x: useTransform(smoothMouseX, [-1, 1], [-50, 50]),
          y: useTransform(smoothMouseY, [-1, 1], [-50, 50]),
        }}
      />

      {/* Floating Sparkles Particles in the showcase volume */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
        {Array.from({ length: 15 }).map((_, i) => (
          <FloatingParticle key={i} index={i} />
        ))}
      </div>

      {/* 3D Ring/Cylinder containing the orbiting cards */}
      <motion.div
        className="relative flex items-center justify-center w-full h-full"
        style={{
          rotateX: tiltX,
          rotateY: tiltY,
          transformStyle: "preserve-3d",
        }}
      >
        {IMAGES.map((src, i) => (
          <ShowcaseCard
            key={i}
            src={src}
            index={i}
            rotation={rotation}
            radius={radius}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            totalCards={IMAGES.length}
            isMobile={isMobile}
          />
        ))}
      </motion.div>
    </div>
  );
};

// Mount the React Application
const rootEl = document.getElementById('hero-showcase-root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<RotatingShowcase />);
}
