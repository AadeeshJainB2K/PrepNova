"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Send, Paperclip, X, Loader2, ChevronDown, Sparkles, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FileAttachment } from "./FileAttachment";
import type { ModelInfo } from "@/app/api/models/route";

interface FilePreview {
  id: string;
  fileName: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  fileUrl: string;
}

interface ChatInputProps {
  onSend: (message: string, attachments: FilePreview[], model?: string, provider?: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_DOC_TYPES = ["application/pdf", "text/plain", "text/markdown"];

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<FilePreview[]>([]);
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch available models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('/api/models');
        if (response.ok) {
          const data = await response.json();
          setModels(data.models.filter((m: ModelInfo) => m.available));
          // Set default model (first available)
          const defaultModel = data.models.find((m: ModelInfo) => m.available);
          if (defaultModel) setSelectedModel(defaultModel);
        }
      } catch (error) {
        console.error('Failed to fetch models:', error);
      }
    };
    fetchModels();
  }, []);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    for (const file of files) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }

      // Validate file type
      const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
      const isDoc = ALLOWED_DOC_TYPES.includes(file.type);
      
      if (!isImage && !isDoc) {
        alert(`File type ${file.type} is not supported. Please upload images (JPG, PNG, GIF, WebP) or documents (PDF, TXT, MD).`);
        continue;
      }

      // Read file as base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileUrl = event.target?.result as string;
        
        const preview: FilePreview = {
          id: crypto.randomUUID(),
          fileName: file.name,
          fileType: isImage ? "image" : "document",
          mimeType: file.type,
          fileSize: file.size,
          fileUrl,
        };

        setAttachments((prev) => [...prev, preview]);
      };

      reader.readAsDataURL(file);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!input.trim() && attachments.length === 0) || isLoading || disabled) {
      return;
    }

    onSend(input, attachments, selectedModel?.id, selectedModel?.provider);
    setInput("");
    setAttachments([]);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        {/* Attachment Previews */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <FileAttachment
                key={attachment.id}
                attachment={attachment}
                onRemove={() => removeAttachment(attachment.id)}
                isPreview
              />
            ))}
          </div>
        )}

        {/* Input Area with Model Selector */}
        <div className="relative flex flex-col rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400 focus-within:border-transparent transition-all">
          {/* Top Row: File button, Textarea, Send button */}
          <div className="flex items-end gap-2 p-2">
            {/* File Upload Button */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={[...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES].join(",")}
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="flex-shrink-0 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || disabled}
            >
              <Paperclip className="h-5 w-5" />
            </Button>

            {/* Textarea */}
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Message Gemini..."
              className="flex-1 min-h-[44px] max-h-[200px] border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none p-2 text-base shadow-none bg-transparent dark:text-gray-100 dark:placeholder-gray-400"
              rows={1}
              disabled={disabled}
            />

            {/* Send Button */}
            <Button
              type="submit"
              disabled={(!input.trim() && attachments.length === 0) || isLoading || disabled}
              className={cn(
                "flex-shrink-0 rounded-xl transition-all",
                input.trim() || attachments.length > 0
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Bottom Row: Model Selector */}
          <div className="px-2 pb-2 border-t border-gray-100 dark:border-gray-700">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                disabled={disabled}
              >
                {selectedModel?.provider === 'gemini' ? (
                  <Sparkles className="h-4 w-4 text-purple-500" />
                ) : (
                  <Cpu className="h-4 w-4 text-green-500" />
                )}
                <span className="font-medium">{selectedModel?.name || 'Select Model'}</span>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform",
                  showModelDropdown && "rotate-180"
                )} />
              </button>

              {/* Dropdown Menu */}
              {showModelDropdown && (
                <div className="absolute bottom-full left-0 mb-1 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  <div className="p-2">
                    {models.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">Loading models...</div>
                    ) : (
                      <>
                        {/* Gemini Models */}
                        {models.filter(m => m.provider === 'gemini').length > 0 && (
                          <div className="mb-2">
                            <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Cloud Models</div>
                            {models.filter(m => m.provider === 'gemini').map((model) => (
                              <button
                                key={model.id}
                                onClick={() => {
                                  setSelectedModel(model);
                                  setShowModelDropdown(false);
                                }}
                                className={cn(
                                  "w-full flex items-start gap-2 px-3 py-2 text-left rounded-md transition-colors",
                                  selectedModel?.id === model.id
                                    ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                                )}
                              >
                                <Sparkles className="h-4 w-4 mt-0.5 text-purple-500 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium truncate">{model.name}</div>
                                  <div className="text-xs text-gray-500 truncate">{model.description}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Ollama Models */}
                        {models.filter(m => m.provider === 'ollama').length > 0 && (
                          <div>
                            <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Local Models</div>
                            {models.filter(m => m.provider === 'ollama').map((model) => (
                              <button
                                key={model.id}
                                onClick={() => {
                                  setSelectedModel(model);
                                  setShowModelDropdown(false);
                                }}
                                className={cn(
                                  "w-full flex items-start gap-2 px-3 py-2 text-left rounded-md transition-colors",
                                  selectedModel?.id === model.id
                                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                                )}
                              >
                                <Cpu className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium truncate">{model.name}</div>
                                  <div className="text-xs text-gray-500 truncate">{model.description}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Helper Text */}
        <p className="text-center text-xs text-gray-400 mt-2">
          Gemini can make mistakes. Consider checking important information.
        </p>
      </form>
    </div>
  );
}
