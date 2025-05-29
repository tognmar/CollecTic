/**
 * Validate the image size and format
 * @param {File} file              – the original File object.
 * @param {number} [maxSizeMB = 20]   – Maximum allowed file size in megabytes.
 */

export const validateImage = (file, maxSizeMB = 20) => {
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
  if (!isImage) return 'Unsupported format (JPEG/PNG only).';
  if (file.size > maxSizeMB * 1024 * 1024) return `Max size ${maxSizeMB} MB.`;
  return null;
};

export const validatePdf = (file, maxSizeMB = 20) => {
  if (file.type !== 'application/pdf') return 'Unsupported format (PDF only).';
  if (file.size > maxSizeMB * 1024 * 1024) return `Max size ${maxSizeMB} MB.`;
  return null;
};