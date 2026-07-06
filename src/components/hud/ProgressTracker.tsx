import { motion } from "motion/react";

interface ProgressTrackerProps {
  completedCount: number;
  total: number;
}

export default function ProgressTracker({ completedCount, total }: ProgressTrackerProps) {
  return (
    <div style={{
      width: 258, 
      padding: 10, 
      flexDirection: 'column', 
      justifyContent: 'flex-start', 
      alignItems: 'flex-start', 
      gap: 10, 
      display: 'inline-flex'
    }}>
      <div style={{
        alignSelf: 'stretch', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'flex-start', 
        display: 'flex'
      }}>
        <div style={{
          alignSelf: 'stretch', 
          paddingTop: 10, 
          paddingBottom: 10, 
          paddingRight: 10, 
          justifyContent: 'flex-start', 
          alignItems: 'center', 
          gap: 10, 
          display: 'inline-flex'
        }}>
          <div style={{
            justifyContent: 'center', 
            display: 'flex', 
            flexDirection: 'column', 
            color: 'var(--yellow, #FFD700)', 
            fontSize: 20, 
            fontFamily: 'Space Grotesk, sans-serif', 
            fontWeight: 400, 
            lineHeight: '21px', 
            wordWrap: 'break-word', 
            textShadow: '0px 0px 14px rgba(255, 215, 0, 1.00)'
          }}>
            INDIZI RACCOLTI
          </div>
        </div>
        <div style={{
          alignSelf: 'stretch', 
          justifyContent: 'flex-start', 
          alignItems: 'center', 
          gap: 8, 
          display: 'inline-flex'
        }}>
          <div style={{ width: 36, height: 13, position: 'relative' }}>
            <div style={{
              left: 0, 
              top: 0, 
              position: 'absolute', 
              justifyContent: 'center', 
              display: 'flex', 
              flexDirection: 'column', 
              color: 'var(--yellow, #FFD700)', 
              fontSize: 12, 
              fontFamily: 'Space Grotesk, sans-serif', 
              fontWeight: 400, 
              lineHeight: '13px', 
              wordWrap: 'break-word', 
              textShadow: '0px 0px 14px rgba(255, 215, 0, 1.00)'
            }}>
              {completedCount} / {total}
            </div>
          </div>
          <div style={{
            justifyContent: 'flex-start', 
            alignItems: 'center', 
            display: 'flex'
          }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{
                width: 32, 
                padding: "8px 4px", 
                flexDirection: 'column', 
                justifyContent: 'flex-start', 
                alignItems: 'flex-start', 
                display: 'inline-flex'
              }}>
                <div style={{
                  alignSelf: 'stretch', 
                  height: 3,
                  opacity: i < completedCount ? 1 : 0.50, 
                  background: i < completedCount ? 'var(--yellow, #FFD700)' : 'var(--white, white)', 
                  border: i < completedCount ? '1px var(--yellow, #FFD700) solid' : '1px var(--white, white) solid',
                  boxShadow: i < completedCount ? '0px 0px 14px #FFD700' : 'none',
                  transition: 'all 0.3s ease'
                }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
