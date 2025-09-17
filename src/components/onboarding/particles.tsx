'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocity: { x: number; y: number };
}

export function OnboardingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const createParticle = (id: number): Particle => ({
      id,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.5 + 0.2,
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
      },
    });

    // Create initial particles
    const initialParticles = Array.from({ length: 20 }, (_, i) => createParticle(i));
    setParticles(initialParticles);

    const animateParticles = () => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.velocity.x,
          y: particle.y + particle.velocity.y,
          opacity: particle.opacity * 0.995,
        })).filter(particle => particle.opacity > 0.1)
      );
    };

    const interval = setInterval(animateParticles, 50);
    
    // Add new particles periodically
    const addParticleInterval = setInterval(() => {
      setParticles(prev => {
        if (prev.length < 30) {
          return [...prev, createParticle(Date.now())];
        }
        return prev;
      });
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(addParticleInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-45">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-primary/40 to-secondary/40 blur-sm"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          }}
        />
      ))}
    </div>
  );
}