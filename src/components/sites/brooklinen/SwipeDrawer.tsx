"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface SwipeDrawerProps {
  open: boolean;
  onClose: () => void;
  side: "left" | "right";
  ariaLabel: string;
  children: ReactNode;
}

export function SwipeDrawer({
  open,
  onClose,
  side,
  ariaLabel,
  children,
}: SwipeDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);

  const requestSlideClose = () => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      onClose();
      return;
    }
    closingRef.current = true;
    if (side === "left") {
      scroller.scrollTo({ left: scroller.offsetWidth, behavior: "auto" });
    } else {
      scroller.scrollTo({ left: 0, behavior: "auto" });
    }
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    const scroller = scrollerRef.current;
    const sheet = sheetRef.current;
    if (!dialog || !scroller || !sheet) return;

    if (!open) {
      if (dialog.open) {
        dialog.close();
      }
      return;
    }

    closingRef.current = false;
    let cancelled = false;

    const openAnimated = async () => {
      if (!dialog.open) {
        dialog.showModal();
      }
      const supportsInitialTarget =
        typeof CSS !== "undefined" &&
        typeof CSS.supports === "function" &&
        CSS.supports("scroll-initial-target", "nearest");

      if (!supportsInitialTarget) {
        scroller.scrollTo({
          left: side === "left" ? scroller.offsetWidth : 0,
          behavior: "instant",
        });
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
        );
      }

      if (cancelled) return;
      scroller.scrollTo({
        left: side === "left" ? 0 : scroller.scrollWidth,
        behavior: "auto",
      });
    };

    void openAnimated();

    // Backdrop fade fallback when scroll-driven animations are not supported
    const supportsTimeline =
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports("animation-timeline: scroll()");

    const handleScroll = () => {
      const sheetWidth = sheet.offsetWidth || 1;
      const ratio =
        side === "left"
          ? Math.max(0, Math.min(1, 1 - scroller.scrollLeft / sheetWidth))
          : Math.max(
              0,
              Math.min(
                1,
                (scroller.scrollLeft - (scroller.scrollWidth - scroller.clientWidth - sheetWidth)) /
                  sheetWidth
              )
            );
      dialog.style.setProperty("--drawer-backdrop", String(ratio));
    };

    if (!supportsTimeline) {
      scroller.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
    }

    const visibleThreshold = 1 / Math.max(window.innerWidth, 1);
    let hasBeenVisible = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        if (entry.intersectionRatio >= 0.95) {
          hasBeenVisible = true;
        }
        if (
          (hasBeenVisible || closingRef.current) &&
          entry.intersectionRatio < visibleThreshold
        ) {
          if (dialog.open) {
            dialog.close();
          }
          onClose();
        }
      },
      { root: dialog, threshold: [visibleThreshold, 0.95, 1] }
    );
    observer.observe(sheet);

    const handleCancel = (event: Event) => {
      if (event.cancelable) {
        event.preventDefault();
        requestSlideClose();
      } else {
        onClose();
      }
    };

    const handleBackdropClick = (event: MouseEvent) => {
      if (!sheet.contains(event.target as Node)) {
        requestSlideClose();
      }
    };

    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("click", handleBackdropClick);

    return () => {
      cancelled = true;
      observer.disconnect();
      if (!supportsTimeline) {
        scroller.removeEventListener("scroll", handleScroll);
      }
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("click", handleBackdropClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, side]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={ariaLabel}
      className={`bkl-drawer ${side === "left" ? "bkl-drawer--left" : "bkl-drawer--right"}`}
    >
      <div ref={scrollerRef} className="bkl-drawer-scroller">
        <div ref={sheetRef} className="bkl-drawer-sheet flex flex-col">
          {children}
        </div>
      </div>
    </dialog>
  );
}
