import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { Edge, Node } from "@xyflow/react";
import { Printer, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import {
  FUTURE_MODE_STYLE,
  NODE_TYPE_STYLE,
  type FutureMode,
  type ProcessNodeData,
} from "@/types/process";
import { cn } from "@/lib/utils";

interface PdfPreviewProps {
  processName: string;
  nodes: Node[];
  edges: Edge[];
  onClose: () => void;
}

const sortNodes = (nodes: Node[]) =>
  [...nodes].sort((a, b) => {
    if (a.position.x !== b.position.x) return a.position.x - b.position.x;
    return a.position.y - b.position.y;
  });

const PdfPreview = ({ processName, nodes, edges, onClose }: PdfPreviewProps) => {
  const { t, locale } = useTranslation();
  const ordered = sortNodes(nodes);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.classList.add("pdf-preview-open");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("pdf-preview-open");
    };
  }, [onClose]);

  const bottleneckCount = nodes.filter((n) => (n.data as ProcessNodeData).isBottleneck).length;
  const aiCount = nodes.filter(
    (n) => ((n.data as ProcessNodeData).futureMode ?? "same") !== "same",
  ).length;

  const generated = (() => {
    try {
      return new Date().toLocaleString(locale === "en" ? "en-US" : "de-DE", {
        dateStyle: "long",
        timeStyle: "short",
      });
    } catch {
      return "";
    }
  })();

  return createPortal(
    <div id="pdf-preview-root" className="fixed inset-0 z-50 flex flex-col bg-slate-100 print:bg-white">
      {/* Toolbar — hidden in print */}
      <div className="flex items-center justify-between border-b border-border/70 bg-white px-6 py-3 shadow-sm print:hidden">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            {t("pdf.kicker")}
          </p>
          <p className="text-sm text-foreground">{t("pdf.printHint")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onClose} className="h-9 rounded-full">
            <X className="mr-1 h-4 w-4" />
            {t("pdf.close")}
          </Button>
          <Button size="sm" onClick={() => window.print()} className="h-9 rounded-full px-4">
            <Printer className="mr-1.5 h-4 w-4" />
            {t("pdf.print")}
          </Button>
        </div>
      </div>

      {/* Document */}
      <div className="flex-1 overflow-y-auto print:overflow-visible">
        <div
          id="pdf-document"
          className="mx-auto my-8 w-full max-w-[820px] rounded-2xl bg-white p-12 shadow-[0_24px_60px_rgba(15,23,42,0.08)] print:m-0 print:max-w-none print:rounded-none print:p-12 print:shadow-none"
        >
          <header className="mb-8 border-b border-slate-200 pb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              {t("pdf.kicker")}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              {t("pdf.title", { name: processName || t("common.unnamed") })}
            </h1>
            {generated && <p className="mt-2 text-xs text-slate-500">{generated}</p>}

            <div className="mt-5 flex flex-wrap gap-3 text-xs">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                {nodes.length} · {t("export.markdown.totalSteps")}
              </span>
              {bottleneckCount > 0 && (
                <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-800">
                  {bottleneckCount} · {t("export.markdown.bottlenecks")}
                </span>
              )}
              {aiCount > 0 && (
                <span className="rounded-full bg-purple-100 px-3 py-1 text-purple-800">
                  {aiCount} · {t("export.markdown.aiSteps")}
                </span>
              )}
            </div>
          </header>

          <section>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {t("pdf.flow")}
            </h2>

            <ol className="space-y-4">
              {ordered.map((node, index) => {
                const data = node.data as ProcessNodeData;
                const typeStyle = NODE_TYPE_STYLE[data.nodeType] ?? NODE_TYPE_STYLE.process;
                const futureMode = (data.futureMode ?? "same") as FutureMode;
                const futureStyle = FUTURE_MODE_STYLE[futureMode];
                const changed = futureMode !== "same";

                return (
                  <li
                    key={node.id}
                    className={cn(
                      "break-inside-avoid rounded-xl border bg-white p-5",
                      "border-slate-200",
                      data.isBottleneck && "border-orange-300 bg-orange-50/40",
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              "text-[10px] font-semibold uppercase tracking-[0.18em]",
                              typeStyle.colorClass,
                            )}
                          >
                            {t(typeStyle.labelKey)}
                          </span>
                          {data.isBottleneck && (
                            <span className="rounded-full bg-orange-100 px-2 py-[2px] text-[10px] font-medium text-orange-800">
                              {t("export.markdown.bottleneckLabel")}
                            </span>
                          )}
                          {changed && (
                            <span className="rounded-full bg-purple-100 px-2 py-[2px] text-[10px] font-medium text-purple-800">
                              {t(futureStyle.labelKey)}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-semibold text-slate-900">
                          {data.label || t("common.unnamed")}
                        </h3>

                        {(data.responsible || data.duration || (data.tools && data.tools.length > 0)) && (
                          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                            {data.responsible && (
                              <span>
                                <strong className="text-slate-700">
                                  {t("export.markdown.responsible")}:
                                </strong>{" "}
                                {data.responsible}
                              </span>
                            )}
                            {data.duration && (
                              <span>
                                <strong className="text-slate-700">
                                  {t("export.markdown.duration")}:
                                </strong>{" "}
                                {data.duration}
                              </span>
                            )}
                            {data.tools && data.tools.length > 0 && (
                              <span>
                                <strong className="text-slate-700">
                                  {t("export.markdown.tools")}:
                                </strong>{" "}
                                {data.tools.join(", ")}
                              </span>
                            )}
                          </div>
                        )}

                        {data.description && (
                          <p className="mt-2 text-sm leading-6 text-slate-700">{data.description}</p>
                        )}

                        {data.isBottleneck && data.bottleneckReason && (
                          <p className="mt-2 text-xs text-orange-800">
                            ⚠ {data.bottleneckReason}
                          </p>
                        )}

                        {changed && (
                          <div className="mt-3 grid grid-cols-1 gap-2 rounded-lg bg-purple-50/60 p-3 text-xs sm:grid-cols-2">
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-800">
                                {t("pdf.before")}
                              </p>
                              <p className="mt-0.5 text-slate-700">{data.label || "—"}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-800">
                                {t("pdf.after")}
                              </p>
                              <p className="mt-0.5 text-slate-700">
                                {data.futureLabel || data.aiTask || t(futureStyle.labelKey)}
                              </p>
                            </div>
                            {data.aiTask && (
                              <div className="sm:col-span-2">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-800">
                                  {t("export.markdown.aiTask")}
                                </p>
                                <p className="mt-0.5 text-slate-700">{data.aiTask}</p>
                              </div>
                            )}
                            {data.humanRole && (
                              <div className="sm:col-span-2">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-800">
                                  {t("export.markdown.humanRole")}
                                </p>
                                <p className="mt-0.5 text-slate-700">{data.humanRole}</p>
                              </div>
                            )}
                            {data.reviewCheckpoint && (
                              <p className="sm:col-span-2 text-purple-800">
                                ✓ {t("export.markdown.review")}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          {edges.length > 0 && (
            <section className="mt-8 border-t border-slate-200 pt-6">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                {t("export.markdown.connections")}
              </h2>
              <ul className="space-y-1 text-xs text-slate-600">
                {edges.map((edge) => {
                  const src = nodes.find((n) => n.id === edge.source);
                  const tgt = nodes.find((n) => n.id === edge.target);
                  if (!src || !tgt) return null;
                  return (
                    <li key={edge.id}>
                      {(src.data as ProcessNodeData).label || "—"} →{" "}
                      {(tgt.data as ProcessNodeData).label || "—"}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default PdfPreview;
