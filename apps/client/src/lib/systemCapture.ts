export async function startSystemAudioCapture(onStop: (blob: Blob) => void) {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    audio: true,
    video: false,
  });

  const recorder = new MediaRecorder(stream);
  const chunks: Blob[] = [];

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: recorder.mimeType });
    onStop(blob);
    stream.getTracks().forEach((t) => t.stop());
  };

  recorder.start();
  return recorder;
}

export function stopSystemAudioCapture(recorder: MediaRecorder) {
  recorder.stop();
}

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
