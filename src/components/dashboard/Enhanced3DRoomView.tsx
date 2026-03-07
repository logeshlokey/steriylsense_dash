"use client";
import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Camera positions
const cameraPositions: Record<string, [number, number, number]> = {
  top: [0, 60, 0],
  "3d": [40, 40, 40],
  walk: [0, 10, 40],
};

// Walls
const Walls = () => (
  <>
    {/* Back wall */}
    <mesh position={[0, 10, -30]}>
      <boxGeometry args={[60, 20, 1]} />
      <meshStandardMaterial
        color="#f1f3f5"
        roughness={0.9}
        metalness={0}
      />
    </mesh>

    {/* Front wall */}
    <mesh position={[0, 10, 30]}>
      <boxGeometry args={[60, 20, 1]} />
      <meshStandardMaterial
        color="#f1f3f5"
        roughness={0.9}
        metalness={0}
      />
    </mesh>

    {/* Left wall */}
    <mesh position={[-30, 10, 0]}>
      <boxGeometry args={[1, 20, 60]} />
      <meshStandardMaterial
        color="#eef1f4"
        roughness={0.9}
        metalness={0}
      />
    </mesh>
  </>
);

// Floor tiles using uploaded dataset
interface TileData {
  Bacteria: string;
  Count: number;
}

interface FloorProps {
  dataset: TileData[];
  selectedTile: any;
  setSelectedTile: (tile: any) => void;
}

const Floor = ({ dataset, selectedTile, setSelectedTile }: FloorProps) => {
  const tileSize = 6;
  const gridSize = 10;

  const tiles = dataset.map((row, i) => {
    const bacteria = [
      {
        name: row.Bacteria,
        count: row.Count,
        danger: row.Count > 200 ? "high" : row.Count > 100 ? "medium" : "low",
      },
    ];

    const dangerValues: Record<string, number> = { low: 20, medium: 50, high: 90 };
    const tileScore = Math.round(
      bacteria.reduce((acc, b) => acc + dangerValues[b.danger], 0) / bacteria.length
    );

    let severity: "low" | "medium" | "high" = "low";
    if (tileScore > 70) severity = "high";
    else if (tileScore > 40) severity = "medium";

    return { id: i, bacteria, tileScore, severity };
  });

 const severityColors: Record<string, string> = {
  low: "#0bef5e",     // soft green
  medium: "#ffd631",  // soft yellow
  high: "#f41616",    // soft red
};

  return (
    <group
      position={[
        -(gridSize * tileSize) / 2 + tileSize / 2,
        0,
        -(gridSize * tileSize) / 2 + tileSize / 2,
      ]}
    >
      {tiles.map((tile, index) => {
        const x = (index % gridSize) * tileSize;
        const z = Math.floor(index / gridSize) * tileSize;
        return (
          <mesh
            key={tile.id}
            position={[x, 0.01, z]}
            rotation={[-Math.PI / 2, 0, 0]}
            onClick={() => setSelectedTile(tile)}
          >
            <planeGeometry args={[tileSize, tileSize]} />
            <meshStandardMaterial
              color={severityColors[tile.severity]}
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Right panel stays exactly the same but shows dynamic data
export default function Enhanced3DRoomView({ dataset }: { dataset: TileData[] }) {
  const [viewMode, setViewMode] = useState<"top" | "3d" | "walk">("3d");
  const [selectedTile, setSelectedTile] = useState<any>(null);

  return (
    <Card className="p-4 relative bg-[#f5f7fa] text-gray-800 shadow-lg flex gap-4">
      {/* 3D Room */}
      <div className="flex-1">
        <div className="flex justify-between mb-4">
         <h2
  className="ml-2 text-2xl font-semibold text-gray-1000 tracking-wide"
  style={{ fontFamily: '"Times New Roman", serif' }}
>
  3D Room View
</h2>
          <div className="flex gap-2">
            {(["top", "3d", "walk"] as const).map((mode) => (
              <Button
                key={mode}
                size="sm"
                variant={viewMode === mode ? "default" : "outline"}
                onClick={() => setViewMode(mode)}
              >
                {mode.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-md bg-white">
  <Canvas
    className="outline-none"
    shadows
    camera={{ position: cameraPositions[viewMode] || [40, 40, 40], fov: 45 }}
  >
    <ambientLight intensity={0.9} />
<directionalLight position={[20, 30, 15]} intensity={0.7} />
    {dataset.length > 0 && (
      <Floor dataset={dataset} selectedTile={selectedTile} setSelectedTile={setSelectedTile} />
    )}
    <Walls />
    <OrbitControls enablePan enableZoom enableRotate />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
  <planeGeometry args={[70, 70]} />
  <meshStandardMaterial color="#f8fafc" />
</mesh>
  </Canvas>
</div>
      </div>

      {/* Right Panel */}
<div className="w-[380px] bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-md 
                flex-shrink-0 overflow-y-auto max-h-[600px] 
                border border-gray-200">
        <h3
  className="text-2xl font-bold text-gray-1000 mb-6 border-b border-gray-300 pb-2 tracking-wide flex items-center gap-2"
  style={{ fontFamily: '"Times New Roman", serif' }}
>
  {/* <span className="w-6 h-6">
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.8} />
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#6366f1" />
      </mesh>
    </Canvas>
  </span> */}
  Tile Analytics
</h3>

        {selectedTile ? (
          <motion.div
            key={selectedTile.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <div>
              <div className="text-lg font-semibold text-gray-700 mb-1">
  Tile Number
</div>
<div className="text-2xl font-bold text-gray-900 tracking-wide">
  #{selectedTile.id + 1}
</div>
            </div>

            <div>
              <div className="text-lg font-semibold text-gray-700 mb-2">Tile Score</div>
              <div className="text-4xl font-extrabold text-yellow-500 drop-shadow-sm">
                {selectedTile.tileScore}%
              </div>
              <div className="w-full h-5 bg-gray-300 rounded-full mt-3 shadow-inner">
                <div
                  className={`h-5 rounded-full transition-all duration-500 ${
                    selectedTile.tileScore > 70
                      ? "bg-red-500"
                      : selectedTile.tileScore > 40
                      ? "bg-yellow-400"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${selectedTile.tileScore}%` }}
                />
              </div>
            </div>

            <div>
              <div className="text-lg font-semibold text-gray-700 mb-3">Detected Bacteria</div>
              <div className="flex flex-wrap gap-2">
                {selectedTile.bacteria.map((b: any, i: number) => {
                  const color =
                    b.danger === "high"
                      ? "bg-red-500/90 border border-red-400"
                      : b.danger === "medium"
                      ? "bg-yellow-400/90 border border-yellow-300"
                      : "bg-green-500/90 border border-green-400";
                  return (
                    <span
                      key={i}
                      className={`${color} text-black font-semibold px-3 py-1.5 rounded-full text-sm shadow-lg`}
                    >
                      {b.name} <span className="opacity-80">({b.danger})</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-gray-700 text-lg mt-10 text-center leading-relaxed" style={{ fontFamily: '"Times New Roman", serif' }}>
            Click on a tile in the 3D room to see detailed bacteria analytics.
          </div>
        )}
      </div>
    </Card>
  );
}
