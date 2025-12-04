"use client";

import { useRef, useState, useEffect, ReactNode } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocityX: number;
  velocityY: number;
}

interface ParticleContainerProps {
  children: ReactNode;
  className?: string;
  particleCount?: number;
  particleSize?: { min: number; max: number };
  maxParticles?: number;
}

export default function ParticleContainer({
  children,
  className = "",
  particleCount = 4,
  particleSize = { min: 3, max: 8 },
  maxParticles = 30,
}: ParticleContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const particleIdRef = useRef(0);

  // Update particles animation
  useEffect(() => {
    let animationId: number;
    const animateParticles = () => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.velocityX,
            y: p.y + p.velocityY,
            opacity: p.opacity - 0.025,
            size: p.size * 0.98,
          }))
          .filter(p => p.opacity > 0)
      );
      animationId = requestAnimationFrame(animateParticles);
    };
    animationId = requestAnimationFrame(animateParticles);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Generate particles on hover
  useEffect(() => {
    if (!isHovering || !containerRef.current) return;

    const interval = setInterval(() => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const newParticles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        particleIdRef.current += 1;
        // Spawn particles around the edges
        const edge = Math.floor(Math.random() * 4);
        let x, y;
        switch (edge) {
          case 0: // top
            x = Math.random() * rect.width;
            y = 0;
            break;
          case 1: // right
            x = rect.width;
            y = Math.random() * rect.height;
            break;
          case 2: // bottom
            x = Math.random() * rect.width;
            y = rect.height;
            break;
          default: // left
            x = 0;
            y = Math.random() * rect.height;
        }
        newParticles.push({
          id: particleIdRef.current,
          x,
          y,
          size: particleSize.min + Math.random() * (particleSize.max - particleSize.min),
          opacity: 0.9,
          velocityX: (Math.random() - 0.5) * 4,
          velocityY: (Math.random() - 0.5) * 4,
        });
      }
      setParticles(prev => [...prev, ...newParticles].slice(-maxParticles));
    }, 60);

    return () => clearInterval(interval);
  }, [isHovering, particleCount, particleSize, maxParticles]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Particle dots */}
      {particles.map(particle => (
        <div
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
            zIndex: 20,
          }}
        />
      ))}
      {children}
    </div>
  );
}
