import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Intake } from './EngineParts/Intake';
import { Compressor } from './EngineParts/Compressor';
import { Combustor } from './EngineParts/Combustor';
import { Turbine } from './EngineParts/Turbine';
import { Nozzle } from './EngineParts/Nozzle';
import { AirflowParticles, SmokeParticles } from './Particles';
import { useEngineStore } from '../../store/engineStore';
import { getEngineGlowColor } from '../../utils/colors';

interface TurbojetEngineProps {
  exploded?: boolean;
  xray?: boolean;
}

export function TurbojetEngine({ exploded = false, xray = false }: TurbojetEngineProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const glowRef = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material>>(null!);
  const { predictions, selectedComponent, setSelectedComponent } = useEngineStore();


  const health = predictions?.overallHealth ?? 1;
  const glowColor = getEngineGlowColor(health);
  const isCritical = health < 0.5;

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
    if (glowRef.current && isCritical) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.3 + Math.sin(clock.getElapsedTime() * 3) * 0.2;
    }
  });

  const components = [
    { key: 'intake', Component: Intake, label: 'Intake' },
    { key: 'compressor', Component: Compressor, label: 'Compressor' },
    { key: 'combustor', Component: Combustor, label: 'Combustor' },
    { key: 'turbine', Component: Turbine, label: 'Turbine' },
    { key: 'nozzle', Component: Nozzle, label: 'Nozzle' },
  ];

  return (
    <group ref={groupRef}>
      <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.2}>
        <group>
          {components.map(({ key, Component, label }) => (
            <group key={key}>
              <Component
                exploded={exploded}
                selected={selectedComponent === key}
                onSelect={() => setSelectedComponent(key === selectedComponent ? null : key)}
                xray={xray}
              />
              {exploded && (
                <Text
                  position={
                    key === 'intake' ? [-3, -2.5, 0] :
                    key === 'compressor' ? [0.5, -2.5, 0] :
                    key === 'combustor' ? [2.8, -2.5, 0] :
                    key === 'turbine' ? [4.5, -2.5, 0] :
                    [6.2, -2.5, 0]
                  }
                  fontSize={0.3}
                  color="#3B82F6"
                  anchorX="center"
                >
                  {label}
                </Text>
              )}
            </group>
          ))}
        </group>

        <group position={[3, 0, 0]}>
          <AirflowParticles />
        </group>

        {isCritical && <SmokeParticles count={100} position={[5, 0, 0]} />}
      </Float>

      <mesh ref={glowRef} position={[3, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[3.5, 3.5, 0.1, 32]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={isCritical ? 0.3 : 0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[3, 0, 0]}>
        <cylinderGeometry args={[3.5, 3.5, 0.05, 32]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
