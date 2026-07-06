import { motion, AnimatePresence } from "motion/react";

interface MissionTimerProps {
  timeLeft: number;
  isPaused: boolean;
  compact?: boolean;
}

export default function MissionTimer({ timeLeft, isPaused, compact = false }: MissionTimerProps) {

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const isWarning = timeLeft <= 30 && timeLeft > 10;
  const isUrgent = timeLeft <= 10;

  const urgentColor = '#ef4444';
  const normalColor = '#6600C5';
  const activeColor = isUrgent ? urgentColor : normalColor;
  const activeShadow = isUrgent ? 'rgba(239,68,68,1)' : 'rgba(102,0,197,1)';

  // ── Compact: small inline pill for navbar ──────────────────────
  if (compact) {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          borderRadius: 18,
          background: "#000",
          border: `1px solid ${activeColor}`,
          boxShadow: `0px 0px 10px ${activeShadow}`,
        }}
        className={isUrgent ? 'animate-pulse' : ''}
      >
        <span style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: 10,
          fontWeight: 400,
          color: activeColor,
          letterSpacing: "0.1em",
          textShadow: `0px 0px 8px ${activeShadow}`,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}>
          {isUrgent ? "⚠" : "⏱"}
        </span>
        <span
          className={isUrgent ? 'camera-shake' : ''}
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: activeColor,
            textShadow: `0px 0px 10px ${activeShadow}`,
            letterSpacing: "0.05em",
            lineHeight: 1,
          }}
        >
          {formattedTime}
        </span>
      </div>
    );
  }

  // ── Full size timer ────────────────────────────────────────────
  return (
    <div className="relative flex items-center justify-center mt-2 group">
      {/* Navbar Timer Display */}
      <div 
        data-color="purple" 
        data-size="small" 
        style={{
          width: 221, 
          padding: 20, 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: 20, 
          display: 'inline-flex'
        }}
        className={isUrgent ? 'animate-pulse' : ''}
      >
        <div style={{
          width: 191, 
          background: 'var(--black, black)', 
          boxShadow: `0px 0px 14px ${activeColor}`, 
          borderRadius: 18, 
          flexDirection: 'column', 
          justifyContent: 'flex-start', 
          alignItems: 'center', 
          display: 'flex'
        }}>
          <div style={{
            alignSelf: 'stretch', 
            padding: 10, 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: 10, 
            display: 'inline-flex'
          }}>
            <div style={{
              textAlign: 'center', 
              justifyContent: 'center', 
              display: 'flex', 
              flexDirection: 'column', 
              color: activeColor, 
              fontSize: 12, 
              fontFamily: 'Space Grotesk, sans-serif', 
              fontWeight: 400, 
              lineHeight: '13px', 
              wordWrap: 'break-word', 
              textShadow: `0px 0px 14px ${activeShadow}`
            }}>
              {isUrgent ? 'DETONAZIONE IMMINENTE' : 'TEMPO_ALLA_DETONAZIONE'}
            </div>
          </div>
          <div style={{
            padding: 10, 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: 10, 
            display: 'inline-flex'
          }}>
            <div className={isUrgent ? 'camera-shake' : ''} style={{
              textAlign: 'center', 
              justifyContent: 'center', 
              display: 'flex', 
              flexDirection: 'column', 
              color: activeColor, 
              fontSize: 40, 
              fontFamily: 'Space Grotesk, sans-serif', 
              fontWeight: 700, 
              lineHeight: '41px', 
              wordWrap: 'break-word', 
              textShadow: `0px 0px 14px ${activeShadow}`
            }}>
              {formattedTime}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Countdown for last 10 seconds */}
      <AnimatePresence>
        {isUrgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200000] pointer-events-none flex items-center justify-center bg-yellow-950/20 backdrop-blur-[2px]"
          >
            <motion.div
              key={timeLeft}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-[40vw] md:text-[30rem] font-black text-[#FFD700] italic tracking-tighter drop-shadow-[0_0_50px_rgba(255,215,0,0.8)]"
            >
              {seconds}
            </motion.div>
            
            {/* Urgent UI Overlays */}
            <div className="absolute inset-0 border-[10px] md:border-[20px] border-[#FFD700]/20 animate-pulse pointer-events-none" />
            <div className="absolute top-1/2 left-2 md:left-10 -translate-y-1/2 text-[#FFD700]/40 text-[8px] md:text-xs font-black uppercase tracking-[0.5em] md:tracking-[1em] rotate-180 [writing-mode:vertical-lr]">
              SEQUENZA_EMERGENZA_ATTIVA
            </div>
            <div className="absolute top-1/2 right-2 md:right-10 -translate-y-1/2 text-[#FFD700]/40 text-[8px] md:text-xs font-black uppercase tracking-[0.5em] md:tracking-[1em] [writing-mode:vertical-lr]">
              COLLASSO_SISTEMA_IMMINENTE
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
