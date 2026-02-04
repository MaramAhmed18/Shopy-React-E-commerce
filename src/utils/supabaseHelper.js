import { supabase } from '../config/supabase';

export const uploadProductImage = async (file) => {
  const fileName = `${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(`public/${fileName}`, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(`public/${fileName}`);

  return publicUrl;
};