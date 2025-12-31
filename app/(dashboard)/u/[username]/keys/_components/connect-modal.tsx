"use client";

import { useState, useTransition, useRef, ElementRef } from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

import { createIngress } from "@/actions/ingress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type IngressType = "RTMP_INPUT" | "WHIP_INPUT";

export const ConnectModel = () => {
  const closeRef = useRef<ElementRef<"button">>(null);
  const [isPending, startTransition] = useTransition();
  const [ingressType, setIngressType] = useState<IngressType>("RTMP_INPUT");

  const onSubmit = () => {
    startTransition(() => {
      createIngress(ingressType)
        .then(() => {
          toast.success("Ingress created!");
          closeRef?.current?.click();
        })
        .catch((err) => {
          toast.error(err?.message || "Something went wrong");
        });
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Generate connection</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate connection</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-3">
          <Select
            disabled={isPending}
            value={ingressType}
            onValueChange={(v) => setIngressType(v as IngressType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select ingress type" />
            </SelectTrigger>
              <SelectContent className="bg-zinc-900 text-white border border-zinc-700 rounded-md shadow-lg">
              <SelectItem
                value="RTMP"
                className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800"
              >
                RTMP
              </SelectItem>
              <SelectItem
                value="WHIP"
                className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800"
              >
                WHIP
              </SelectItem>
            </SelectContent>
          </Select>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              This will reset any active streams tied to the current connection.
            </AlertDescription>
          </Alert>

          <div className="flex justify-between">
            <DialogClose ref={closeRef} asChild>
              <Button disabled={isPending} variant="ghost">
                Cancel
              </Button>
            </DialogClose>

            <Button disabled={isPending} onClick={onSubmit} variant="primary">
              {isPending ? "Generating..." : "Generate"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
