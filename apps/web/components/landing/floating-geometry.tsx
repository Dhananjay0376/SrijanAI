"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Icosahedron, Octahedron, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

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
        <Icosahedron ref={icoRef} args={[1, 0]} position={[-3, 1, -2]}>
          <MeshDistortMaterial
            color="#0f4743"
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            metalness={0.8}
            roughness={0.2}
            distort={0.4}
            speed={2}
          />
        </Icosahedron>
      </Float>

      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
        <Octahedron ref={octRef} args={[0.8, 0]} position={[3, -1, -3]}>
          <meshPhysicalMaterial
            color="#12544f"
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.8}
            wireframe
          />
        </Octahedron>
      </Float>
    </>
  );
}

export function FloatingGeometryBackground() {
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
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <FloatingShapes />
      </Canvas>
    </div>
  );
}
