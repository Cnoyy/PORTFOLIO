"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface LetterState {
  char: string;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  velocityX: number;
  velocityY: number;
  velocityZ: number;
  translateY: number;
  translateZ: number;
  scale: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocityX: number;
  velocityY: number;
}

interface SwingTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function SwingText({ text, className = "", style }: SwingTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [letters, setLetters] = useState<LetterState[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const animationRef = useRef<number | null>(null);
  const particleIdRef = useRef(0);

  useEffect(() => {
    setLetters(
      text.split("").map((char) => ({
        char,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        velocityX: 0,
        velocityY: 0,
        velocityZ: 0,
        translateY: 0,
        translateZ: 0,
        scale: 1,
      }))
    );
  }, [text]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;

    const spans = containerRef.current.querySelectorAll("span[data-letter]");
    spans.forEach((span, index) => {
      const rect = span.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < 100) {
        const force = (100 - distance) / 100;
        
        setLetters((prev) => {
          const newLetters = [...prev];
          if (newLetters[index]) {
            // 3D effect - rotate based on mouse position relative to letter
            newLetters[index].velocityY += distX * force * 0.3;
            newLetters[index].velocityX += -distY * force * 0.2;
            newLetters[index].translateY = -force * 10;
            newLetters[index].translateZ = force * 30;
            newLetters[index].scale = 1 + force * 0.2;
          }
          return newLetters;
        });
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const animate = () => {
      setLetters((prev) =>
        prev.map((letter) => {
          // Spring physics for 3D rotation
          const springStrength = 0.1;
          const damping = 0.9;

          // Calculate spring forces
          const forceX = -letter.rotationX * springStrength;
          const forceY = -letter.rotationY * springStrength;
          const forceZ = -letter.rotationZ * springStrength;

          let newVelocityX = (letter.velocityX + forceX) * damping;
          let newVelocityY = (letter.velocityY + forceY) * damping;
          let newVelocityZ = (letter.velocityZ + forceZ) * damping;

          let newRotationX = letter.rotationX + newVelocityX;
          let newRotationY = letter.rotationY + newVelocityY;
          let newRotationZ = letter.rotationZ + newVelocityZ;

          // Clamp rotations
          newRotationX = Math.max(-30, Math.min(30, newRotationX));
          newRotationY = Math.max(-45, Math.min(45, newRotationY));

          // Reset if very small
          const threshold = 0.1;
          if (Math.abs(newRotationX) < threshold && Math.abs(newVelocityX) < threshold) {
            newRotationX = 0;
            newVelocityX = 0;
          }
          if (Math.abs(newRotationY) < threshold && Math.abs(newVelocityY) < threshold) {
            newRotationY = 0;
            newVelocityY = 0;
          }
          if (Math.abs(newRotationZ) < threshold && Math.abs(newVelocityZ) < threshold) {
            newRotationZ = 0;
            newVelocityZ = 0;
          }

          // Spring back translateY, translateZ, and scale
          const newTranslateY = letter.translateY * 0.92;
          const newTranslateZ = letter.translateZ * 0.92;
          const newScale = 1 + (letter.scale - 1) * 0.92;

          return {
            ...letter,
            rotationX: newRotationX,
            rotationY: newRotationY,
            rotationZ: newRotationZ,
            velocityX: newVelocityX,
            velocityY: newVelocityY,
            velocityZ: newVelocityZ,
            translateY: Math.abs(newTranslateY) < 0.1 ? 0 : newTranslateY,
            translateZ: Math.abs(newTranslateZ) < 0.1 ? 0 : newTranslateZ,
            scale: Math.abs(newScale - 1) < 0.01 ? 1 : newScale,
          };
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Update particles animation
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.velocityX,
            y: p.y + p.velocityY,
            opacity: p.opacity - 0.03,
            size: p.size * 0.97,
          }))
          .filter(p => p.opacity > 0)
      );
      requestAnimationFrame(animateParticles);
    };
    const id = requestAnimationFrame(animateParticles);
    return () => cancelAnimationFrame(id);
  }, []);

  // Generate particles on hover
  useEffect(() => {
    if (!isHovering || !containerRef.current) return;
    
    const interval = setInterval(() => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const newParticles: Particle[] = [];
      for (let i = 0; i < 4; i++) {
        particleIdRef.current += 1;
        newParticles.push({
          id: particleIdRef.current,
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          size: 3 + Math.random() * 6,
          opacity: 0.8,
          velocityX: (Math.random() - 0.5) * 3,
          velocityY: (Math.random() - 0.5) * 3 - 1,
        });
      }
      setParticles(prev => [...prev, ...newParticles].slice(-40));
    }, 80);

    return () => clearInterval(interval);
  }, [isHovering]);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <span 
      ref={containerRef} 
      className={`inline-block relative ${className}`}
      style={{ perspective: "800px", ...style }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Particle dots */}
      {particles.map(particle => (
        <span
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, rgba(148,163,184,${particle.opacity}) 0%, rgba(100,116,139,${particle.opacity * 0.5}) 100%)`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(148,163,184,${particle.opacity * 0.5})`,
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        />
      ))}
      {letters.map((letter, index) => (
        <span
          key={index}
          data-letter
          className="inline-block relative"
          style={{
            transform: `
              perspective(600px)
              rotateX(${letter.rotationX}deg)
              rotateY(${letter.rotationY}deg)
              translateY(${letter.translateY}px)
              translateZ(${letter.translateZ}px)
              scale(${letter.scale})
            `,
            transformOrigin: "center center",
            transformStyle: "preserve-3d",
            textShadow: `
              1px 1px 0 rgba(71,85,105,0.8),
              2px 2px 0 rgba(51,65,85,0.6),
              3px 3px 0 rgba(30,41,59,0.4),
              4px 4px 0 rgba(15,23,42,0.2),
              0 ${5 + letter.translateZ * 0.3}px ${10 + letter.translateZ * 0.5}px rgba(0,0,0,0.3)
            `,
            transition: "text-shadow 0.1s ease-out",
            ...style,
          }}
        >
          {letter.char === " " ? "\u00A0" : letter.char}
        </span>
      ))}
    </span>
  );
}
