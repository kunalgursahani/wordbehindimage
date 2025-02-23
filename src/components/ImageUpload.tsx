import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
}

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageUpload(acceptedFiles[0]);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': []
    },
    maxFiles: 1
  });

  return (
    <div className="text-center">
      <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
      <div className="mt-4">
        <div
          {...getRootProps()}
          className={`max-w-xl mx-auto mt-2 flex justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors cursor-pointer
            ${isDragActive 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
            }`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <Upload className={`mx-auto h-12 w-12 ${isDragActive ? 'text-indigo-500' : 'text-gray-400'}`} />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <p className="font-semibold">
                {isDragActive
                  ? 'Drop your image here...'
                  : 'Upload an image or drag and drop'}
              </p>
            </div>
            <p className="text-xs leading-5 text-gray-500 mt-2">
              PNG or JPG up to 10MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}