import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEngineStore } from '../../../store/engineStore';

interface NozzleProps {
  exploded?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  xray?: boolean;
}

export function Nozzle({ exploded, selected, onSelect, xray }: NozzleProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const exhaustRef = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material>>(null!);
  const { engineInput } = useEngineStore();
  const fuelFlow = engineInput.FuelFlow_kg_s;

  useFrame(({ clock }) => {
    if (exhaustRef.current) {
      const intensity = 0.3 + fuelFlow * 0.3;
      const scale = 1 + Math.sin(clock.getElapsedTime() * 5) * 0.08;
      exhaustRef.current.scale.y = scale * 1.5;
      const mat = exhaustRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = intensity * 0.4;
    }
  });

  const pos: [number, number, number] = exploded ? [7, 0, 0] : [0, 0, 0];

  return (
    <group ref={groupRef} position={pos}>
      <mesh position={[6.2, 0, 0]} onClick={onSelect}>
        <cylinderGeometry args={[2.0, 1.5, 1.2, 32, 1, true]} />
        <meshStandardMaterial
          color={selected ? '#3B82F6' : '#1e293b'}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={xray ? 0.15 : 0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={exhaustRef} position={[7.2, 0, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[1.0, 3.0, 16]} />
        <meshBasicMaterial
          color="#F97316"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[7.2, 0, 0]}>
        <coneGeometry args={[0.6, 2.0, 16]} />
        <meshBasicMaterial
          color="#FACC15"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[5.6, 0, 0]}>
        <ringGeometry args={[2.0, 2.3, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
