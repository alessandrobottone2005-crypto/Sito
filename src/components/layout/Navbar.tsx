import { motion } from "motion/react";
import { Volume2, VolumeX, ArrowLeft } from "lucide-react";
import BatmanButton from "../ui/BatmanButton";
import ProgressTracker from "../hud/ProgressTracker";
import MissionTimer from "../hud/MissionTimer";

interface NavbarProps {
  isMuted: boolean;
  onToggleMute: () => void;
  showBack?: boolean;
  onBack?: () => void;
  showPause?: boolean;
  isPaused?: boolean;
  onTogglePause?: () => void;
  completedCount?: number;
  totalClues?: number;
  missionActive?: boolean;
  timeLeft?: number;
  showPreorder?: boolean;
  onPreorder?: () => void;
}


export default function Navbar({ 
  isMuted, 
  onToggleMute, 
  showBack, 
  onBack,
  showPause,
  isPaused,
  onTogglePause,
  completedCount,
  totalClues = 5,
  missionActive,
  timeLeft,
  showPreorder,
  onPreorder
}: NavbarProps) {


  return (
    <nav className="fixed top-0 left-0 w-full z-[100000] py-4 md:py-6 px-4 md:px-10 flex justify-between items-start select-none pointer-events-none">
      {/* HUD Background (Invisible by default, only subtle glow elements) */}
      <div className="absolute inset-x-0 top-0 h-24 md:h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
      
      <div className="relative flex items-center gap-3 md:gap-6 pointer-events-auto">

        <motion.img
          whileHover={{ scale: 1.1 }}
          src="./assets/images/Navbar.png"
          alt="Transizione"
          className="h-8 md:h-10 w-auto object-contain glitch-slow flicker"
        />

        {missionActive && timeLeft !== undefined && (
          <MissionTimer 
            timeLeft={timeLeft}
            isPaused={!!isPaused}
          />
        )}
        
        {completedCount !== undefined && (
          <div className="hidden md:block">
            <ProgressTracker completedCount={completedCount} total={totalClues} />
          </div>
        )}
      </div>


      <div className="flex items-center gap-4 pointer-events-auto">
        {showBack && (
          <BatmanButton
            onClick={onBack}
            variant="ghost"
            className="group"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>Indietro</span>
            </div>
          </BatmanButton>
        )}

        {showPreorder && (
          <button
            onClick={onPreorder}
            className="mr-2 md:mr-4 text-[9px] md:text-[10px] px-3 py-1 md:px-4 md:py-1.5 border border-gold text-gold hover:bg-gold/10 hover:border-gold transition-colors uppercase tracking-widest rounded-sm cursor-pointer pointer-events-auto"
          >
            Preordina il cavaliere
          </button>
        )}

        {showPause && (
          <button
            onClick={onTogglePause}
            className="w-10 h-10 bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all hover:border-gold/60 hover:bg-gold/5 active:scale-90 group"
            title={isPaused ? "Riprendi" : "Pausa"}
          >
            {isPaused ? (
              <span className="text-gold text-lg font-black tracking-tighter ml-0.5">▶</span>
            ) : (
              <span className="text-gold text-lg font-black tracking-tighter">||</span>
            )}
          </button>
        )}

        <button
          onClick={onToggleMute}
          className="w-10 h-10 bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all hover:border-gold/60 hover:bg-gold/5 active:scale-90 group"
        >
          {isMuted ? (
            <VolumeX size={16} className="text-gold" />
          ) : (
            <Volume2 size={16} className="text-gold" />
          )}
        </button>
      </div>
    </nav>
  );
}

