"use client";

import { useRef, useState, useEffect, useCallback } from "react";

type ShapeType = 'dot' | 'star' | 'diamond' | 'triangle' | 'square' | 'cube';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocityX: number;
  velocityY: number;
  baseVelocityX: number;
  baseVelocityY: number;
  shape: ShapeType;
  rotation: number;
  rotationSpeed: number;
}

const shapes: ShapeType[] = ['dot', 'star', 'diamond', 'triangle', 'square', 'cube'];

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particleIdRef = useRef(0);

  // Initialize particles
  useEffect(() => {
    const initParticles: Particle[] = [];
    const particleCount = 80; // Number of background particles

    for (let i = 0; i < particleCount; i++) {
      particleIdRef.current += 1;
      const vx = (Math.random() - 0.5) * 1.5;
      const vy = (Math.random() - 0.5) * 1.5;
      initParticles.push({
        id: particleIdRef.current,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 6 + Math.random() * 10,
        opacity: 0.3 + Math.random() * 0.4,
        velocityX: vx,
        velocityY: vy,
        baseVelocityX: vx,
        baseVelocityY: vy,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 3,
      });
    }
    setParticles(initParticles);
  }, []);

  // Track mouse position
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY + window.scrollY };
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Animate particles
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      setParticles(prev =>
        prev.map(p => {
          let newX = p.x + p.velocityX;
          let newY = p.y + p.velocityY;
          let newVelocityX = p.velocityX;
          let newVelocityY = p.velocityY;

          // Mouse repulsion effect
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const repulsionRadius = 150;

          if (distance < repulsionRadius && distance > 0) {
            const force = (repulsionRadius - distance) / repulsionRadius;
            const angle = Math.atan2(dy, dx);
            newVelocityX += Math.cos(angle) * force * 3;
            newVelocityY += Math.sin(angle) * force * 3;
          } else {
            // Gradually return to base velocity
            newVelocityX += (p.baseVelocityX - newVelocityX) * 0.02;
            newVelocityY += (p.baseVelocityY - newVelocityY) * 0.02;
          }

          // Apply friction
          newVelocityX *= 0.98;
          newVelocityY *= 0.98;

          // Wrap around screen edges
          const width = window.innerWidth;
          const height = document.documentElement.scrollHeight;

          if (newX < -20) newX = width + 20;
          if (newX > width + 20) newX = -20;
          if (newY < -20) newY = height + 20;
          if (newY > height + 20) newY = -20;

          return {
            ...p,
            x: newX,
            y: newY,
            velocityX: newVelocityX,
            velocityY: newVelocityY,
            rotation: p.rotation + p.rotationSpeed,
          };
        })
      );

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Spawn new particles occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        if (prev.length < 100) {
          particleIdRef.current += 1;
          const vx = (Math.random() - 0.5) * 1.5;
          const vy = (Math.random() - 0.5) * 1.5;
          const edge = Math.floor(Math.random() * 4);
          let x, y;
          
          switch (edge) {
            case 0: x = Math.random() * window.innerWidth; y = -20; break;
            case 1: x = window.innerWidth + 20; y = Math.random() * window.innerHeight; break;
            case 2: x = Math.random() * window.innerWidth; y = window.innerHeight + 20; break;
            default: x = -20; y = Math.random() * window.innerHeight;
          }

          return [...prev, {
            id: particleIdRef.current,
            x,
            y,
            size: 6 + Math.random() * 10,
            opacity: 0.3 + Math.random() * 0.4,
            velocityX: vx,
            velocityY: vy,
            baseVelocityX: vx,
            baseVelocityY: vy,
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 3,
          }];
        }
        return prev;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Get shape styles
  const getShapeStyle = (shape: ShapeType, size: number, opacity: number, rotation: number) => {
    const color = `rgba(148,163,184,${opacity})`;
    const colorDark = `rgba(100,116,139,${opacity * 0.5})`;
    const glow = `0 0 ${size * 2}px rgba(148,163,184,${opacity * 0.4})`;
    
    switch (shape) {
      case 'dot':
        return {
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color} 0%, ${colorDark} 100%)`,
          boxShadow: glow,
        };
      case 'star':
        return {
          width: `${size}px`,
          height: `${size}px`,
          background: 'transparent',
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          backgroundColor: color,
          boxShadow: glow,
        };
      case 'diamond':
        return {
          width: `${size}px`,
          height: `${size}px`,
          background: `linear-gradient(135deg, ${color} 0%, ${colorDark} 100%)`,
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          boxShadow: glow,
        };
      case 'triangle':
        return {
          width: `${size}px`,
          height: `${size}px`,
          background: `linear-gradient(180deg, ${color} 0%, ${colorDark} 100%)`,
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          boxShadow: glow,
        };
      case 'square':
        return {
          width: `${size}px`,
          height: `${size}px`,
          background: `linear-gradient(135deg, ${color} 0%, ${colorDark} 100%)`,
          borderRadius: '2px',
          boxShadow: glow,
        };
      case 'cube':
        return {
          width: `${size}px`,
          height: `${size}px`,
          background: `linear-gradient(135deg, ${color} 0%, ${colorDark} 50%, rgba(71,85,105,${opacity}) 100%)`,
          borderRadius: '3px',
          boxShadow: `${glow}, inset 2px 2px 4px rgba(255,255,255,0.2), inset -2px -2px 4px rgba(0,0,0,0.2)`,
        };
      default:
        return {
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color} 0%, ${colorDark} 100%)`,
          boxShadow: glow,
        };
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            transform: `translate(-50%, -50%) rotate(${particle.rotation}deg)`,
            ...getShapeStyle(particle.shape, particle.size, particle.opacity, particle.rotation),
          }}
        />
      ))}
    </div>
  );
}
