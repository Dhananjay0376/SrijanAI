"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Icosahedron, Octahedron, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("THREE.Clock")) return;
    originalWarn(...args);
  };
}

function ParticleSwarm() {
  const ref = useRef<THREE.Points>(null);

  const count = 5000;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorTeal = new THREE.Color("#29b8b0");
    const colorCyan = new THREE.Color("#029cc1");

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 12;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 12;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const mix = Math.random();
      const targetColor = mix < 0.5 ? colorTeal : colorCyan;

      colors[i * 3] = targetColor.r;
      colors[i * 3 + 1] = targetColor.g;
      colors[i * 3 + 2] = targetColor.b;
    }

    return [positions, colors];
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.03;
      ref.current.rotation.x += delta * 0.015;
      
      // Floating effect
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  return (
    <Points
      ref={ref}
      positions={positions}
      colors={colors}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        vertexColors
        size={0.025}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function FloatingShapes() {
  const icoRef = useRef<THREE.Mesh>(null);
  const octRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (icoRef.current) {
      icoRef.current.rotation.x += delta * 0.2;
      icoRef.current.rotation.y += delta * 0.3;
    }
    if (octRef.current) {
      octRef.current.rotation.x -= delta * 0.1;
      octRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#029cc1" />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#29b8b0" />
      
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Icosahedron ref={icoRef} args={[1, 0]} position={[-4, 1, -2]}>
          <MeshDistortMaterial
            color="#0f4743"
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            metalness={0.8}
            roughness={0.2}
            distort={0.4}
            speed={2}
            transparent
            opacity={0.8}
          />
        </Icosahedron>
      </Float>

      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
        <Octahedron ref={octRef} args={[0.8, 0]} position={[4, -1.5, -3]}>
          <meshPhysicalMaterial
            color="#12544f"
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.6}
            wireframe
          />
        </Octahedron>
      </Float>
    </>
  );
}

export function AnimatedBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        zIndex: -1,
      }}
    >
      <Canvas camera={{ position: [0, 0, 3], fov: 60 }}>
        <ParticleSwarm />
        <FloatingShapes />
      </Canvas>
    </div>
  );
}
