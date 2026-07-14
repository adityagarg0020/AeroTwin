import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import { SpaceEnvironment } from './SpaceEnvironment';
import { TurbojetEngine } from './TurbojetEngine';
import { useEngineStore } from '../../store/engineStore';

export function EngineView({ xray }: { xray?: boolean }) {
  const { isExploded } = useEngineStore();

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden bg-space-black">
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 2, 12]} fov={35} />
        <Suspense fallback={null}>
          <SpaceEnvironment />
          <ambientLight intensity={0.1} />
          <directionalLight position={[5, 10, 5]} intensity={0.5} />
          <pointLight position={[-5, 5, -5]} intensity={0.3} color="#3B82F6" />
          <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.2} color="#3B82F6" />

          <group position={[0, -0.5, 0]}>
            <TurbojetEngine exploded={isExploded} xray={xray} />
          </group>

          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.3}
            scale={10}
            blur={2.5}
            far={4}
          />
        </Suspense>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={4}
          maxDistance={25}
          autoRotate={false}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
