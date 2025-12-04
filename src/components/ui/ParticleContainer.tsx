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
  shape: "dot" | "star";
}

interface ParticleContainerProps {
  children: ReactNode;
  className?: string;
  particleCount?: number;
  particleSize?: { min: number; max: number };
  maxParticles?: number;
  // "dots" = only round particles, "stars" = only stars, "mixed" = mix of both
  shapeMode?: "dots" | "stars" | "mixed";
  // When true, particle emission and speed increase while hovering
  intensifyOnHover?: boolean;
}

export default function ParticleContainer({
  children,
  className = "",
  particleCount = 4,
  particleSize = { min: 3, max: 8 },
  maxParticles = 30,
  shapeMode = "dots",
  intensifyOnHover = false,
}: ParticleContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const particleIdRef = useRef(0);
  const [intensity, setIntensity] = useState(1);

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

  // Increase intensity gradually while hovering (optional)
  useEffect(() => {
    if (!intensifyOnHover || !isHovering) {
      setIntensity(1);
      return;
    }

    const inc = setInterval(() => {
      setIntensity((prev) => Math.min(prev + 0.25, 4));
    }, 200);

    return () => {
      clearInterval(inc);
      setIntensity(1);
    };
  }, [isHovering, intensifyOnHover]);

  // Generate particles on hover
  useEffect(() => {
    if (!isHovering || !containerRef.current) return;

    const interval = setInterval(() => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const newParticles: Particle[] = [];
      const effectiveCount = intensifyOnHover ? Math.round(particleCount * intensity) : particleCount;

      for (let i = 0; i < effectiveCount; i++) {
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
        const shape: "dot" | "star" =
          shapeMode === "stars"
            ? "star"
            : shapeMode === "mixed"
            ? Math.random() < 0.7
              ? "star"
              : "dot"
            : "dot";

        const baseSize = particleSize.min + Math.random() * (particleSize.max - particleSize.min);

        newParticles.push({
          id: particleIdRef.current,
          x,
          y,
          size: shape === "star" ? baseSize * 1.4 : baseSize,
          opacity: 0.9,
          velocityX: (Math.random() - 0.5) * 4 * (intensifyOnHover ? intensity : 1),
          velocityY: (Math.random() - 0.5) * 4 * (intensifyOnHover ? intensity : 1),
          shape,
        });
      }
      setParticles(prev => [...prev, ...newParticles].slice(-maxParticles));
    }, 60);

    return () => clearInterval(interval);
  }, [isHovering, particleCount, particleSize, maxParticles, intensity, intensifyOnHover, shapeMode]);

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
            background:
              particle.shape === "star"
                ? `rgba(148,163,184,${particle.opacity})`
                : `radial-gradient(circle, rgba(148,163,184,${particle.opacity}) 0%, rgba(100,116,139,${particle.opacity * 0.5}) 100%)`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(148,163,184,${particle.opacity * 0.5})`,
            borderRadius: particle.shape === "dot" ? "9999px" : 0,
            clipPath:
              particle.shape === "star"
                ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
                : "none",
            transform:
              particle.shape === "star"
                ? "translate(-50%, -50%) rotate(15deg)"
                : "translate(-50%, -50%)",
            zIndex: 5,
          }}
        />
      ))}
      {children}
    </div>
  );
}
