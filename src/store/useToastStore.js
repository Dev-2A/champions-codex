import { create } from "zustand";

let nextId = 1;

export const useToastStore = create((set) => ({
  toasts: [],
  push: (message, { tone = "info", duration = 2600 } = {}) => {
    const id = nextId++;
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, duration);
  },
}));

/** 컴포넌트 밖에서도 쓸 수 있는 단축 함수: toast("메시지", { tone: "error" }) */
export const toast = (message, opts) =>
  useToastStore.getState().push(message, opts);
