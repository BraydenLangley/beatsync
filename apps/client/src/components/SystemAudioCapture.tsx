"use client";
import { useState } from "react";
import { uploadAudioFile } from "@/lib/api";
import { startSystemAudioCapture, stopSystemAudioCapture, blobToBase64 } from "@/lib/systemCapture";
import { useRoomStore } from "@/store/room";
import { Button } from "@/components/ui/button";
import { CircleDot, Square } from "lucide-react";

export const SystemAudioCapture = () => {
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const roomId = useRoomStore((state) => state.roomId);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleStart = async () => {
    const newRecorder = await startSystemAudioCapture(async (blob) => {
      const base64 = await blobToBase64(blob);
      await uploadAudioFile({
        name: `capture-${Date.now()}.webm`,
        audioData: base64,
        roomId,
      });
    });
    setRecorder(newRecorder);
    setIsCapturing(true);
  };

  const handleStop = () => {
    if (recorder) {
      stopSystemAudioCapture(recorder);
      setRecorder(null);
      setIsCapturing(false);
    }
  };

  return (
    <div className="pt-2 px-1">
      {isCapturing ? (
        <Button
          onClick={handleStop}
          className="bg-red-600 hover:bg-red-700 text-white text-xs"
          size="sm"
        >
          <Square className="w-3 h-3 mr-1" /> Stop capture
        </Button>
      ) : (
        <Button
          onClick={handleStart}
          className="bg-primary-600 hover:bg-primary-700 text-white text-xs"
          size="sm"
        >
          <CircleDot className="w-3 h-3 mr-1" /> Capture system audio
        </Button>
      )}
    </div>
  );
};
