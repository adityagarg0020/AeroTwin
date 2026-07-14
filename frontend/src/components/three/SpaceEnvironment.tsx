import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Sphere, Trail } from '@react-three/drei';
import * as THREE from 'three';

function StarField() {
  const count = 8000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 2000;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2000 - 500;
    }
    return pos;
  }, []);

  const colors = useMemo(() => {
    const c = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const bright = 0.5 + Math.random() * 0.5;
      const tint = Math.random();
      if (tint < 0.1) { c[i*3]=1; c[i*3+1]=0.8; c[i*3+2]=0.6; }
      else if (tint < 0.2) { c[i*3]=0.6; c[i*3+1]=0.8; c[i*3+2]=1; }
      else { c[i*3]=bright; c[i*3+1]=bright; c[i*3+2]=bright; }
    }
    return c;
  }, []);

  const ref = useRef<THREE.Points>(null!);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.005;
      ref.current.rotation.x += delta * 0.002;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.8} sizeAttenuation vertexColors transparent opacity={0.9} />
    </points>
  );
}

function Nebula() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.01;
  });

  return (
    <mesh ref={meshRef} position={[-200, 50, -400]}>
      <sphereGeometry args={[80, 16, 16]} />
      <meshBasicMaterial
        color="#7C3AED"
        transparent
        opacity={0.08}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function Saturn() {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.1;
  });

  return (
    <group ref={groupRef} position={[300, 80, -600]}>
      <Sphere args={[8, 32, 32]}>
        <meshStandardMaterial color="#C8A45C" metalness={0.3} roughness={0.7} />
      </Sphere>
      <mesh rotation={[Math.PI * 0.4, 0, 0]}>
        <ringGeometry args={[12, 20, 64]} />
        <meshBasicMaterial color="#C8A45C" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI * 0.4, 0, 0]}>
        <ringGeometry args={[14, 18, 64]} />
        <meshBasicMaterial color="#D4B86A" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.05;
  });

  return (
    <group position={[-250, -60, -500]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[12, 32, 32]} />
        <meshStandardMaterial color="#1a6fb5" metalness={0.1} roughness={0.8} />
      </mesh>
      <mesh>
        <sphereGeometry args={[12.2, 32, 32]} />
        <meshBasicMaterial color="#22C55E" transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

function Moon() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = Math.sin(Date.now() * 0.0001) * 40 - 250;
      meshRef.current.position.z = Math.cos(Date.now() * 0.0001) * 40 - 500;
    }
  });

  return (
    <mesh ref={meshRef} position={[-250, -60, -500]}>
      <sphereGeometry args={[3, 16, 16]} />
      <meshStandardMaterial color="#C0C0C0" roughness={0.9} />
    </mesh>
  );
}

function Asteroids() {
  const count = 80;
  const ref = useRef<THREE.Group>(null!);
  const positions = useMemo(() => {
    const result: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 150 + Math.random() * 100;
      result.push([
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 80,
        Math.sin(angle) * radius - 400
      ]);
    }
    return result;
  }, []);

  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.02;
  });

  return (
    <group ref={ref}>
      {positions.map((p, i) => (
        <mesh key={i} position={p} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
          <dodecahedronGeometry args={[1 + Math.random() * 2, 0]} />
          <meshStandardMaterial color="#666" roughness={0.8} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function ShootingStars() {
  const count = 5;
  const trails: Array<{ start: [number, number, number]; speed: number }> = Array.from({ length: count }, () => {
    const startX = (Math.random() - 0.5) * 1000;
    const startY = Math.random() * 500 + 100;
    const startZ = -300 - Math.random() * 400;
    return { start: [startX, startY, startZ] as const, speed: 20 + Math.random() * 30 };
  });

  return (
    <>
      {trails.map((trail, i) => (
        <Trail key={i} width={0.5} length={8} color={new THREE.Color('#00E5FF')} attenuation={(t) => t * t}>
          <mesh position={trail.start}>
            <sphereGeometry args={[0.3, 4, 4]} />
            <meshBasicMaterial color="#00E5FF" />
          </mesh>
        </Trail>
      ))}
    </>
  );
}

function Comet() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_) => {
    if (ref.current) {
      ref.current.position.x += 0.3;
      ref.current.position.y -= 0.1;
      if (ref.current.position.x > 600) ref.current.position.x = -600;
      if (ref.current.position.y < -300) ref.current.position.y = 300;
    }
  });

  return (
    <group>
      <mesh ref={ref} position={[-500, 200, -800]}>
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshBasicMaterial color="#00E5FF" />
      </mesh>
      <Trail width={2} length={30} color={new THREE.Color('#3B82F6')} attenuation={(t) => t * t}>
        <mesh position={[-500, 200, -800]}>
          <sphereGeometry args={[0.1, 4, 4]} />
          <meshBasicMaterial color="#3B82F6" />
        </mesh>
      </Trail>
    </group>
  );
}

export function SpaceEnvironment() {
  return (
    <>
      <color attach="background" args={['#020617']} />
      <fog attach="fog" args={['#020617', 800, 1500]} />

      <ambientLight intensity={0.2} />
      <directionalLight position={[100, 100, 100]} intensity={0.3} />
      <pointLight position={[-200, 100, -300]} intensity={0.5} color="#3B82F6" />
      <pointLight position={[200, -50, -500]} intensity={0.3} color="#7C3AED" />

      <StarField />
      <Nebula />
      <Saturn />
      <Earth />
      <Moon />
      <Asteroids />
      <ShootingStars />
      <Comet />

      <Stars radius={500} depth={200} count={2000} factor={4} saturation={0} fade speed={0.5} />
    </>
  );
}
