'use client'

import { useCallback, useState, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase/client'
import {
  VEHICLE_IMAGES_BUCKET,
  extFromMime,
  publicImageUrl,
  vehicleImagePath,
} from '@/lib/storage'
import { Button } from '@/components/ui/button'
import {
  deleteVehicleImage,
  recordVehicleImage,
  setPrimaryImage,
} from '../_actions/vehicle-images'

type ImageRow = {
  id: string
  storage_path: string
  is_primary: boolean
  sort_order: number
}

export function VehicleImageManager({
  showroomId,
  vehicleId,
  images,
}: {
  showroomId: string
  vehicleId: string
  images: ImageRow[]
}) {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (accepted.length === 0) return
      setUploadError(null)
      setUploading(true)

      const supabase = createClient()

      try {
        for (const file of accepted) {
          const path = vehicleImagePath({
            showroomId,
            vehicleId,
            ext: extFromMime(file.type),
          })

          const { error } = await supabase.storage
            .from(VEHICLE_IMAGES_BUCKET)
            .upload(path, file, {
              cacheControl: '3600',
              contentType: file.type,
              upsert: false,
            })

          if (error) throw new Error(error.message)

          await recordVehicleImage({ showroomId, vehicleId, storagePath: path })
        }
        startTransition(() => router.refresh())
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Upload failed')
      } finally {
        setUploading(false)
      }
    },
    [showroomId, vehicleId, router],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/avif': ['.avif'],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: true,
    disabled: uploading,
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center text-sm transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-neutral-300 hover:border-neutral-400 dark:border-neutral-700'
        } ${uploading ? 'opacity-60' : ''}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p>Uploading…</p>
        ) : isDragActive ? (
          <p>Drop the files here.</p>
        ) : (
          <>
            <p className="font-medium">Drag photos here, or click to select</p>
            <p className="mt-1 text-xs text-neutral-500">
              JPG, PNG, WebP, or AVIF. Max 5 MB each.
            </p>
          </>
        )}
      </div>

      {uploadError && (
        <p role="alert" className="text-sm text-destructive">
          {uploadError}
        </p>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="group relative overflow-hidden rounded-lg border">
              <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-900">
                <Image
                  src={publicImageUrl(img.storage_path)}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 200px, 50vw"
                  className="object-cover"
                />
                {img.is_primary && (
                  <span className="absolute left-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    Primary
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1 border-t p-1.5">
                {!img.is_primary && (
                  <form action={setPrimaryImage}>
                    <input type="hidden" name="showroomId" value={showroomId} />
                    <input type="hidden" name="vehicleId" value={vehicleId} />
                    <input type="hidden" name="imageId" value={img.id} />
                    <Button type="submit" size="xs" variant="ghost">
                      Make primary
                    </Button>
                  </form>
                )}
                <form action={deleteVehicleImage} className="ml-auto">
                  <input type="hidden" name="showroomId" value={showroomId} />
                  <input type="hidden" name="vehicleId" value={vehicleId} />
                  <input type="hidden" name="imageId" value={img.id} />
                  <Button type="submit" size="xs" variant="ghost">
                    Delete
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
