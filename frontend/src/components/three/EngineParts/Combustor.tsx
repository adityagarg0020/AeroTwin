import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEngineStore } from '../../../store/engineStore';

interface CombustorProps {
  exploded?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  xray?: boolean;
}

export function Combustor({ exploded, selected, onSelect, xray }: CombustorProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const flameRef = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material>>(null!);
  const { engineInput } = useEngineStore();
  const fuelFlow = engineInput.FuelFlow_kg_s;

  useFrame(({ clock }) => {
    if (flameRef.current) {
      const intensity = 0.5 + fuelFlow * 0.3;
      const scale = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.05;
      flameRef.current.scale.set(scale, scale * (1 + Math.sin(clock.getElapsedTime() * 2) * 0.1), scale);
      const mat = flameRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = intensity * 0.6;
    }
  });

  const pos: [number, number, number] = exploded ? [0, 1.2, 0] : [0, 0, 0];

  return (
    <group ref={groupRef} position={pos}>
      <mesh position={[2.8, 0, 0]} onClick={onSelect}>
        <cylinderGeometry args={[2.5, 2.2, 1.8, 32, 1, true]} />
        <meshStandardMaterial
          color={selected ? '#3B82F6' : '#1e293b'}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={xray ? 0.15 : 0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[2.8, 0, 0]}>
        <cylinderGeometry args={[2.2, 2.0, 1.8, 32, 1, true]} />
        <meshStandardMaterial color="#7c3aed" metalness={0.3} roughness={0.6} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      <mesh ref={flameRef} position={[2.8, 0, 0]}>
        <coneGeometry args={[1.2, 2.5, 16]} />
        <meshBasicMaterial
          color="#F97316"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[2.8, 0, 0]}>
        <coneGeometry args={[0.8, 1.5, 16]} />
        <meshBasicMaterial
          color="#FACC15"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[1.9, 0, 0]}>
        <ringGeometry args={[2.5, 2.8, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[3.7, 0, 0]}>
        <ringGeometry args={[2.2, 2.5, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
