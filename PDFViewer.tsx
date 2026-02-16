import { useState } from "react";
import { X, Download, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { cn } from "../../../utils/utils";

interface PDFViewerProps {
  url: string;
  filename?: string;
  open: boolean;
  onClose: () => void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  url,
  filename = "document.pdf",
  open,
  onClose,
}) => {
  const [zoom, setZoom] = useState(100);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  return (
    <Modal
      open={open}
      title={
        <div className="flex items-center justify-between w-full">
          <span>{filename}</span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600 min-w-[4ch]">
              {zoom}%
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      }
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            type="button"
            variant="outline"
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            הורדה
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            סגור
          </Button>
        </div>
      }
    >
      <div className="w-full h-[70vh] bg-gray-100 rounded-lg overflow-hidden">
        <iframe
          src={url}
          title={filename}
          className={cn(
            "w-full h-full border-0",
            zoom !== 100 && `transform scale-${zoom}`
          )}
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
          }}
        />
      </div>
    </Modal>
  );
};

// Inline PDF Viewer (for embedding in pages)
interface InlinePDFViewerProps {
  url: string;
  height?: string;
  className?: string;
}

export const InlinePDFViewer: React.FC<InlinePDFViewerProps> = ({
  url,
  height = "600px",
  className,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "relative rounded-lg border border-gray-200 overflow-hidden bg-gray-100",
          className
        )}
        style={{ height }}
      >
        <div className="absolute top-2 left-2 z-10 flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setIsFullscreen(true)}
            className="gap-2 shadow-md"
          >
            <Maximize2 className="h-4 w-4" />
            מסך מלא
          </Button>
        </div>
        <iframe
          src={url}
          title="PDF Document"
          className="w-full h-full border-0"
        />
      </div>

      <PDFViewer
        url={url}
        open={isFullscreen}
        onClose={() => setIsFullscreen(false)}
      />
    </>
  );
};
