import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEngineStore } from '../../store/engineStore';

export function EnhancedAirflow() {
  const count = 500;
  const ref = useRef<THREE.Points>(null!);
  const { engineInput } = useEngineStore();
  const speed = engineInput.FuelFlow_kg_s * 4 + 1;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 0.1 + Math.random() * 2.5;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3] = -2 + Math.random() * 10;
      pos[i * 3 + 1] = Math.cos(angle) * radius;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  const colors = useMemo(() => {
    const c = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = Math.random();
      c[i*3] = 0; c[i*3+1] = 0.8 + t * 0.2; c[i*3+2] = 1;
    }
    return c;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;

    const sections = [
      { start: -2, end: 1.5, mult: 0.6 },
      { start: 1.5, end: 3.5, mult: 1.3 },
      { start: 3.5, end: 5.5, mult: 1.5 },
      { start: 5.5, end: 8, mult: 1.8 },
    ];

    for (let i = 0; i < count; i++) {
      const x = arr[i * 3];
      let mult = 1;
      for (const s of sections) {
        if (x >= s.start && x < s.end) { mult = s.mult; break; }
      }
      arr[i * 3] += delta * speed * mult;
      if (arr[i * 3] > 8) {
        arr[i * 3] = -2;
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.1 + Math.random() * 2.5;
        arr[i * 3 + 1] = Math.cos(angle) * radius;
        arr[i * 3 + 2] = Math.sin(angle) * radius;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
