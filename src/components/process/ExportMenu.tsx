import { useState } from "react";
import type { Edge, Node } from "@xyflow/react";
import { Check, Copy, Download, FileDown, FileText, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/lib/i18n";
import { buildWorkflowMarkdown, downloadMarkdown, slugify } from "@/lib/exportWorkflow";

interface ExportMenuProps {
  processName: string;
  nodes: Node[];
  edges: Edge[];
  onPdf: () => void;
  disabled?: boolean;
}

const ExportMenu = ({ processName, nodes, edges, onPdf, disabled }: ExportMenuProps) => {
  const { t, locale } = useTranslation();
  const [copied, setCopied] = useState(false);

  const generate = () =>
    buildWorkflowMarkdown({ processName, nodes, edges, locale, t });

  const handleDownloadMd = () => {
    const md = generate();
    downloadMarkdown(slugify(processName), md);
  };

  const handleCopy = async () => {
    const md = generate();
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = md;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        /* ignore */
      }
      document.body.removeChild(textarea);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-full px-3 text-xs"
          disabled={disabled || nodes.length === 0}
        >
          <Download className="mr-1 h-3.5 w-3.5" />
          {t("header.export")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-2xl">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {t("export.menu.title")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            onPdf();
          }}
          className="rounded-lg"
        >
          <Printer className="mr-2 h-4 w-4" />
          {t("export.menu.pdf")}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleDownloadMd} className="rounded-lg">
          <FileDown className="mr-2 h-4 w-4" />
          {t("export.menu.markdown.download")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            handleCopy();
          }}
          className="rounded-lg"
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-emerald-600" />
              {t("export.menu.markdown.copied")}
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              {t("export.menu.markdown.copy")}
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 pb-2 pt-1 text-[10px] leading-4 text-muted-foreground">
          <FileText className="mr-1 inline h-3 w-3" />
          {t("export.markdown.aiPrompt.body")}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportMenu;
