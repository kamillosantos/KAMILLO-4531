import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Icosahedron, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function DistortedCore() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.18;
    ref.current.rotation.x = Math.sin(t * 0.12) * 0.25;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.8}>
      <Icosahedron ref={ref} args={[1.35, 8]}>
        <MeshDistortMaterial
          color="#2563eb"
          emissive="#1e3a8a"
          emissiveIntensity={0.55}
          roughness={0.18}
          metalness={0.85}
          distort={0.42}
          speed={1.6}
        />
      </Icosahedron>
    </Float>
  );
}

function InnerWire() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = -state.clock.getElapsedTime() * 0.3;
  });
  return (
    <Icosahedron ref={ref} args={[1.85, 1]}>
      <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.14} />
    </Icosahedron>
  );
}

function Starfield() {
  const ref = useRef<THREE.Points>(null);
  const positions = useRef<Float32Array>(null);
  if (!positions.current) {
    const arr = new Float32Array(900 * 3);
    for (let i = 0; i < arr.length; i++) arr[i] = (Math.random() - 0.5) * 14;
    positions.current = arr;
  }
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
  });
  return (
    <Points ref={ref} positions={positions.current} stride={3}>
      <PointMaterial
        transparent
        color="#60a5fa"
        size={0.03}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
}

function MouseRig() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    camera.position.x += (pointer.x * 0.9 - camera.position.x) * 0.05;
    camera.position.y += (pointer.y * 0.6 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function Hero3D() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <pointLight position={[4, 4, 4]} intensity={2.2} color="#60a5fa" />
          <pointLight position={[-4, -2, 2]} intensity={1.6} color="#22d3ee" />
          <DistortedCore />
          <InnerWire />
          <Starfield />
          <MouseRig />
        </Suspense>
      </Canvas>
    </div>
  );
}
