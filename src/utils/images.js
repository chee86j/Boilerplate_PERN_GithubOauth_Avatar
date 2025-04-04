// Avatar images as base64
export const avatarImage1 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS11c2VyIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIvPjwvc3ZnPg==';

export const avatarImage2 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgZmlsbD0iI2YwZjBmMCI+PC9jaXJjbGU+PHBhdGggZD0iTTE2IDdhNCA0IDAgMCAxLTQgNCA0IDQgMCAwIDEtNC00IDQgNCAwIDAgMSA0LTQgNCA0IDAgMCAxIDQgNHoiIGZpbGw9IiNmMGYwZjAiPjwvcGF0aD48cGF0aCBkPSJNMTIgMTFhNCA0IDAgMCAwIDQtNCA0IDQgMCAwIDAtNC00IDQgNCAwIDAgMC00IDQgNCA0IDAgMCAwIDQgNHoiIGZpbGw9IiNlMmU4ZjAiPjwvcGF0aD48L3N2Zz4=';

export const avatarImage3 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgZmlsbD0iI2UyZThmMCI+PC9jaXJjbGU+PHBhdGggZD0iTTE2IDdhNCA0IDAgMCAxLTQgNCA0IDQgMCAwIDEtNC00IDQgNCAwIDAgMSA0LTQgNCA0IDAgMCAxIDQgNHoiIGZpbGw9IiNlMmU4ZjAiPjwvcGF0aD48cGF0aCBkPSJNMTIgMTFhNCA0IDAgMCAwIDQtNCA0IDQgMCAwIDAtNC00IDQgNCAwIDAgMC00IDQgNCA0IDAgMCAwIDQgNHoiIGZpbGw9IiNlMmU4ZjAiPjwvcGF0aD48L3N2Zz4=';

// Set avatarImage2 as the default avatar
export const defaultAvatar = avatarImage2;

/**
 * Convert a data URL to a Blob object
 * @param {string} dataUrl - The data URL to convert
 * @returns {Blob} The resulting Blob object
 */
export const dataUrlToBlob = (dataUrl) => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

/**
 * Convert a Blob to a base64 string
 * @param {Blob} blob - The Blob to convert
 * @returns {Promise<string>} A promise that resolves with the base64 string
 */
export const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Convert a File or Blob to base64
 * @param {File|Blob} file - The file to convert
 * @returns {Promise<string>} A promise that resolves with the base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Validate and process an image URL to base64
 * @param {string} url - The image URL to process
 * @returns {Promise<string>} A promise that resolves with the base64 string or default avatar
 */
export const processImageUrl = async (url) => {
  if (!url) return defaultAvatar;
  if (url.startsWith('data:')) return url;
  
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return await blobToBase64(blob);
  } catch (error) {
    console.error('Error processing image:', error);
    return defaultAvatar;
  }
};

/**
 * Resize an image maintaining aspect ratio
 * @param {string} base64 - The base64 string of the image
 * @param {number} maxWidth - Maximum width of the resized image
 * @param {number} maxHeight - Maximum height of the resized image
 * @returns {Promise<string>} A promise that resolves with the resized base64 string
 */
export const resizeImage = (base64, maxWidth = 800, maxHeight = 800) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => resolve(defaultAvatar);
  });
}; 