"use client";

import { useState, useTransition, useRef, ElementRef } from "react";
import Image from "next/image";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadDropzone } from "@/lib/uploadthing";
import { updateStream } from "@/actions/stream";

interface InfoModalProps {
  initialName: string;
  initialThumbnailUrl: string | null;
}

export function InfoModal({
  initialName,
  initialThumbnailUrl,
}: InfoModalProps) {
  const router = useRouter();
  const closeRef = useRef<ElementRef<"button">>(null);

  const [name, setName] = useState(initialName);
  const [thumbnailUrl, setThumbnailUrl] =
    useState<string | null>(initialThumbnailUrl);
  const [isPending, startTransition] = useTransition();

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      updateStream({ name }).then(() => {
        toast.success("Stream updated");
        closeRef.current?.click();
      });
    });
  };

  const onRemoveThumbnail = () => {
    startTransition(() => {
      updateStream({ thumbnailUrl: null }).then(() => {
        setThumbnailUrl(null);
        toast.success("Thumbnail removed");
      });
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-white/10 hover:bg-primary"
        >
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit stream info</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSave} className="space-y-6">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label>Thumbnail</Label>

            {thumbnailUrl ? (
              <div className="group relative aspect-video rounded-xl overflow-hidden border border-white/10">
                <Image
                  fill
                  src={thumbnailUrl}
                  alt="Thumbnail"
                  className="object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={onRemoveThumbnail}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/20 p-4 bg-muted/20">
                <UploadDropzone
                  endpoint="thumbnail"
                  onClientUploadComplete={(res) => {
                    setThumbnailUrl(res?.[0]?.url ?? null);
                    toast.success("Thumbnail uploaded");
                    router.refresh();
                  }}
                  onUploadError={() =>
                    toast.error("Upload failed")
                  }
                />
                <p className="text-xs text-muted-foreground text-center mt-2">
                  JPG / PNG · Max 4MB · 1280×720 recommended
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <DialogClose ref={closeRef} asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
