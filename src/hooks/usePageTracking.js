import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * GoatCounter 페이지뷰 전송 (해시 라우트 경로 기준).
 * count.js가 아직 로드 전이면 load 이벤트 후 전송. 애드블록 등으로
 * 스크립트가 없으면 조용히 무시된다. (localhost는 GoatCounter가 자동 제외)
 */
export function usePageTracking() {
  const { pathname } = useLocation();
  useEffect(() => {
    const send = () => window.goatcounter?.count?.({ path: pathname });
    if (window.goatcounter?.count) send();
    else window.addEventListener("load", send, { once: true });
  }, [pathname]);
}
