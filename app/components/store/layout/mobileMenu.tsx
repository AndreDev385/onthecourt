import { X } from "lucide-react";
import { Navigation } from "./navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        tabIndex={0}
        role="button"
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        onKeyDown={(e) => (e.key === "Escape" ? onClose() : null)}
      ></div>
      <div className="fixed flex flex-col top-0 left-0 bottom-0 w-64 bg-white">
        <div className="bg-gray-900 flex justify-end p-4">
          <X size={26} onClick={onClose} />
        </div>
        <div>
          <Navigation isMobile />
        </div>
      </div>
    </div>
  );
}
