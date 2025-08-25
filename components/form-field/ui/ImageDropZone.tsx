'use client';

import {
  AlertCircleIcon,
  ClipboardIcon,
  FileIcon,
  FileTextIcon,
  ImageUpIcon,
  Loader2,
  PlusIcon,
  XIcon,
} from 'lucide-react';

import { FileWithPreview, useFileUpload } from '@/hooks/use-file-upload';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { deleteFile, getFile } from '@/lib/form-field/file-storage';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/form-field/ui/button';
import { OneOrManyFile } from '@/lib/form-field/zod-schemas/file';
import { createSyntheticInputChange } from '@/lib/form-field/utils';

// Function to determine file type
export const getFileType = (fileType: string | null): 'image' | 'pdf' | 'other' => {
  if (!fileType) return 'other';
  if (fileType.startsWith('image/')) return 'image';
  if (fileType === 'application/pdf') return 'pdf';
  return 'other';
};

// Function to get appropriate icon for file type
const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) return <ImageUpIcon className='size-6' />;
  if (fileType === 'application/pdf') return <FileTextIcon className='size-6' />;
  return <FileIcon className='size-6' />;
};

export default function ImageDropZone(props: React.ComponentProps<'input'>) {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024; // 5MB default
  const parsedValue = props.value as unknown as OneOrManyFile;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      addFiles,
      getInputProps,
    },
  ] = useFileUpload({
    accept: props.accept || 'image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt',
    multiple: props.multiple || false,
    maxSize,
    onFilesChange: (files) => {
      // Handle file change event
      if (props.onChange) {
        if (props.multiple) {
          props.onChange(createSyntheticInputChange(props.name || '', files));
          return;
        }
        props.onChange(createSyntheticInputChange(props.name || '', files.at(0)));
      }
    },
  });

  useEffect(() => {
    if (!parsedValue) return;

    const loadFiles = async () => {
      if (Array.isArray(parsedValue)) {
        const loadedFiles = await Promise.all(
          parsedValue.filter((v) => v?.id).map((v) => getFile(v.id as string)),
        );
        addFiles(loadedFiles.filter(Boolean));
      } else if (parsedValue?.id) {
        const file = await getFile(parsedValue.id);
        if (file) addFiles([file]);
      }
    };

    loadFiles();
    return () => {};
  }, []);

  const deleteMutation = useMutation({
    mutationFn: async (fileId: string) => {
      // Delete the file from storage
      await deleteFile(fileId);
      // Remove the file from the state
      removeFile(fileId);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Render file preview based on type
  const renderFilePreview = (file: FileWithPreview, index: number) => {
    const fileType = getFileType(file.file.type);

    return (
      <div
        key={file.id || index}
        className={`relative h-full w-full overflow-hidden rounded-md ${files.length === 1 ? 'min-h-[200px]' : 'min-h-[100px]'} bg-background border`}
      >
        {fileType === 'image' && (
          <Image
            src={file.preview || ''}
            alt={file.file?.name || 'Uploaded image'}
            fill
            className='object-contain'
          />
        )}

        {fileType === 'pdf' && (
          <div className='flex h-full flex-col items-center justify-center p-2'>
            <FileTextIcon
              className={`${files.length === 1 ? 'size-12' : 'size-8'} mb-1 text-red-500`}
            />
            <p
              className={`${files.length === 1 ? 'text-sm' : 'text-xs'} max-w-full truncate font-medium`}
            >
              {file.file?.name}
            </p>
            <a
              href={file.preview}
              target='_blank'
              rel='noopener noreferrer'
              className={`${files.length === 1 ? 'text-sm' : 'text-xs'} mt-1 text-blue-500`}
            >
              View PDF
            </a>
          </div>
        )}

        {fileType === 'other' && (
          <div className='flex h-full flex-col items-center justify-center p-2'>
            {getFileIcon(file.file?.type || '')}
            <p
              className={`${files.length === 1 ? 'text-sm' : 'text-xs'} mt-1 max-w-full truncate font-medium`}
            >
              {file.file?.name}
            </p>
          </div>
        )}

        <div className='absolute top-2 right-2'>
          <button
            type='button'
            className='focus-visible:ring-ring/50 z-10 flex size-7 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[2px]'
            onClick={() => {
              if (file.id) {
                deleteMutation.mutate(file.id);
              } else {
                removeFile(index.toString());
              }
            }}
            aria-label='Remove file'
          >
            {deleteMutation.isPending && deleteMutation.variables === file.id ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <XIcon className='size-4' aria-hidden='true' />
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='relative'>
        <div
          role='button'
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className='border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]'
        >
          <input
            {...getInputProps()}
            ref={(ref) => {
              if (ref) {
                // @ts-expect-error type error
                getInputProps().ref.current = ref;
                // @ts-expect-error type error
                props.ref.current = ref;
              }
            }}
            className='sr-only'
            aria-label='Upload file'
          />

          {files.length > 0 ? (
            files.length === 1 ? (
              <div className='flex h-full w-full items-center justify-center'>
                {renderFilePreview(files[0], 0)}
              </div>
            ) : (
              <div className='grid h-full w-full grid-cols-2 gap-2 sm:grid-cols-3'>
                {files.map((file, index) => renderFilePreview(file, index))}
              </div>
            )
          ) : (
            <div
              className='flex cursor-pointer flex-col items-center justify-center px-4 py-3 text-center'
              onClick={openFileDialog}
            >
              <div
                className='bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border'
                aria-hidden='true'
              >
                <ImageUpIcon className='size-4 opacity-60' />
              </div>
              <p className='mb-1.5 text-sm font-medium'>
                Drop your {props.multiple ? 'files' : 'file'} here or click to browse
              </p>
              <p className='text-muted-foreground text-xs'>
                Max size: {maxSizeMB}MB {props.multiple ? 'per file' : ''}
              </p>
            </div>
          )}
        </div>
      </div>
      {props.multiple || files.length === 0 ? (
        <div className='mb-2 flex justify-between'>
          <Button
            type={'button'}
            onClick={async () => {
              let file: File | null = null;
              const items = await navigator.clipboard.read();
              for (const item of items) {
                for (const type of item.types) {
                  if (type.startsWith('image/')) {
                    const blob = await item.getType(type);
                    file = new File([blob], `clipboard-image-${Date.now()}-.png`, {
                      type: blob.type,
                    });
                  }
                }
              }

              if (!file) return toast.error('No image found in clipboard');
              addFiles([file]);
            }}
            size={'sm'}
            variant={'link'}
            className={'text-xs'}
            icon={<ClipboardIcon />}
          >
            Get from Clipboard
          </Button>
          <button
            type='button'
            onClick={openFileDialog}
            className='bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1 rounded-md px-3 py-1.5 text-sm'
          >
            <PlusIcon className='size-4' />
            Add {props.multiple ? 'Files' : 'File'}
          </button>
        </div>
      ) : null}

      {errors.length > 0 && (
        <div className='text-destructive flex items-center gap-1 text-xs' role='alert'>
          <AlertCircleIcon className='size-3 shrink-0' />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}
