import { useEffect, useRef } from "react";
import type { Edge, Node } from "@xyflow/react";

import { STORAGE_KEY, type WorkflowPhase } from "@/types/process";

export interface StoredWorkflow {
  processName: string;
  phase: WorkflowPhase;
  nodes: Node[];
  edges: Edge[];
  savedAt: number;
}

export const loadWorkflow = (): StoredWorkflow | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredWorkflow;
    if (!parsed || !Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const clearWorkflow = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};

interface UseWorkflowAutoSaveOptions {
  enabled: boolean;
  data: Omit<StoredWorkflow, "savedAt">;
  delayMs?: number;
}

export const useWorkflowAutoSave = ({
  enabled,
  data,
  delayMs = 600,
}: UseWorkflowAutoSaveOptions) => {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      try {
        const payload: StoredWorkflow = { ...data, savedAt: Date.now() };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // storage full or blocked — silently ignore
      }
    }, delayMs);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [enabled, data, delayMs]);
};
