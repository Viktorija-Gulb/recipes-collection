import { supabase } from '../config/supabase';

export interface UploadedRecipeImage {
  path: string;
  publicUrl: string;
}

export const uploadRecipeImage = async (file: File): Promise<UploadedRecipeImage> => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPG, PNG and WebP images are allowed.');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image size must be less than 5 MB.');
  }

  const fileExtension = file.type.split('/')[1];
  const filePath = `${crypto.randomUUID()}.${fileExtension}`;

  const { data, error } = await supabase.storage.from('recipe-images').upload(filePath, file, {
    cacheControl: '3600',
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage.from('recipe-images').getPublicUrl(data.path, {
    transform: {
      width: 600,
      height: 400,
      quality: 80,
      resize: 'cover',
    },
  });

  return {
    path: data.path,
    publicUrl: publicUrlData.publicUrl,
  };
};
