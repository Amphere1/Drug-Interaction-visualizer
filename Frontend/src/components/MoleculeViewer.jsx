import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import Molecule from './Molecule';

const NUM_MOLECULES = 20;

const MoleculeViewer = () => {
  const molecules = useMemo(
    () =>
      Array.from({ length: NUM_MOLECULES }, () => ({
        position: [
          (Math.random() - 0.5) * 70,
          (Math.random() - 0.5) * 24,
          (Math.random() - 0.5) * 4,
        ],
        scale: 1 + Math.random() * 1.5,
        rotation: [
          Math.random() * Math.PI * 8,
          Math.random() * Math.PI * 4,
          Math.random() * Math.PI * 4,
        ],
      })),
    []
  );

  return (
    <Canvas camera={{ position: [0, 0, 32], fov: 70 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[2, 2, 2]} intensity={0.5} />
      <OrbitControls />
      {molecules.map((mol, i) => (
        <Float
          key={i}
          speed={3}
          rotationIntensity={3}
          floatIntensity={4}
          position={mol.position}
          rotation={mol.rotation}
          scale={[mol.scale, mol.scale, mol.scale]}
        >
          <Molecule transparent opacity={0.3} />
        </Float>
      ))}
    </Canvas>
  );
};

export default MoleculeViewer;
