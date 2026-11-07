import { supabase } from '../config/supabase';

export interface UploadedRecipeImage {
  path: string;
  publicUrl: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1200;
const IMAGE_QUALITY = 0.8;

// optimizes image to reduce its size and dimensions before uploading
const optimizeImage = async (file: File): Promise<Blob> => {
  const imageUrl = URL.createObjectURL(file);

  try {
    const image = new Image();
    image.src = imageUrl;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Could not load image.'));
    });

    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height));

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);

    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Could not process image.');
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const optimizedBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        blob => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Could not optimize image.'));
          }
        },
        'image/webp',
        IMAGE_QUALITY
      );
    });

    return optimizedBlob;
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
};

export const uploadRecipeImage = async (file: File): Promise<UploadedRecipeImage> => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPG, PNG and WebP images are allowed.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image size must be less than 5 MB.');
  }

  const optimizedImage = await optimizeImage(file);
  const filePath = `${crypto.randomUUID()}.webp`;

  const { data, error } = await supabase.storage
    .from('recipe-images')
    .upload(filePath, optimizedImage, {
      cacheControl: '31536000',
      contentType: 'image/webp',
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage.from('recipe-images').getPublicUrl(data.path);

  return {
    path: data.path,
    publicUrl: publicUrlData.publicUrl,
  };
};
