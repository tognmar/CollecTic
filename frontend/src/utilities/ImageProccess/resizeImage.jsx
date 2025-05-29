/**
 * Resize an image File (JPEG or PNG) in the browser.
 *
 * @param {File} file              – the original File object.
 * @param {number} [maxWidth=1024] – max pixel width of the output.
 * @param {number} [maxHeight=1024]– max pixel height of the output.
 * @param {number} [quality=0.8]   – JPEG quality (0–1). Ignored for PNG.
 * @returns {Promise<File>}        – resolves to a resized File.
 */

export function resizeImage(file, maxWidth = 1024, maxHeight = 1024, quality = 0.8) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Provided file is not an image.'));
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      let { width, height } = img;
      const scale = Math.min(maxWidth / width, maxHeight / height, 1);
      width *= scale;
      height *= scale;

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(width);
      canvas.height = Math.round(height);

      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);

      const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';

      canvas.toBlob(
        blob => {
          URL.revokeObjectURL(url);
          if (!blob) return reject(new Error('Image resize failed.'));
          resolve(new File([blob], file.name, { type: mime, lastModified: Date.now() }));
        },
        mime,
        mime === 'image/jpeg' ? quality : undefined
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load image.'));
    };

    img.src = url;
  });
}
