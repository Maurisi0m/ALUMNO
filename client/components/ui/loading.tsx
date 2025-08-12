import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";

interface LoadingProps {
  show: boolean;
  onComplete?: () => void;
}

export default function Loading({ show, onComplete }: LoadingProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 1400); // 1.4 seconds

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background with La Salle campus */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2Fb36e4af7e41f44e28ca835fddd3c49bf%2Fa9ee0952f0354bb6804c466eac9c3940?format=webp&width=800')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-lasalle-blue/90 backdrop-blur-sm" />
      
      {/* Loading Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* La Salle Logo */}
        <div className="relative">
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <img 
              src="https://cdn.builder.io/api/v1/image/assets%2Fb36e4af7e41f44e28ca835fddd3c49bf%2F3593875d6b494a9cb99b9a85064b1311?format=webp&width=800"
              alt="Universidad La Salle Pachuca"
              className="h-16 w-auto"
            />
          </div>
          
          {/* Pulsing ring animation */}
          <div className="absolute inset-0 rounded-2xl border-4 border-lasalle-gold animate-ping opacity-30" />
          <div className="absolute inset-0 rounded-2xl border-2 border-white animate-pulse" />
        </div>

        {/* SIGEA Title */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-wider">
            SIGEA
          </h1>
          <p className="text-white/90 text-lg">
            Universidad La Salle Pachuca
          </p>
        </div>

        {/* Three Bouncing Dots */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-lasalle-gold rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1.4s' }}></div>
          <div className="w-3 h-3 bg-lasalle-gold rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1.4s' }}></div>
          <div className="w-3 h-3 bg-lasalle-gold rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1.4s' }}></div>
        </div>

        {/* Floating academic icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 text-white/10 animate-bounce">
            <GraduationCap className="h-8 w-8" style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="absolute top-1/3 right-1/4 text-white/10 animate-bounce">
            <GraduationCap className="h-6 w-6" style={{ animationDelay: '1s' }} />
          </div>
          <div className="absolute bottom-1/4 left-1/3 text-white/10 animate-bounce">
            <GraduationCap className="h-10 w-10" style={{ animationDelay: '1.5s' }} />
          </div>
          <div className="absolute bottom-1/3 right-1/3 text-white/10 animate-bounce">
            <GraduationCap className="h-7 w-7" style={{ animationDelay: '0.8s' }} />
          </div>
        </div>

        {/* Rotating border decoration */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 border-2 border-lasalle-gold/20 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
          <div className="absolute w-80 h-80 border border-white/10 rounded-full animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
        </div>
      </div>
    </div>
  );
}
