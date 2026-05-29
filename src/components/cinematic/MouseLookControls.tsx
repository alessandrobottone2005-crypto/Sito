import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface MouseLookControlsProps {
  enabled?: boolean;
  hoveredCountRef?: React.MutableRefObject<number>;
}

export function MouseLookControls({ enabled = true, hoveredCountRef }: MouseLookControlsProps) {
  const { camera } = useThree();
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  
  const velocity = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const isMouseInWindow = useRef(true);
  
  useEffect(() => {
    euler.current.setFromQuaternion(camera.quaternion);
  }, [camera]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse position to -1 to 1 based on window dimensions
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      mouse.current.x = x;
      mouse.current.y = y;
      isMouseInWindow.current = true;
    };

    const handleMouseLeave = () => {
      isMouseInWindow.current = false;
      mouse.current.x = 0;
      mouse.current.y = 0;
    };

    const handleMouseEnter = () => {
      isMouseInWindow.current = true;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  useFrame((state, delta) => {
    const deadzoneX = 0.2;
    const deadzoneY = 0.2;
    
    let targetVelocityX = 0;
    let targetVelocityY = 0;
    
    const isHovered = hoveredCountRef ? hoveredCountRef.current > 0 : false;
    const isPaused = (state as any).isPaused;
    
    if (enabled && isMouseInWindow.current && !isHovered && !isPaused) {
      if (Math.abs(mouse.current.x) > deadzoneX) {
        const sign = Math.sign(mouse.current.x);
        const intensity = (Math.abs(mouse.current.x) - deadzoneX) / (1 - deadzoneX);
        targetVelocityY = -sign * intensity * intensity * 1.5; 
      }
      
      if (Math.abs(mouse.current.y) > deadzoneY) {
        const sign = Math.sign(mouse.current.y);
        const intensity = (Math.abs(mouse.current.y) - deadzoneY) / (1 - deadzoneY);
        targetVelocityX = sign * intensity * intensity * 0.8;
      }
    }

    velocity.current.x = THREE.MathUtils.damp(velocity.current.x, targetVelocityX, 10, delta);
    velocity.current.y = THREE.MathUtils.damp(velocity.current.y, targetVelocityY, 10, delta);
    
    euler.current.x += velocity.current.x * delta;
    euler.current.y += velocity.current.y * delta;
    
    const PI_2 = Math.PI / 2 - 0.1;
    euler.current.x = Math.max(-PI_2, Math.min(PI_2, euler.current.x));
    
    camera.quaternion.setFromEuler(euler.current);
  });
  
  return null;
}

