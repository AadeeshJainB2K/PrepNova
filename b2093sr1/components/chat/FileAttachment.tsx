"use client";

import { FileIcon, Download, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MessageAttachment {
  id: string;
  fileName: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  fileUrl: string;
}

interface FileAttachmentProps {
  attachment: MessageAttachment;
  onRemove?: () => void;
  isPreview?: boolean;
}

export function FileAttachment({ attachment, onRemove, isPreview = false }: FileAttachmentProps) {
  const [showLightbox, setShowLightbox] = useState(false);
  const isImage = attachment.fileType === "image";

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (isImage) {
    return (
      <>
        <div className="relative group">
          <img
            src={attachment.fileUrl}
            alt={attachment.fileName}
            className={cn(
              "rounded-lg max-w-sm cursor-pointer transition-transform hover:scale-[1.02]",
              isPreview ? "max-h-32" : "max-h-64"
            )}
            onClick={() => !isPreview && setShowLightbox(true)}
          />
          {onRemove && (
            <button
              onClick={onRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Lightbox */}
        {showLightbox && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowLightbox(false)}
          >
            <img
              src={attachment.fileUrl}
              alt={attachment.fileName}
              className="max-w-full max-h-full object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={() => setShowLightbox(false)}
            >
              <X className="h-8 w-8" />
            </button>
          </div>
        )}
      </>
    );
  }

  // Document/file attachment
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border bg-white/10 backdrop-blur-sm",
        isPreview ? "max-w-xs" : "max-w-sm"
      )}
    >
      <div className="flex-shrink-0">
        <FileIcon className="h-8 w-8 text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{attachment.fileName}</p>
        <p className="text-xs text-gray-400">{formatFileSize(attachment.fileSize)}</p>
      </div>
      {onRemove ? (
        <button
          onClick={onRemove}
          className="flex-shrink-0 text-red-400 hover:text-red-300"
        >
          <X className="h-5 w-5" />
        </button>
      ) : (
        <a
          href={attachment.fileUrl}
          download={attachment.fileName}
          className="flex-shrink-0 text-blue-400 hover:text-blue-300"
        >
          <Download className="h-5 w-5" />
        </a>
      )}
    </div>
  );
}
