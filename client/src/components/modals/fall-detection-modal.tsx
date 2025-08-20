import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface FallDetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSafety: () => void;
  onRequestHelp: () => void;
}

export default function FallDetectionModal({
  isOpen,
  onClose,
  onConfirmSafety,
  onRequestHelp,
}: FallDetectionModalProps) {
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(60);
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Auto-request help when countdown reaches 0
          onRequestHelp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onRequestHelp]);

  const handleConfirmSafety = () => {
    onConfirmSafety();
    onClose();
  };

  const handleRequestHelp = () => {
    onRequestHelp();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4" data-testid="fall-detection-modal">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-error-red text-2xl w-8 h-8" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2" data-testid="fall-modal-title">
            Fall Detection Alert
          </h3>
          
          <p className="text-gray-600 mb-6" data-testid="fall-modal-message">
            A potential fall has been detected. Are you okay?
          </p>
          
          <div className="flex space-x-3">
            <Button
              onClick={handleConfirmSafety}
              className="flex-1 bg-success-green text-white hover:bg-green-600"
              data-testid="button-confirm-safety"
            >
              I'm OK
            </Button>
            <Button
              onClick={handleRequestHelp}
              className="flex-1 bg-error-red text-white hover:bg-red-600"
              data-testid="button-request-help"
            >
              Need Help
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-3">
            Emergency services will be contacted in{" "}
            <span 
              className="font-medium" 
              data-testid="emergency-countdown"
            >
              {countdown}
            </span>{" "}
            seconds if no response
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
