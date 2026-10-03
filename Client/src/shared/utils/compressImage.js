export default async function compressImage(file) {
  try {
    const MAX_BYTES = 1024 * 1024;
    const MAX_DIMENSION = 1600;
    const QUALITIES = [0.85, 0.75, 0.65, 0.55, 0.5];

    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;

    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    for (const quality of QUALITIES) {
      const blob = await canvas.convertToBlob({ type: "image/jpeg", quality });
      if (blob.size <= MAX_BYTES) {
        const name = file.name.replace(/\.[^.]+$/, ".jpg");
        return new File([blob], name, { type: "image/jpeg" });
      }
    }

    return null;
  } catch {
    return null;
  }
}
