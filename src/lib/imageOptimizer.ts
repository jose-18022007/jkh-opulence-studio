/**
 * Utility service for image optimization, compression, and WebP conversion.
 * Works seamlessly in both mobile webviews and browsers.
 */

/**
 * Converts a Blob or File to a base64 string.
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Converts a base64 string to a Blob.
 */
export const base64ToBlob = (base64Data: string, contentType = 'image/webp'): Blob => {
  const parts = base64Data.split(';base64,');
  const rawBase64 = parts.length > 1 ? parts[1] : parts[0];
  const sliceSize = 512;
  const byteCharacters = atob(rawBase64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

/**
 * Compresses an image (File, Blob, or base64 string), resizes it if it exceeds maxWidth/maxHeight,
 * and converts it to WebP format.
 * 
 * @param input The image source (File, Blob, or base64 data URL)
 * @param maxWidth The maximum width constraint (defaults to 1024)
 * @param maxHeight The maximum height constraint (defaults to 1024)
 * @param quality Compression quality from 0.0 to 1.0 (defaults to 0.8)
 * @returns A promise that resolves to the optimized WebP data URL
 */
export const optimizeImage = (
  input: File | Blob | string,
  maxWidth = 1024,
  maxHeight = 1024,
  quality = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions keeping the aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get 2D context from canvas'));
        return;
      }

      // Draw and scale image
      ctx.drawImage(img, 0, 0, width, height);

      // Export as WebP data URL
      try {
        const optimizedDataUrl = canvas.toDataURL('image/webp', quality);
        resolve(optimizedDataUrl);
      } catch (err) {
        // Fallback to jpeg if WebP conversion is not supported on older webviews
        try {
          const fallbackDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(fallbackDataUrl);
        } catch (fallbackErr) {
          reject(fallbackErr);
        }
      }
    };

    img.onerror = (err) => {
      reject(new Error('Failed to load image for optimization: ' + err));
    };

    // Set image source based on input type
    if (typeof input === 'string') {
      img.src = input;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        } else {
          reject(new Error('FileReader returned empty result'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(input);
    }
  });
};

/**
 * Helper to compress and convert any file to an uploadable WebP Blob
 */
export const prepareUploadBlob = async (
  file: File | string,
  maxWidth = 1024,
  maxHeight = 1024,
  quality = 0.85
): Promise<Blob> => {
  const optimizedDataUrl = await optimizeImage(file, maxWidth, maxHeight, quality);
  return base64ToBlob(optimizedDataUrl, 'image/webp');
};
