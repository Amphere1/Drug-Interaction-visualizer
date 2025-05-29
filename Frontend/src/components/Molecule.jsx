import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

// More visually appealing atom colors
const atomColors = {
  C: '#222831', // Carbon: dark gray
  O: '#ff1744', // Oxygen: red
  H: '#90caf9', // Hydrogen: light blue
};

const atoms = [
  { id: 1, element: 'C', position: [0, 0, 0], color: atomColors.C },
  { id: 2, element: 'O', position: [1.5, 0, 0], color: atomColors.O },
  { id: 3, element: 'H', position: [-1.5, 0, 0], color: atomColors.H },
];

const bonds = [
  { from: 1, to: 2 },
  { from: 1, to: 3 },
];

const Atom = ({ position, color, element, transparent = false, opacity = 1 }) => (
  <mesh position={position} castShadow receiveShadow>
    <sphereGeometry args={[0.38, 32, 32]} />
    <meshPhysicalMaterial
      color={color}
      transparent={transparent}
      opacity={opacity}
      metalness={0.4}
      roughness={0.25}
      clearcoat={0.7}
      clearcoatRoughness={0.1}
      emissive={element === 'O' ? '#ff5252' : '#000'}
      emissiveIntensity={element === 'O' ? 0.25 : 0}
    />
    {/* Optional: subtle outline */}
    <mesh>
      <sphereGeometry args={[0.41, 32, 32]} />
      <meshBasicMaterial color="#fff" transparent opacity={0.08} />
    </mesh>
  </mesh>
);

const Bond = ({ start, end, transparent = false, opacity = 1 }) => {
  const ref = useRef();
  const mid = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ];
  const dir = [
    end[0] - start[0],
    end[1] - start[1],
    end[2] - start[2],
  ];
  const length = Math.sqrt(dir[0] ** 2 + dir[1] ** 2 + dir[2] ** 2);

  useEffect(() => {
    if (ref.current) {
      const up = new THREE.Vector3(0, 1, 0);
      const direction = new THREE.Vector3(...dir).normalize();
      const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);
      ref.current.quaternion.copy(quaternion);
    }
  }, [dir]);

  return (
    <mesh position={mid} ref={ref} castShadow receiveShadow>
      <cylinderGeometry args={[0.09, 0.09, length, 24]} />
      <meshPhysicalMaterial
        color="#bdbdbd"
        transparent={transparent}
        opacity={opacity * 0.7}
        metalness={0.6}
        roughness={0.2}
        clearcoat={0.5}
      />
    </mesh>
  );
};

const Molecule = ({ transparent = false, opacity = 1 }) => {
  return (
    <>
      {atoms.map(atom => (
        <Atom
          key={atom.id}
          position={atom.position}
          color={atom.color}
          element={atom.element}
          transparent={transparent}
          opacity={opacity}
        />
      ))}
      {bonds.map((bond, i) => {
        const from = atoms.find(a => a.id === bond.from).position;
        const to = atoms.find(a => a.id === bond.to).position;
        return <Bond key={i} start={from} end={to} transparent={transparent} opacity={opacity} />;
      })}
    </>
  );
};

export default Molecule;
