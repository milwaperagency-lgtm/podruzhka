import axios from 'axios';
import WebApp from '@twa-dev/sdk';
import type { AvatarState } from '@/types';

const apiBase =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL
    ? `${String(import.meta.env.VITE_API_URL).replace(/\/$/, '')}/api`
    : '/api';

const api = axios.create({
  baseURL: apiBase,
  timeout: 25000,
});

api.interceptors.request.use((config) => {
  const initData = WebApp.initData;
  if (initData) {
    config.headers['X-Telegram-Init-Data'] = initData;
  }
  return config;
});

export async function fetchMe() {
  const { data } = await api.get<{
    user: {
      telegram_id: number;
      username?: string;
      level: number;
      max_completed_level: number;
      points: number;
      created_avatar: AvatarState;
      onboarding_complete: boolean;
    };
    subscription: { ok: boolean; status?: string };
  }>('/me');
  return data;
}

export async function checkSubscription() {
  const { data } = await api.post<{ ok: boolean; status?: string }>('/subscription/check');
  return data;
}

export async function completeOnboarding() {
  await api.post('/user/onboarding');
}

export async function saveAvatar(created_avatar: AvatarState) {
  const { data } = await api.put<{ ok: boolean }>('/user/avatar', { created_avatar });
  return data;
}

export async function completeLevel(levelId: number, created_avatar: AvatarState) {
  const { data } = await api.post<{
    ok: boolean;
    level: number;
    points: number;
    promo?: { code: string; discount: number };
    error?: string;
  }>('/game/level/complete', { levelId, created_avatar });
  return data;
}

export async function fetchRewards() {
  const { data } = await api.get<{
    promos: { code: string; discount: number; created_at: string; used: boolean }[];
  }>('/user/rewards');
  return data;
}

export default api;
