import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEngineStore } from '../../store/engineStore';

export function SmokeEffect() {
  const ref = useRef<THREE.Points>(null!);
  const { predictions } = useEngineStore();
  const health = predictions?.overallHealth ?? 1;
  const count = 150;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 2;
      pos[i * 3] = 6 + Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  const sizes = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) s[i] = 0.2 + Math.random() * 0.8;
    return s;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current || health >= 0.5) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += delta * (0.3 + Math.random() * 0.2);
      arr[i * 3 + 1] += delta * (0.1 + Math.random() * 0.15);
      if (arr[i * 3] > 12) arr[i * 3] = 4;
      if (arr[i * 3 + 1] > 4) arr[i * 3 + 1] = -2;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = Math.max(0, (0.5 - health) * 1.2);
  });

  if (health >= 0.5) return null;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        color="#475569"
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export function FireEffect() {
  const ref = useRef<THREE.Points>(null!);
  const { predictions, engineInput } = useEngineStore();
  const health = predictions?.overallHealth ?? 1;
  const count = 80;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = 4 + Math.random() * 3;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }
    return pos;
  }, []);

  const colors = useMemo(() => {
    const c = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = Math.random();
      if (t < 0.33) { c[i*3]=1; c[i*3+1]=0.4; c[i*3+2]=0; }
      else if (t < 0.66) { c[i*3]=1; c[i*3+1]=0.7; c[i*3+2]=0; }
      else { c[i*3]=1; c[i*3+1]=0.2; c[i*3+2]=0; }
    }
    return c;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current || health >= 0.5) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    const fuel = engineInput.FuelFlow_kg_s;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += delta * (0.5 + fuel * 0.2);
      arr[i * 3 + 1] += delta * (0.2 + Math.random() * 0.2);
      if (arr[i * 3] > 8) { arr[i * 3] = 3.5; arr[i * 3 + 1] = (Math.random() - 0.5) * 1.5; }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = Math.max(0, (0.5 - health) * 0.8);
  });

  if (health >= 0.5) return null;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
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

export function SparkEffect() {
  const ref = useRef<THREE.Points>(null!);
  const { predictions } = useEngineStore();
  const health = predictions?.overallHealth ?? 1;
  const count = 40;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.5 + Math.random() * 1.5;
      pos[i*3] = 5 + Math.cos(angle) * r;
      pos[i*3+1] = Math.sin(angle) * r * 0.5;
      pos[i*3+2] = (Math.random() - 0.5) * 0.5;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current || health >= 0.5) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i*3] += delta * (2 + Math.random() * 2);
      arr[i*3+1] += delta * (Math.random() - 0.5) * 2;
      if (arr[i*3] > 10) { arr[i*3] = 4; arr[i*3+1] = (Math.random() - 0.5) * 2; }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = Math.max(0, (0.5 - health) * 1.5);
  });

  if (health >= 0.5) return null;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#FACC15"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
