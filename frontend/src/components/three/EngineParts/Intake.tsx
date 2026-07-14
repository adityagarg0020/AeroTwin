import { useRef } from 'react';
import * as THREE from 'three';

interface IntakeProps {
  exploded?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  xray?: boolean;
}

export function Intake({ exploded, selected, onSelect, xray }: IntakeProps) {
  const groupRef = useRef<THREE.Group>(null!);

  const pos: [number, number, number] = exploded ? [-7, 0, 0] : [0, 0, 0];

  return (
    <group ref={groupRef} position={pos}>
      <mesh position={[3.5, 0, 0]} onClick={onSelect}>
        <cylinderGeometry args={[2.8, 3.2, 1.5, 32, 1, true]} />
        <meshStandardMaterial
          color={selected ? '#3B82F6' : '#1e293b'}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={xray ? 0.15 : 0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[4.2, 0, 0]}>
        <ringGeometry args={[2.8, 3.4, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[2.8, 0, 0]}>
        <ringGeometry args={[2.6, 3.2, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
