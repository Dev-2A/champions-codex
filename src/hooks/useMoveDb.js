import { useEffect, useState } from "react";
import { getMoveDb, loadMoveDb } from "../data/moveDb";

/**
 * 기술 DB 훅. 로드 전에는 null을 반환하고 로드를 시작한다.
 * (이미 로드된 경우 첫 렌더부터 db를 돌려준다)
 */
export function useMoveDb() {
  const [moveDb, setMoveDb] = useState(getMoveDb);
  useEffect(() => {
    if (moveDb) return;
    let alive = true;
    loadMoveDb().then((db) => {
      if (alive) setMoveDb(db);
    });
    return () => {
      alive = false;
    };
  }, [moveDb]);
  return moveDb;
}
