// components/ImageUpload.tsx - تحديث التصميم
"use client";

import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Image, Upload, X } from "lucide-react";

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
  currentImage?: string;
  className?: string;
  multiple?: boolean;
  accept?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageChange,
  currentImage,
  className = "",
  multiple = false,
  accept = "image/*"
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
    
    onImageChange(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-start gap-4">
        {preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-24 h-24 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400">
            <Image className="w-8 h-8" />
          </div>
        )}
        
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {preview ? 'Change Image' : 'Upload Image'}
            </Button>
            <p className="text-sm text-gray-500">
              PNG, JPG, GIF up to 5MB
            </p>
            <p className="text-xs text-gray-400">
              Recommended: Square or rectangular images
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};