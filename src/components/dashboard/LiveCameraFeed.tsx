import React, { useRef, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Pause,
  Play,
  ZoomIn,
  ZoomOut,
  CircleStop,
  Video,
  Image as ImageIcon,
} from "lucide-react";

type BacteriaInfo = {
  name: string;
  type: "Harmful" | "Good";
  family: string;
  transmission: string;
  diseases: string;
  solution: string;
  harmful_percent: number | string;
};

const LiveCameraFeed: React.FC = () => {
  const imgRef = useRef<HTMLImageElement>(null);

  const [isLive, setIsLive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [analysisData, setAnalysisData] = useState<BacteriaInfo[]>([]);
  const [mediaRecorder, setMediaRecorder] =
    useState<MediaRecorder | null>(null);

  // ✅ Stream URL
  const streamUrl = "https://ml.logesh.site/video_feed";

  // 🟢 Toggle feed
  const toggleFeed = () => setIsLive((prev) => !prev);

  // 🔍 Zoom
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 1));

  // 🔄 Rotation
  const rotateLeft = () => setRotation((r) => (r - 90 + 360) % 360);
  const rotateRight = () => setRotation((r) => (r + 90) % 360);
  const resetRotation = () => setRotation(0);

  // 📸 Capture image
  const handleCapture = () => {
    if (!imgRef.current) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = imgRef.current.naturalWidth;
    canvas.height = imgRef.current.naturalHeight;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(
      imgRef.current,
      -canvas.width / 2,
      -canvas.height / 2
    );
    ctx.restore();

    const link = document.createElement("a");
    link.download = `snapshot_${Date.now()}.jpg`;
    link.href = canvas.toDataURL("image/jpeg");
    link.click();
  };

  // 🎥 Start recording
  const handleStartRecording = () => {
    if (!imgRef.current || !(imgRef.current as any).captureStream) {
      alert("Recording not supported in this browser.");
      return;
    }

    const stream = (imgRef.current as any).captureStream();
    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `recording_${Date.now()}.webm`;
      link.click();
      URL.revokeObjectURL(url);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
  };

  // 🧠 FETCH BACTERIA ANALYSIS (FIXED)
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("https://logesh.site/analysis");
        const data = await res.json();

        console.log("🧬 Analysis data:", data);

        // ✅ SAFETY CHECK
        if (Array.isArray(data)) {
          setAnalysisData(data);
        } else {
          setAnalysisData([]);
        }
      } catch (err) {
        console.error("❌ Analysis fetch error", err);
        setAnalysisData([]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <Card className="p-4 relative shadow-lg rounded-2xl border">
      {/* Header */}
      <div className="flex justify-between mb-3 items-center">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Live AI Camera Feed</h3>
        </div>
        <Badge variant={isLive ? "default" : "secondary"}>
          {isLive ? "LIVE" : "STOPPED"}
        </Badge>
      </div>

      {/* Video */}
      <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center aspect-video">
  <img
    ref={imgRef}
    src={isLive ? streamUrl : "/images/floor.avif"}
    alt="Camera Feed"
    className="w-full h-full object-cover transition-transform duration-500"
    style={{
      transform: `scale(${zoom}) rotate(${rotation}deg)`,
    }}
  />
</div>

      {/* Controls */}
      <div className="mt-4 flex flex-wrap gap-3 justify-between">
        <Button
          variant={isLive ? "destructive" : "default"}
          size="sm"
          onClick={toggleFeed}
        >
          {isLive ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
          {isLive ? "Pause" : "Start"}
        </Button>

        <Button size="sm" onClick={handleZoomIn}><ZoomIn className="w-4 h-4 mr-1" />Zoom In</Button>
        <Button size="sm" onClick={handleZoomOut}><ZoomOut className="w-4 h-4 mr-1" />Zoom Out</Button>
        <Button size="sm" variant="secondary" onClick={handleCapture}><ImageIcon className="w-4 h-4 mr-1" />Capture</Button>

        {!isRecording ? (
          <Button size="sm" onClick={handleStartRecording}><Video className="w-4 h-4 mr-1" />Record</Button>
        ) : (
          <Button size="sm" variant="destructive" onClick={handleStopRecording}>
            <CircleStop className="w-4 h-4 mr-1" />Stop
          </Button>
        )}
      </div>

      {/* 🧫 Analysis */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">🧬 Detected Bacteria Analysis</h3>

        {analysisData.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No bacteria detected
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysisData.map((b, i) => (
              <Card
                key={i}
                className="p-4 border-l-4"
                style={{
                  borderLeftColor:
                    b.type === "Harmful" ? "#ef4444" : "#22c55e",
                }}
              >
                <div className="flex justify-between mb-2">
                  <h4 className="font-bold">{b.name}</h4>
                  <Badge
                    variant={b.type === "Harmful" ? "destructive" : "default"}
                  >
                    {b.type}
                  </Badge>
                </div>

                <p><b>Family:</b> {b.family || "—"}</p>
                <p><b>Transmission:</b> {b.transmission || "—"}</p>
                <p><b>Disease:</b> {b.diseases || "—"}</p>
                <p><b>Solution:</b> {b.solution || "—"}</p>

                <p>
                  <b>Harm Level:</b>{" "}
                  <span
                    className={
                      Number(b.harmful_percent) > 70
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  >
                    {b.harmful_percent}%
                  </span>
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
export default LiveCameraFeed;
