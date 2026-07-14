import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEngineStore } from '../../../store/engineStore';

interface CompressorProps {
  exploded?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  xray?: boolean;
}

export function Compressor({ exploded, selected, onSelect, xray }: CompressorProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const rotorRef = useRef<THREE.Group>(null!);
  const { engineInput } = useEngineStore();
  const rpm = engineInput.RPM_rev_min;

  useFrame((_, delta) => {
    if (rotorRef.current) {
      rotorRef.current.rotation.x += delta * rpm * 0.0001;
    }
  });

  const blades = useMemo(() => {
    const b = [];
    for (let stage = 0; stage < 4; stage++) {
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const zOffset = stage * 0.4 - 0.6;
        b.push({ angle, zOffset });
      }
    }
    return b;
  }, []);

  const pos: [number, number, number] = exploded ? [-3.5, 1.2, 0] : [0, 0, 0];

  return (
    <group ref={groupRef} position={pos}>
      <mesh position={[0.5, 0, 0]} onClick={onSelect}>
        <cylinderGeometry args={[2.6, 2.8, 2.0, 32, 1, true]} />
        <meshStandardMaterial
          color={selected ? '#3B82F6' : '#1e293b'}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={xray ? 0.15 : 0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group ref={rotorRef} position={[0.5, 0, 0]}>
        {blades.map((b, i) => (
          <mesh key={i} position={[0, Math.sin(b.angle) * 2.2, Math.cos(b.angle) * 2.2 + b.zOffset * 0.3]}>
            <boxGeometry args={[0.6, 0.05, 0.4]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
      </group>

      <mesh position={[0.5, 0, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 2.0, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>

      <mesh position={[-0.5, 0, 0]}>
        <ringGeometry args={[2.6, 2.9, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[1.5, 0, 0]}>
        <ringGeometry args={[2.5, 2.8, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
