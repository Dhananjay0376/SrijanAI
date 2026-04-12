"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Icosahedron, Octahedron, Float, MeshDistortMaterial, Grid } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
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

    // Using highly saturated colors so bloom catches them
    const colorTeal = new THREE.Color("#29b8b0").multiplyScalar(2.5);
    const colorCyan = new THREE.Color("#029cc1").multiplyScalar(2.5);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 15;

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
      ref.current.rotation.y += delta * 0.05;
      ref.current.rotation.x += delta * 0.02;
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
        size={0.035}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function CyberGrid() {
  const gridRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 1;
    }
  });

  return (
    <group ref={gridRef}>
      <Grid 
        position={[0, -2.8, 0]} 
        args={[30, 30]} 
        cellSize={1} 
        cellThickness={0.5} 
        cellColor={new THREE.Color("#029cc1").multiplyScalar(1.2)} 
        sectionSize={5} 
        sectionThickness={1} 
        sectionColor={new THREE.Color("#29b8b0").multiplyScalar(1.5)} 
        fadeDistance={20} 
        fadeStrength={1.5} 
      />
      <Grid 
        position={[0, 2.8, 0]} 
        rotation={[Math.PI, 0, 0]} 
        args={[30, 30]} 
        cellSize={1} 
        cellThickness={0.5} 
        cellColor={new THREE.Color("#029cc1").multiplyScalar(0.8)} 
        sectionSize={5} 
        sectionThickness={1} 
        sectionColor={new THREE.Color("#0f4743")} 
        fadeDistance={20} 
        fadeStrength={1.5} 
      />
    </group>
  );
}

function FloatingShapes() {
  const icoRef = useRef<THREE.Mesh>(null);
  const octRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (icoRef.current) {
      icoRef.current.rotation.x += delta * 0.3;
      icoRef.current.rotation.y += delta * 0.4;
    }
    if (octRef.current) {
      octRef.current.rotation.x -= delta * 0.2;
      octRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#029cc1" />
      <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#29b8b0" />
      
      <Float speed={2} rotationIntensity={2} floatIntensity={2}>
        <Icosahedron ref={icoRef} args={[1, 0]} position={[-4.5, 1, -2]}>
          <MeshDistortMaterial
            color="#0f4743"
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            metalness={0.9}
            roughness={0.1}
            distort={0.4}
            speed={2.5}
            transparent
            opacity={0.7}
          />
        </Icosahedron>
      </Float>

      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
        <Octahedron ref={octRef} args={[0.9, 0]} position={[4.5, -1.2, -3]}>
          <meshPhysicalMaterial
            color="#12544f"
            emissive="#029cc1"
            emissiveIntensity={0.8}
            metalness={1}
            roughness={0}
            transparent
            opacity={0.65}
            wireframe
          />
        </Octahedron>
      </Float>
    </>
  );
}

function CameraRig() {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    state.camera.position.x += (mouse.current.x * 1.5 - state.camera.position.x) * 0.05;
    state.camera.position.y += (mouse.current.y * 1.5 - state.camera.position.y) * 0.05;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

export function AnimatedBackground() {
  return (
    <div
      className="pointer-events-none bg-[#051110]"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
      }}
    >
      <Canvas camera={{ position: [0, 0, 3.5], fov: 65 }}>
        <fog attach="fog" args={["#051110", 3, 15]} />
        <CameraRig />
        <CyberGrid />
        <ParticleSwarm />
        <FloatingShapes />
        
        <EffectComposer>
          <Bloom luminanceThreshold={0.4} mipmapBlur intensity={1.5} radius={0.8} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

