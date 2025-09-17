'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Trophy, Rocket, Heart } from 'lucide-react';

interface CompletionCelebrationProps {
  isVisible: boolean;
  onClose: () => void;
}

export function CompletionCelebration({ isVisible, onClose }: CompletionCelebrationProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  useEffect(() => {
    if (!isVisible) return;

    // Create confetti effect
    const colors = ['#ff6b9d', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setConfetti(newConfetti);

    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-4">
      {/* Confetti */}
      {confetti.map(piece => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 animate-bounce"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            backgroundColor: piece.color,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
      
      <Card className="w-full max-w-md shadow-2xl border-primary/20 bg-gradient-to-br from-card/95 to-card/90 backdrop-blur-sm animate-in fade-in-0 zoom-in-95 duration-500">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse">
                <Trophy className="h-12 w-12 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-6 w-6 text-yellow-500 animate-spin" />
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Congratulations! 🎉
          </h2>
          
          <p className="text-muted-foreground mb-6">
            You've completed the tour! You're now ready to start your creator journey with Hearts on TikTok.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <Heart className="h-3 w-3 mr-1" />
              Creator Ready
            </Badge>
            <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <Rocket className="h-3 w-3 mr-1" />
              Let's Grow
            </Badge>
          </div>
          
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold"
            size="lg"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Start Creating
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}