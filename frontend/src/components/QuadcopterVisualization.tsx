import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function Quadcopter() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation animation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.2, 0.8]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Arms */}
      {[
        [1, 0, 1],
        [-1, 0, 1],
        [1, 0, -1],
        [-1, 0, -1],
      ].map((pos, i) => (
        <group key={i} position={[pos[0] * 0.5, pos[1], pos[2] * 0.5]}>
          <mesh rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[1.2, 0.1, 0.1]} />
            <meshStandardMaterial color="#2a2a3e" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Motor */}
          <mesh position={[pos[0] * 0.6, 0, pos[2] * 0.6]}>
            <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
            <meshStandardMaterial color="#3a3a4e" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Propeller */}
          <mesh position={[pos[0] * 0.6, 0.2, pos[2] * 0.6]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.8, 0.02, 0.1]} />
            <meshStandardMaterial color="#4a9eff" metalness={0.5} roughness={0.2} />
          </mesh>
          <mesh position={[pos[0] * 0.6, 0.2, pos[2] * 0.6]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[0.8, 0.02, 0.1]} />
            <meshStandardMaterial color="#4a9eff" metalness={0.5} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* LED indicators */}
      <mesh position={[0.3, 0.15, 0.3]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={2} />
      </mesh>
      <mesh position={[-0.3, 0.15, 0.3]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

export default function QuadcopterVisualization() {
  return (
    <div className="w-full h-[400px] bg-gradient-to-b from-background to-accent/5 rounded-lg overflow-hidden border border-border">
      <Canvas>
        <PerspectiveCamera makeDefault position={[3, 2, 3]} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={2}
          maxDistance={8}
          autoRotate
          autoRotateSpeed={0.5}
        />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#4a9eff" />
        
        <Quadcopter />
        
        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#0a0a0a" opacity={0.3} transparent />
        </mesh>
      </Canvas>
    </div>
  );
}
