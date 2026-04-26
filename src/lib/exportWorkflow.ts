import type { Edge, Node } from "@xyflow/react";

import type { Locale, TranslationKey } from "@/lib/i18n";
import {
  FUTURE_MODE_STYLE,
  NODE_TYPE_STYLE,
  type FutureMode,
  type ProcessNodeData,
} from "@/types/process";

type Translator = (key: TranslationKey, params?: Record<string, string | number>) => string;

export interface BuildMarkdownOptions {
  processName: string;
  nodes: Node[];
  edges: Edge[];
  locale: Locale;
  t: Translator;
}

const sortNodes = (nodes: Node[]) =>
  [...nodes].sort((a, b) => {
    if (a.position.x !== b.position.x) return a.position.x - b.position.x;
    return a.position.y - b.position.y;
  });

const formatDate = (locale: Locale) => {
  try {
    return new Date().toLocaleString(locale === "en" ? "en-US" : "de-DE", {
      dateStyle: "long",
      timeStyle: "short",
    });
  } catch {
    return new Date().toISOString();
  }
};

export const buildWorkflowMarkdown = ({
  processName,
  nodes,
  edges,
  locale,
  t,
}: BuildMarkdownOptions): string => {
  const ordered = sortNodes(nodes);
  const idToIndex = new Map(ordered.map((n, i) => [n.id, i + 1]));

  const lines: string[] = [];
  lines.push(
    `# ${t("export.markdown.heading", { name: processName || t("common.unnamed") })}`,
  );
  lines.push("");
  lines.push(`_${t("export.markdown.generated", { date: formatDate(locale) })}_`);
  lines.push("");

  const bottleneckCount = nodes.filter((n) => (n.data as ProcessNodeData).isBottleneck).length;
  const aiCount = nodes.filter(
    (n) => ((n.data as ProcessNodeData).futureMode ?? "same") !== "same",
  ).length;

  lines.push(`## ${t("export.markdown.summary")}`);
  lines.push("");
  lines.push(`- **${t("export.markdown.totalSteps")}:** ${nodes.length}`);
  lines.push(`- **${t("export.markdown.bottlenecks")}:** ${bottleneckCount}`);
  lines.push(`- **${t("export.markdown.aiSteps")}:** ${aiCount}`);
  lines.push("");

  lines.push(`## ${t("export.markdown.steps")}`);
  lines.push("");

  ordered.forEach((node, index) => {
    const data = node.data as ProcessNodeData;
    const typeStyle = NODE_TYPE_STYLE[data.nodeType] ?? NODE_TYPE_STYLE.process;
    const typeLabel = t(typeStyle.labelKey);
    lines.push(
      `### ${index + 1}. ${data.label || t("common.unnamed")}  \`${typeLabel}\``,
    );
    lines.push("");

    const meta: string[] = [];
    if (data.responsible) meta.push(`**${t("export.markdown.responsible")}:** ${data.responsible}`);
    if (data.duration) meta.push(`**${t("export.markdown.duration")}:** ${data.duration}`);
    if (data.tools && data.tools.length > 0)
      meta.push(`**${t("export.markdown.tools")}:** ${data.tools.join(", ")}`);
    if (meta.length > 0) {
      lines.push(meta.join(" · "));
      lines.push("");
    }

    if (data.description) {
      lines.push(`> ${data.description}`);
      lines.push("");
    }

    if (data.isBottleneck) {
      lines.push(
        `> ⚠️ **${t("export.markdown.bottleneckLabel")}:** ${data.bottleneckReason || t("node.bottleneck.title")}`,
      );
      lines.push("");
    }

    const futureMode = (data.futureMode ?? "same") as FutureMode;
    if (futureMode !== "same") {
      const futureStyle = FUTURE_MODE_STYLE[futureMode];
      lines.push(`**${t("export.markdown.aiSection")} — ${t(futureStyle.labelKey)}**`);
      lines.push("");
      if (data.futureLabel) lines.push(`- ${data.futureLabel}`);
      if (data.aiTask) lines.push(`- **${t("export.markdown.aiTask")}:** ${data.aiTask}`);
      if (data.humanRole) lines.push(`- **${t("export.markdown.humanRole")}:** ${data.humanRole}`);
      if (data.reviewCheckpoint) lines.push(`- ✅ ${t("export.markdown.review")}`);
      lines.push("");
    }
  });

  if (edges.length > 0) {
    lines.push(`## ${t("export.markdown.connections")}`);
    lines.push("");
    edges.forEach((edge) => {
      const src = nodes.find((n) => n.id === edge.source);
      const tgt = nodes.find((n) => n.id === edge.target);
      if (!src || !tgt) return;
      const srcIdx = idToIndex.get(edge.source);
      const tgtIdx = idToIndex.get(edge.target);
      const srcLabel = (src.data as ProcessNodeData).label || t("common.unnamed");
      const tgtLabel = (tgt.data as ProcessNodeData).label || t("common.unnamed");
      lines.push(`- ${srcIdx}. ${srcLabel} → ${tgtIdx}. ${tgtLabel}`);
    });
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push(`### ${t("export.markdown.aiPrompt.title")}`);
  lines.push("");
  lines.push(t("export.markdown.aiPrompt.body"));

  return lines.join("\n");
};

export const downloadMarkdown = (filename: string, content: string) => {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".md") ? filename : `${filename}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

export const slugify = (input: string) =>
  (input || "workflow")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "workflow";
