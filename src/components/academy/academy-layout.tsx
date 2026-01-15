import { ReactNode } from 'react';
import { Sparkles, GraduationCap } from 'lucide-react';

interface AcademyLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function AcademyLayout({ children, title = "Creator Academy", description = "Master the art of content creation from top creators." }: AcademyLayoutProps) {
  return (
    <div className="space-y-8 min-h-screen pb-20">
      {/* Academy Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-white/10 p-8 md:p-12 text-center md:text-left">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-500/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
              <GraduationCap className="w-8 h-8 text-purple-300" />
            </div>
            <span className="text-sm font-semibold tracking-wider text-purple-300 uppercase">Premium Learning</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            {title}
          </h1>
          
          <p className="text-lg text-white/70 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
        {children}
      </div>
    </div>
  );
}
