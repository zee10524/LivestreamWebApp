"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { createViewerToken } from "@/actions/token";

interface LiveKitJwtPayload {
  name?: string;
  sub?: string; // identity
}

export const useViewerToken = (hostIdentity: string) => {
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [identity, setIdentity] = useState("");

  useEffect(() => {
    if (!hostIdentity) return;

    const createToken = async () => {
      try {
        const viewerToken = await createViewerToken(hostIdentity);
        setToken(viewerToken);

        const decoded = jwtDecode<LiveKitJwtPayload>(viewerToken);

        if (decoded?.sub) setIdentity(decoded.sub);
        if (decoded?.name) setName(decoded.name);
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      }
    };

    createToken();
  }, [hostIdentity]);

  return {
    token,
    name,
    identity,
  };
};
