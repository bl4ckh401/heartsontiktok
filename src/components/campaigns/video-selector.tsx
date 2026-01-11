
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, RefreshCw, CheckCircle, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface TikTokVideo {
  id: string;
  title: string;
  cover_image_url: string;
  create_time: number;
  like_count: number;
}

interface VideoSelectorProps {
  onSelect: (video: TikTokVideo | null) => void;
  selectedVideoId?: string;
}

export function VideoSelector({ onSelect, selectedVideoId }: VideoSelectorProps) {
  const [videos, setVideos] = useState<TikTokVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/videos/list');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load videos');
      }

      setVideos(data.videos || []);
    } catch (err: any) {
      console.error('Error fetching videos:', err);
      setError('Could not load your TikTok videos. Please ensure you have granted the correct permissions.');
      toast({
        title: 'Error loading videos',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleVideoSelect = (video: TikTokVideo) => {
    if (selectedVideoId === video.id) {
        onSelect(null); // Deselect
    } else {
        onSelect(video);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Select recent text
        </h3>
        <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchVideos} 
            disabled={loading}
            type="button"
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <RefreshCw className="h-3 w-3 mr-2" />}
          Refresh List
        </Button>
      </div>

      {error ? (
        <div className="p-4 border border-destructive/50 rounded-md bg-destructive/10 text-center text-sm">
          <p className="text-destructive font-medium mb-2">{error}</p>
          <Button variant="link" size="sm" onClick={fetchVideos}>Try Again</Button>
        </div>
      ) : (
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                    <p>Loading your videos...</p>
                </div>
            ) : videos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground text-center">
                    <Video className="h-10 w-10 mb-2 opacity-50" />
                    <p className="font-medium">No videos found</p>
                    <p className="text-xs max-w-[200px] mt-1">Post a video on TikTok then click Refresh.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {videos.map((video) => {
                        const isSelected = selectedVideoId === video.id;
                        return (
                            <div 
                                key={video.id}
                                onClick={() => handleVideoSelect(video)}
                                className={cn(
                                    "group relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer border-2 transition-all",
                                    isSelected 
                                        ? "border-primary ring-2 ring-primary/20" 
                                        : "border-transparent hover:border-muted-foreground/50"
                                )}
                            >
                                <Image 
                                    src={video.cover_image_url} 
                                    alt={video.title} 
                                    fill 
                                    className="object-cover"
                                />
                                <div className={cn(
                                    "absolute inset-0 bg-black/40 transition-opacity flex items-center justify-center",
                                    isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                )}>
                                    {isSelected && <CheckCircle className="h-8 w-8 text-primary fill-background" />}
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                                    <p className="text-xs text-white line-clamp-2">{video.title || 'Untitled'}</p>
                                    {video.create_time && (
                                        <p className="text-[10px] text-white/70 mt-1">
                                            {formatDistanceToNow(new Date(video.create_time * 1000), { addSuffix: true })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </ScrollArea>
      )}
    </div>
  );
}
