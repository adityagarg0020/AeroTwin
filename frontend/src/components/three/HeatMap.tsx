import { useMemo } from 'react';
import * as THREE from 'three';
import { useEngineStore } from '../../store/engineStore';

export function HeatMapOverlay() {
  const { predictions, engineInput } = useEngineStore();
  const health = predictions?.overallHealth ?? 1;

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createLinearGradient(0, 0, 256, 0);
    const tempRatio = Math.max(0, Math.min(1, (engineInput.T4_K - 600) / 600));
    if (tempRatio < 0.25) {
      gradient.addColorStop(0, '#0000FF');
      gradient.addColorStop(0.25, '#00FFFF');
    } else if (tempRatio < 0.5) {
      gradient.addColorStop(0, '#00FF00');
      gradient.addColorStop(0.5, '#FFFF00');
    } else if (tempRatio < 0.75) {
      gradient.addColorStop(0, '#FFFF00');
      gradient.addColorStop(0.75, '#FF8C00');
    } else {
      gradient.addColorStop(0, '#FF4500');
      gradient.addColorStop(1, '#FF0000');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, [engineInput.T4_K]);

  return (
    <mesh position={[3, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[3.2, 3.2, 6.5, 64, 1, true]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
      <meshBasicMaterial
        color={health < 0.5 ? '#FF0000' : health < 0.7 ? '#FF8C00' : '#00FF00'}
        transparent
        opacity={health < 0.5 ? 0.25 : 0.1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}
