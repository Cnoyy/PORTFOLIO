"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

interface DiamondImageProps {
  imageUrl: string;
  className?: string;
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

export default function DiamondImage({ imageUrl, className = "" }: DiamondImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [scale, setScale] = useState(1);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [swingOffset, setSwingOffset] = useState({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);
  const breathRef = useRef<number>(0);
  const particleIdRef = useRef(0);

  // Hexagon clip path
  const hexagonClip = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

  // Momentum physics, breathing animation, and swing effect
  useEffect(() => {
    const animate = () => {
      // Breathing effect - smooth zoom in/out
      breathRef.current += 0.02;
      const breathScale = 1 + Math.sin(breathRef.current) * 0.03; // Scale between 0.97 and 1.03
      
      if (!isDragging && !isHovering) {
        setScale(breathScale);
        // Reset swing when not hovering
        setSwingOffset(prev => ({
          x: prev.x * 0.9,
          y: prev.y * 0.9
        }));
      } else {
        setScale(1.02); // Slightly larger when interacting
        // Swing effect when hovering
        const swingX = Math.sin(breathRef.current * 3) * 2;
        const swingY = Math.cos(breathRef.current * 2.5) * 2;
        setSwingOffset({ x: swingX, y: swingY });
      }

      // Update particles
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.velocityX,
            y: p.y + p.velocityY,
            opacity: p.opacity - 0.02,
            size: p.size * 0.98,
          }))
          .filter(p => p.opacity > 0)
      );

      setRotation((prev) => {
        let newX = prev.x;
        let newY = prev.y;

        if (!isDragging && !isHovering) {
          // When mouse leaves, smoothly return to default position (0, 0)
          velocityRef.current.x *= 0.9;
          velocityRef.current.y *= 0.9;
          
          newX += velocityRef.current.x;
          newY += velocityRef.current.y;
          
          // Smoothly return to 0
          newX *= 0.92;
          newY *= 0.92;
          
          // Snap to 0 when very close
          if (Math.abs(newX) < 0.1) newX = 0;
          if (Math.abs(newY) < 0.1) newY = 0;
        } else if (!isDragging && isHovering) {
          // When hovering but not dragging, apply momentum then slow down
          velocityRef.current.x *= 0.92;
          velocityRef.current.y *= 0.92;
          
          newX += velocityRef.current.x;
          newY += velocityRef.current.y;
        }

        return { x: newX, y: newY };
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDragging, isHovering]);

  // Generate particles on hover and drag/rotate
  useEffect(() => {
    if (!isHovering && !isDragging) return;
    
    // More particles when dragging/rotating
    const particleCount = isDragging ? 8 : 5;
    const maxParticles = isDragging ? 80 : 50;
    const intervalTime = isDragging ? 50 : 80;
    
    const interval = setInterval(() => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        particleIdRef.current += 1;
        const angle = Math.random() * Math.PI * 2;
        const distance = 25 + Math.random() * 30;
        newParticles.push({
          id: particleIdRef.current,
          x: 50 + Math.cos(angle) * distance,
          y: 50 + Math.sin(angle) * distance,
          size: 4 + Math.random() * 8, // Bigger dots (4-12px)
          opacity: 0.9,
          velocityX: (Math.random() - 0.5) * 3,
          velocityY: (Math.random() - 0.5) * 3 - 0.8,
        });
      }
      setParticles(prev => [...prev, ...newParticles].slice(-maxParticles));
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isHovering, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    velocityRef.current = { x: 0, y: 0 };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - lastMouseRef.current.x;
      const deltaY = e.clientY - lastMouseRef.current.y;
      
      // Store velocity for momentum
      velocityRef.current = { x: deltaY * 0.3, y: deltaX * 0.5 };
      
      setRotation((prev) => ({
        x: prev.x + deltaY * 0.5,
        y: prev.y + deltaX * 0.5,
      }));
      
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      lastMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      velocityRef.current = { x: 0, y: 0 };
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - lastMouseRef.current.x;
      const deltaY = e.touches[0].clientY - lastMouseRef.current.y;
      
      velocityRef.current = { x: deltaY * 0.3, y: deltaX * 0.5 };
      
      setRotation((prev) => ({
        x: prev.x + deltaY * 0.5,
        y: prev.y + deltaX * 0.5,
      }));
      
      lastMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative cursor-grab active:cursor-grabbing ${className}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      style={{ perspective: "1000px" }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-[5%] blur-2xl transition-opacity duration-300"
        style={{
          background: "radial-gradient(circle, rgba(148,163,184,0.5) 0%, transparent 70%)",
          clipPath: hexagonClip,
          opacity: isHovering ? 0.6 : 0.3,
        }}
      />

      {/* Particle dots on hover */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, rgba(148,163,184,${particle.opacity}) 0%, rgba(100,116,139,${particle.opacity * 0.5}) 100%)`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(148,163,184,${particle.opacity * 0.5})`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* 3D Hexagon */}
      <div
        className="relative w-full aspect-square"
        style={{
          transform: `scale(${scale}) rotateX(${rotation.x + swingOffset.x}deg) rotateY(${rotation.y + swingOffset.y}deg)`,
          transformStyle: "preserve-3d",
          transition: isHovering || isDragging ? "none" : "transform 0.1s ease-out",
        }}
      >
        {/* Main hexagon face with image */}
        <div
          className="absolute inset-[5%] overflow-hidden"
          style={{
            clipPath: hexagonClip,
            transform: "translateZ(25px)",
            boxShadow: isHovering 
              ? "0 25px 50px rgba(0,0,0,0.4), 0 0 60px rgba(148,163,184,0.3)" 
              : "0 10px 30px rgba(0,0,0,0.3)",
            transition: "box-shadow 0.3s ease-out",
          }}
        >
          <Image
            src={imageUrl}
            alt="Profile"
            fill
            className="object-cover"
            style={{ objectPosition: "center 30%" }}
            priority
            draggable={false}
          />
          {/* Shine overlay */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(
                ${135 + rotation.y * 0.5}deg, 
                rgba(255,255,255,${0.15 + Math.abs(rotation.y % 360) * 0.001}) 0%, 
                transparent 50%, 
                rgba(0,0,0,${0.1 + Math.abs(rotation.y % 360) * 0.0005}) 100%
              )`,
            }}
          />
        </div>

        {/* Hexagon border/edge - creates 3D depth effect */}
        <div
          className="absolute inset-[5%]"
          style={{
            clipPath: hexagonClip,
            transform: "translateZ(0px)",
            background: `linear-gradient(
              ${180 + (rotation.y % 360)}deg,
              rgba(226,232,240,0.9) 0%,
              rgba(148,163,184,0.8) 25%,
              rgba(100,116,139,0.8) 50%,
              rgba(71,85,105,0.9) 75%,
              rgba(51,65,85,0.9) 100%
            )`,
            boxShadow: "inset 0 0 20px rgba(255,255,255,0.1)",
          }}
        />

        {/* Back face */}
        <div
          className="absolute inset-[5%] overflow-hidden"
          style={{
            clipPath: hexagonClip,
            transform: "translateZ(-25px) rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <Image
            src={imageUrl}
            alt="Profile"
            fill
            className="object-cover"
            style={{ objectPosition: "center 30%", transform: "scaleX(-1)" }}
            priority
            draggable={false}
          />
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 100%)",
            }}
          />
        </div>

        {/* Edge highlight ring */}
        <div
          className="absolute inset-[4%] pointer-events-none"
          style={{
            clipPath: hexagonClip,
            transform: "translateZ(26px)",
            background: "transparent",
            boxShadow: `
              inset 2px 2px 4px rgba(255,255,255,0.25),
              inset -2px -2px 4px rgba(0,0,0,0.15)
            `,
          }}
        />
      </div>

      {/* Reflection/shadow below */}
      <div
        className="absolute bottom-[-10%] left-[15%] right-[15%] h-[20%] blur-xl transition-opacity duration-300"
        style={{
          background: "radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%)",
          transform: `scaleY(0.3) rotateX(80deg)`,
          opacity: isHovering ? 0.5 : 0.3,
        }}
      />
    </div>
  );
}
