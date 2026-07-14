import { useEffect } from "react";

/**
 * 모바일(<lg): 화면 하단 고정 시트 + 배경 오버레이 (탭하면 닫힘, 배경 스크롤 잠금)
 * 데스크톱(lg~): 아무 장식 없는 인라인 블록 (기존 패널 배치 그대로)
 * 내용물(children)이 카드 스타일을 가진다는 전제 — 시트 자체는 배경 없음.
 */
export default function BottomSheet({ open, onClose, children }) {
  // 모바일에서 열려 있는 동안 배경 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape로 닫기 (모바일·데스크톱 공통)
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* 배경 오버레이 (모바일 전용) */}
      <button
        type="button"
        aria-label="닫기"
        tabIndex={-1}
        onClick={onClose}
        className="fixed inset-0 z-40 cursor-default bg-ink-950/40 backdrop-blur-[2px] lg:hidden"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:static lg:z-auto lg:max-h-none lg:overflow-visible lg:p-0"
      >
        {children}
      </div>
    </>
  );
}
