'use client';

import { useState } from 'react';
import { Workshop } from '@/types/academy';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Eye, Trash, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createNewWorkshop } from '@/app/dashboard/academy/actions';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface CreatorWorkshopManagerProps {
  initialWorkshops: Workshop[];
}

export function CreatorWorkshopManager({ initialWorkshops }: CreatorWorkshopManagerProps) {
  const [workshops, setWorkshops] = useState<Workshop[]>(initialWorkshops);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await createNewWorkshop(formData);
      if (result.success) {
        setIsCreateOpen(false);
        // ideally revalidatePath or router.refresh()
        window.location.reload(); 
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <div>
           <h2 className="text-2xl font-bold tracking-tight text-white">Your Workshops</h2>
           <p className="text-muted-foreground">Manage your content creation courses.</p>
         </div>
         
         <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
           <DialogTrigger asChild>
             <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg shadow-purple-900/20">
               <Plus className="w-4 h-4 mr-2" />
               Create Workshop
             </Button>
           </DialogTrigger>
           <DialogContent className="glass-panel border-white/10 bg-black/90 text-white">
             <DialogHeader>
               <DialogTitle>Create New Workshop</DialogTitle>
               <DialogDescription className="text-gray-400">Start by giving your workshop a catchy title and description.</DialogDescription>
             </DialogHeader>
             <form onSubmit={handleCreateSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Workshop Title</Label>
                  <Input id="title" name="title" required placeholder="e.g. Master Viral Storytelling" className="bg-white/5 border-white/10" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" required defaultValue="content-creation">
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="content-creation">Content Creation</SelectItem>
                      <SelectItem value="storytelling">Storytelling</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="editing">Editing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select name="difficulty" required defaultValue="beginner">
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" required placeholder="What will students learn?" className="bg-white/5 border-white/10 min-h-[100px]" />
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-gray-200">
                    {loading ? 'Creating...' : 'Create Draft'}
                  </Button>
                </DialogFooter>
             </form>
           </DialogContent>
         </Dialog>
      </div>

      {/* Workshop List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workshops.map((workshop) => (
          <div key={workshop.id} className="group relative bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl">
             <div className="aspect-video relative bg-black/50">
                {workshop.thumbnailUrl && (
                  <Image src={workshop.thumbnailUrl} alt={workshop.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge variant={workshop.status === 'published' ? 'default' : 'secondary'} className="uppercase text-[10px]">
                    {workshop.status}
                  </Badge>
                </div>
             </div>
             
             <div className="p-5">
               <h3 className="font-bold text-lg text-white mb-2 line-clamp-1">{workshop.title}</h3>
               <p className="text-sm text-gray-400 mb-4 line-clamp-2">{workshop.description}</p>
               
               <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
                 <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {Math.round(workshop.totalDuration/60)}m</span>
                 <span>{workshop.totalLessons} Lessons</span>
                 <span>{workshop.studentCount} Students</span>
               </div>

               <div className="flex items-center gap-2">
                 <Button variant="outline" size="sm" className="flex-1 border-white/10 hover:bg-white/5 hover:text-white">
                   <Edit className="w-3 h-3 mr-2" /> Edit
                 </Button>
                 <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
                   <Trash className="w-4 h-4" />
                 </Button>
               </div>
             </div>
          </div>
        ))}
        {workshops.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
            You haven&apos;t created any workshops yet.
          </div>
        )}
      </div>
      
    </div>
  );
}
