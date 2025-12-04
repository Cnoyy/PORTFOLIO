"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

interface ImageCubeProps {
  images: string[];
  className?: string;
}

export default function ImageCube({ images, className = "" }: ImageCubeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  // Auto rotation and momentum physics - only when hovering
  useEffect(() => {
    const animate = () => {
      setRotation((prev) => {
        let newX = prev.x;
        let newY = prev.y;

        if (!isHovering && !isDragging) {
          // When not hovering, smoothly return to default position (0, 0)
          velocityRef.current.x *= 0.9;
          velocityRef.current.y *= 0.9;
          
          newX += velocityRef.current.x;
          newY += velocityRef.current.y;
          
          // Smoothly return to 0
          newX *= 0.9;
          newY *= 0.9;
          
          // Snap to 0 when very close
          if (Math.abs(newX) < 0.5) newX = 0;
          if (Math.abs(newY) < 0.5) newY = 0;
        } else if (isHovering && !isDragging) {
          // Auto rotate slowly when hovering
          newY += 0.5;
          
          // Apply momentum
          velocityRef.current.x *= 0.95;
          velocityRef.current.y *= 0.95;
          
          newX += velocityRef.current.x;
          newY += velocityRef.current.y;
        } else if (!isDragging) {
          // Apply momentum when not dragging
          velocityRef.current.x *= 0.95;
          velocityRef.current.y *= 0.95;
          
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
      setIsHovering(true);
      lastMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      velocityRef.current = { x: 0, y: 0 };
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsHovering(false);
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

  const cubeSize = 280;
  const halfSize = cubeSize / 2;

  // Use the provided images for each face.
  // If a slot is missing, fall back to files in /public (e.g. /s1.jpg).
  const faces = [
    { name: 'front', transform: `translateZ(${halfSize}px)`, image: images[0] || '/s3.jpg' },
    { name: 'back', transform: `translateZ(-${halfSize}px) rotateY(180deg)`, image: images[1] || '/s1.jpg' },
    { name: 'right', transform: `translateX(${halfSize}px) rotateY(90deg)`, image: images[2] || '/s2.jpg' },
    { name: 'left', transform: `translateX(-${halfSize}px) rotateY(-90deg)`, image: images[3] || '/s6.jpg' },
    { name: 'top', transform: `translateY(-${halfSize}px) rotateX(90deg)`, image: images[4] || '/s4.jpg' },
    { name: 'bottom', transform: `translateY(${halfSize}px) rotateX(-90deg)`, image: images[5] || '/s5.jpg' },
  ];

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
      style={{ 
        perspective: "1000px",
        width: cubeSize,
        height: cubeSize,
      }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 blur-3xl transition-opacity duration-500"
        style={{
          background: "radial-gradient(circle, rgba(148,163,184,0.4) 0%, transparent 70%)",
          opacity: isHovering ? 0.8 : 0.4,
          transform: "scale(1.5)",
        }}
      />

      {/* 3D Cube */}
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: isDragging ? "none" : "transform 0.1s ease-out",
        }}
      >
        {faces.map((face) => (
          <div
            key={face.name}
            className="absolute overflow-hidden"
            style={{
              width: cubeSize,
              height: cubeSize,
              transform: face.transform,
              backfaceVisibility: "hidden",
              boxShadow: isHovering 
                ? "0 0 30px rgba(148,163,184,0.5), inset 0 0 20px rgba(255,255,255,0.1)" 
                : "0 0 15px rgba(0,0,0,0.3), inset 0 0 10px rgba(255,255,255,0.05)",
              border: "2px solid rgba(148,163,184,0.3)",
              borderRadius: "8px",
            }}
          >
            <Image
              src={face.image}
              alt={`Cube face ${face.name}`}
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
                  135deg, 
                  rgba(255,255,255,0.2) 0%, 
                  transparent 50%, 
                  rgba(0,0,0,0.1) 100%
                )`,
              }}
            />
          </div>
        ))}

        {/* Edge highlights - only show when hovering or dragging */}
        {(isHovering || isDragging) && (
          <div
            className="absolute pointer-events-none"
            style={{
              width: cubeSize,
              height: cubeSize,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Glowing edges */}
            {[0, 90, 180, 270].map((angle) => (
              <div
                key={angle}
                className="absolute"
                style={{
                  width: "2px",
                  height: cubeSize,
                  background: "linear-gradient(to bottom, rgba(148,163,184,0.6), rgba(148,163,184,0.2), rgba(148,163,184,0.6))",
                  transform: `rotateY(${angle}deg) translateZ(${halfSize}px) translateX(-1px)`,
                  boxShadow: "0 0 10px rgba(148,163,184,0.5)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Shadow below */}
      <div
        className="absolute left-1/2 bottom-[-20%] w-[80%] h-[30%] blur-xl transition-opacity duration-300"
        style={{
          background: "radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)",
          transform: "translateX(-50%) scaleY(0.3)",
          opacity: isHovering ? 0.6 : 0.4,
        }}
      />
    </div>
  );
}
