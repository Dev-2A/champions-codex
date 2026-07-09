import { create } from "zustand";
import { getAllPresets, putPreset, deletePreset } from "../lib/db";

const genId = () => `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

export const usePresetStore = create((set, get) => ({
  presets: [],
  loaded: false,

  load: async () => {
    const presets = await getAllPresets();
    set({ presets, loaded: true });
  },

  save: async (name, slugs) => {
    const now = Date.now();
    const preset = {
      id: genId(),
      name: name.trim() || "이름 없는 팀",
      slugs: [...slugs],
      createdAt: now,
      updatedAt: now,
    };
    await putPreset(preset);
    set({ presets: [preset, ...get().presets] });
    return preset;
  },

  update: async (id, patch) => {
    const preset = get().presets.find((p) => p.id === id);
    if (!preset) return;
    const updated = { ...preset, ...patch, updatedAt: Date.now() };
    await putPreset(updated);
    set({
      presets: get()
        .presets.map((p) => (p.id === id ? updated : p))
        .sort((a, b) => b.updatedAt - a.updatedAt),
    });
  },

  duplicate: async (id) => {
    const preset = get().presets.find((p) => p.id === id);
    if (!preset) return;
    const now = Date.now();
    const copy = {
      ...preset,
      id: genId(),
      name: `${preset.name} (복사본)`,
      createdAt: now,
      updatedAt: now,
    };
    await putPreset(copy);
    set({ presets: [copy, ...get().presets] });
  },

  remove: async (id) => {
    await deletePreset(id);
    set({ presets: get().presets.filter((p) => p.id !== id) });
  },
}));
