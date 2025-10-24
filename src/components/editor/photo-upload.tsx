'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface PhotoUploadProps {
  photo?: string;
  onPhotoChange: (photo: string | undefined) => void;
}

export function PhotoUpload({ photo, onPhotoChange }: PhotoUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen es muy grande', {
        description: 'El tamaño máximo es 5MB',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onPhotoChange(reader.result as string);
      toast.success('Foto cargada exitosamente');
    };
    reader.onerror = () => {
      toast.error('Error al cargar la imagen');
    };
    reader.readAsDataURL(file);
  }, [onPhotoChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  if (photo) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative inline-block"
      >
        <img
          src={photo}
          alt="Foto de perfil"
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onPhotoChange(undefined)}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg"
          type="button"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      {...getRootProps()}
      whileHover={{ scale: 1.02 }}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
        isDragActive
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
      }`}
    >
      <input {...getInputProps()} />
      <motion.div
        animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
        className="flex flex-col items-center gap-3"
      >
        {isDragActive ? (
          <Upload className="w-12 h-12 text-blue-500" />
        ) : (
          <ImageIcon className="w-12 h-12 text-gray-400" />
        )}
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {isDragActive ? 'Suelta la imagen aquí' : 'Arrastra tu foto aquí'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            o haz click para seleccionar
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            PNG, JPG, WEBP (máx. 5MB)
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
