"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

interface DragState {
  index: number;
  startY: number;
  deltaY: number;
  overIndex: number;
  rects: { top: number; height: number }[];
  shift: number;
}

interface SortableListProps<T> {
  items: T[];
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  onReorder: (next: T[]) => void;
  renderItem: (
    item: T,
    ctx: { index: number; handle: ReactNode; isDragging: boolean }
  ) => ReactNode;
  ariaLabel: string;
  className?: string;
  itemClassName?: (item: T, index: number, isDragging: boolean) => string;
}

function moveItem<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Pointer-based (mouse + touch) drag & drop sortable list with full keyboard
 * support (focus the ⋮⋮ handle and press ArrowUp / ArrowDown). The DOM order
 * always matches the visual order once a drop is committed, and a single polite
 * status message is announced per move.
 */
export function SortableList<T>({
  items,
  getKey,
  getLabel,
  onReorder,
  renderItem,
  ariaLabel,
  className = "space-y-2",
  itemClassName,
}: SortableListProps<T>) {
  const itemRefs = useRef(new Map<string, HTMLLIElement>());
  const handleRefs = useRef(new Map<string, HTMLButtonElement>());
  const dragRef = useRef<DragState | null>(null);
  const pendingFocusKey = useRef<string | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [settling, setSettling] = useState(false);
  const [status, setStatus] = useState("");

  useLayoutEffect(() => {
    const key = pendingFocusKey.current;
    if (!key) return;
    pendingFocusKey.current = null;
    handleRefs.current.get(key)?.focus();
  }, [items]);

  const commitMove = (from: number, to: number) => {
    if (from === to || to < 0 || to >= items.length) return;
    const moved = items[from];
    pendingFocusKey.current = getKey(moved);
    onReorder(moveItem(items, from, to));
    setStatus(`Đã chuyển "${getLabel(moved)}" tới vị trí số ${to + 1} trên ${items.length}.`);
  };

  const handlePointerDown = (e: PointerEvent<HTMLButtonElement>, index: number) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);

    const rects = items.map((item) => {
      const el = itemRefs.current.get(getKey(item));
      const r = el?.getBoundingClientRect();
      return { top: r?.top ?? 0, height: r?.height ?? 0 };
    });
    const gap =
      rects.length > 1 ? Math.max(0, rects[1].top - (rects[0].top + rects[0].height)) : 0;

    const state: DragState = {
      index,
      startY: e.clientY,
      deltaY: 0,
      overIndex: index,
      rects,
      shift: rects[index].height + gap,
    };
    dragRef.current = state;
    setDrag(state);
  };

  const handlePointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const current = dragRef.current;
    if (!current) return;
    const deltaY = e.clientY - current.startY;
    const dragged = current.rects[current.index];
    const center = dragged.top + dragged.height / 2 + deltaY;

    let overIndex = 0;
    current.rects.forEach((r, i) => {
      if (i === current.index) return;
      if (r.top + r.height / 2 < center) overIndex++;
    });

    const next = { ...current, deltaY, overIndex };
    dragRef.current = next;
    setDrag(next);
  };

  const finishDrag = () => {
    const current = dragRef.current;
    dragRef.current = null;
    if (!current) return;
    setSettling(true);
    setDrag(null);
    commitMove(current.index, current.overIndex);
    requestAnimationFrame(() => requestAnimationFrame(() => setSettling(false)));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      commitMove(index, index - 1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      commitMove(index, index + 1);
    }
  };

  const transformFor = (i: number): string | undefined => {
    if (!drag) return undefined;
    const { index, overIndex, deltaY, shift } = drag;
    if (i === index) return `translateY(${deltaY}px)`;
    if (index < overIndex && i > index && i <= overIndex) return `translateY(${-shift}px)`;
    if (index > overIndex && i >= overIndex && i < index) return `translateY(${shift}px)`;
    return undefined;
  };

  const reduced = prefersReducedMotion();

  return (
    <>
      <ol aria-label={ariaLabel} className={className}>
        {items.map((item, index) => {
          const key = getKey(item);
          const label = getLabel(item);
          const isDragging = drag?.index === index;

          const handle = (
            <button
              type="button"
              ref={(el) => {
                if (el) handleRefs.current.set(key, el);
                else handleRefs.current.delete(key);
              }}
              aria-label={`Kéo thả hoặc dùng phím mũi tên lên/xuống để đổi vị trí: ${label}`}
              onPointerDown={(e) => handlePointerDown(e, index)}
              onPointerMove={handlePointerMove}
              onPointerUp={finishDrag}
              onPointerCancel={finishDrag}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`inline-flex h-10 w-8 shrink-0 touch-none items-center justify-center rounded-lg text-[#8E96A8] hover:bg-[#F3EDE7] hover:text-[#283455] focus-visible:outline-2 focus-visible:outline-[#283455] ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
            >
              <svg width="12" height="18" viewBox="0 0 12 18" fill="currentColor" aria-hidden="true">
                <circle cx="3" cy="3" r="1.6" />
                <circle cx="9" cy="3" r="1.6" />
                <circle cx="3" cy="9" r="1.6" />
                <circle cx="9" cy="9" r="1.6" />
                <circle cx="3" cy="15" r="1.6" />
                <circle cx="9" cy="15" r="1.6" />
              </svg>
            </button>
          );

          return (
            <li
              key={key}
              ref={(el) => {
                if (el) itemRefs.current.set(key, el);
                else itemRefs.current.delete(key);
              }}
              style={{
                position: "relative",
                transform: transformFor(index),
                transition:
                  drag && !isDragging && !settling && !reduced
                    ? "transform 160ms ease"
                    : "none",
                zIndex: isDragging ? 20 : undefined,
              }}
              className={itemClassName ? itemClassName(item, index, isDragging) : undefined}
            >
              {renderItem(item, { index, handle, isDragging })}
            </li>
          );
        })}
      </ol>
      <p role="status" className="visually-hidden">
        {status}
      </p>
    </>
  );
}
