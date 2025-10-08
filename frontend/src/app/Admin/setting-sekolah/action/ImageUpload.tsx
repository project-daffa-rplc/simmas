import React, { useState, useRef, useEffect } from "react";
import type { ChangeEvent, MouseEvent } from "react";
import { Upload } from "lucide-react";
import { IconTrash, IconUpload } from "@tabler/icons-react";

export default function ImageUploadComponent({
  logo,
  disabled,
  onChange,
  className,
  readonly
}: {
  logo: string;
  disabled: boolean;
  onChange?:(file: File | null) => void; 
  className: string,
  readonly: boolean
}) {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  interface ImageUploads {
    logo: string;
  }

  useEffect(() => {
    if (logo) {
      const baseUrl = "http://127.0.0.1:8000/storage/";
      const fullUrl = `${baseUrl}${logo}`;
      setPreview(fullUrl);
    }
  }, [logo]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      onChange?.(file)

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    setImage(null);
    setPreview(null);
    onChange?.(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="h-max flex flex-col gap-[10px]  w-max">

      <div className="">
        {/* Image Upload Area */}
        <div
          onClick={() => {
            if (disabled && !readonly) handleClick();
          }}
          className={`relative w-[100px] h-[100px] ${className} border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100 overflow-hidden`}
        >
          <input
            disabled={!disabled && !readonly}
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {preview ? (
            <div className="relative group w-full h-full">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                {(disabled && !readonly) && (
                  <button
                    onClick={(e) => {
                      if (disabled && !readonly) handleRemove(e);
                    }}
                    className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-[8px] rounded-[50px] text-[12px] font-medium transition-opacity"
                  >
                    <IconTrash width={"25px"} height={"25px"} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full h-full"></div>
          )}
        </div>
      </div>
    </div>
  );
}
