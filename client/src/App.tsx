import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import WebApp from '@twa-dev/sdk';
import type Konva from 'konva';
import {
  checkSubscription,
  completeLevel,
  completeOnboarding,
  fetchMe,
  fetchRewards,
  saveAvatar,
} from '@/lib/api';
import type { AvatarState, PromoReward, UserProfile } from '@/types';
import { defaultAvatarState, normalizeAvatarState } from '@/types';
import { publicUrl } from '@/lib/publicUrl';
import { LEVELS } from '@/data/levels';
import { validateLevelTask } from '@/game/levelChecks';
import AvatarEditor from '@/components/AvatarEditor';

const PRAISE_ON_LEVEL = [
  'Великолепно! Образ огонь.',
  'Ты сияешь — задание выполнено!',
  'Идеальный вкус, так держать!',
  'Браво! Стиль на высоте.',
  'Умничка! Образ собран безупречно.',
  'Восторг! Такой look заслуживает аплодисментов.',
  'Супер! Ты настоящая beauty-звезда.',
];

function pickPraise(): string {
  return PRAISE_ON_LEVEL[Math.floor(Math.random() * PRAISE_ON_LEVEL.length)]!;
}

const CHANNEL = import.meta.env.VITE_TELEGRAM_CHANNEL ?? 'https://t.me/podruzhkahse';
const BOT_LINK = import.meta.env.VITE_TELEGRAM_BOT ?? 'https://t.me/podruzhkahse_bot';

/** Логотип: `public/podruzhka-logo.png` (бренд #FF78B4), запасной SVG при ошибке загрузки. */
function PodruzhkaLogo({ className = '' }: { className?: string }) {
  return (
    <img
      src={publicUrl('podruzhka-logo.png')}
      alt="Подружка"
      width={120}
      height={120}
      decoding="async"
      className={`select-none object-contain ${className}`}
      onError={(e) => {
        const el = e.currentTarget;
        if (!el.src.includes('podruzhka-logo.svg')) el.src = publicUrl('podruzhka-logo.svg');
      }}
    />
  );
}

type Tab = 'home' | 'avatar' | 'levels' | 'rewards' | 'profile';

function BottomNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const items: { id: Tab; label: string; icon: string }[] = [
    { id: 'home', label: 'Главная', icon: '⌂' },
    { id: 'avatar', label: 'Аватар', icon: '✿' },
    { id: 'levels', label: 'Уровни', icon: '★' },
    { id: 'rewards', label: 'Промо', icon: '♥' },
    { id: 'profile', label: 'Профиль', icon: '☺' },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/50 bg-white/90 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg justify-between">
        {items.map((i) => (
          <button
            key={i.id}
            type="button"
            onClick={() => onChange(i.id)}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-2 text-[11px] font-semibold transition ${
              tab === i.id ? 'text-podrygka-pink' : 'text-podrygka-deep/50'
            }`}
          >
            <span className="text-lg leading-none">{i.icon}</span>
            {i.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [subOk, setSubOk] = useState(false);
  const [avatar, setAvatar] = useState<AvatarState>(defaultAvatarState());
  const [tab, setTab] = useState<Tab>('home');
  const [levelMsg, setLevelMsg] = useState<string | null>(null);
  const [toast, setToast] = useState<{ title: string; subtitle?: string } | null>(null);
  const [promos, setPromos] = useState<PromoReward[]>([]);
  const stageRef = useRef<Konva.Stage>(null);

  const refresh = useCallback(async () => {
    if (!WebApp.initData) {
      setError('Откройте приложение из Telegram-бота');
      setLoading(false);
      return;
    }
    setError(null);
    const data = await fetchMe();
    setUser({
      telegram_id: data.user.telegram_id,
      username: data.user.username,
      level: data.user.level,
      max_completed_level: data.user.max_completed_level,
      points: data.user.points,
      created_avatar: data.user.created_avatar,
      onboarding_complete: data.user.onboarding_complete,
    });
    setAvatar(normalizeAvatarState(data.user.created_avatar));
    setSubOk(data.subscription.ok);
    const r = await fetchRewards();
    setPromos(r.promos);
  }, []);

  useEffect(() => {
    setLoading(true);
    refresh()
      .catch(() => setError('Не удалось загрузить данные'))
      .finally(() => setLoading(false));
  }, [refresh]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 4800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const onSubscribeOpen = () => {
    WebApp.openTelegramLink(CHANNEL.startsWith('http') ? CHANNEL : `https://t.me/${CHANNEL.replace('@', '')}`);
  };

  const onCheckSub = async () => {
    WebApp.HapticFeedback?.impactOccurred?.('light');
    const r = await checkSubscription();
    setSubOk(r.ok);
    if (r.ok) await refresh();
  };

  const onStartWelcome = async () => {
    await completeOnboarding();
    setUser((u) => (u ? { ...u, onboarding_complete: true } : u));
    WebApp.HapticFeedback?.notificationOccurred?.('success');
  };

  const saveAvatarRemote = useCallback(async (next: AvatarState) => {
    setAvatar(next);
    try {
      await saveAvatar(next);
    } catch {
      /* offline */
    }
  }, []);

  const completeCurrentLevel = async (levelId: number) => {
    setLevelMsg(null);
    const localCheck = validateLevelTask(levelId, avatar);
    if (!localCheck.ok) {
      setLevelMsg(localCheck.reason);
      WebApp.HapticFeedback?.notificationOccurred?.('error');
      return;
    }
    try {
      await saveAvatar(avatar);
      const r = await completeLevel(levelId, avatar);
      const praise = pickPraise();
      if (r.promo) {
        const line = `Промокод ${r.promo.code} (−${r.promo.discount}%)`;
        setLevelMsg(`Уровень ${levelId} пройден! ${line}`);
        setToast({ title: praise, subtitle: line });
      } else {
        setLevelMsg(`Уровень ${levelId} пройден!`);
        setToast({ title: praise, subtitle: 'Образ сохранён, очки начислены.' });
      }
      WebApp.HapticFeedback?.notificationOccurred?.('success');
      setUser((u) =>
        u
          ? {
              ...u,
              points: r.points,
              max_completed_level: levelId,
              level: levelId + 1,
            }
          : u
      );
      const rewards = await fetchRewards();
      setPromos(rewards.promos);
    } catch (e: unknown) {
      WebApp.HapticFeedback?.notificationOccurred?.('error');
      if (axios.isAxiosError(e)) {
        const data = e.response?.data as { error?: string; expected?: number; reason?: string } | undefined;
        if (data?.error === 'wrong_level' && typeof data.expected === 'number') {
          setLevelMsg(`Сначала завершите уровень ${data.expected}.`);
          return;
        }
        if (data?.reason) {
          setLevelMsg(data.reason);
          return;
        }
      }
      setLevelMsg('Не удалось отправить результат. Проверьте сеть и попробуйте снова.');
    }
  };

  const exportAvatar = async () => {
    const stage = stageRef.current;
    if (!stage) {
      WebApp.showAlert?.('Откройте вкладку «Аватар» и попробуйте снова.');
      return;
    }
    WebApp.HapticFeedback?.impactOccurred?.('medium');
    const dataUrl = stage.toDataURL({ pixelRatio: 2 });
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], 'beauty-avatar.png', { type: 'image/png' });
    try {
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Beauty Avatar Challenge',
          text: 'Мой beauty-аватар — Подружка 💄',
        });
      } else {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'beauty-avatar.png';
        a.click();
        WebApp.showPopup?.({ message: 'Изображение сохранено — поделитесь им в сторис или чате!' });
      }
    } catch {
      WebApp.showAlert?.('Не удалось поделиться — попробуйте сохранить скриншот.');
    }
  };

  const nextLevelId = user?.max_completed_level !== undefined ? user.max_completed_level + 1 : 1;
  const allLevelsDone = (user?.max_completed_level ?? 0) >= LEVELS.length;
  const currentLevelDef = useMemo(() => {
    if (allLevelsDone) return undefined;
    return LEVELS.find((l) => l.id === nextLevelId);
  }, [nextLevelId, allLevelsDone]);

  if (loading) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-5 bg-gradient-to-b from-[#FFF5FA] to-white p-8">
        <PodruzhkaLogo className="h-28 w-28 animate-pulse rounded-[1.75rem] shadow-card ring-2 ring-[#FF78B4]/35" />
        <p className="text-center text-sm font-semibold text-podrygka-deep/80">Загружаем ваш beauty-профиль…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <PodruzhkaLogo className="mx-auto h-14 w-14 rounded-2xl opacity-90 shadow-soft" />
        <p className="text-podrygka-deep">{error}</p>
      </div>
    );
  }

  if (!subOk) {
    return (
      <div className="flex min-h-full flex-col px-6 pb-28 pt-12">
        <div className="glass-panel p-8 text-center shadow-soft">
          <div className="mb-6 flex justify-center">
            <PodruzhkaLogo className="h-20 w-20 rounded-2xl shadow-card ring-1 ring-podrygka-rose/30" />
          </div>
          <p className="font-display text-2xl font-bold text-podrygka-deep">Подписка на канал</p>
          <p className="mt-4 text-podrygka-deep/80">
            Чтобы играть в Beauty Avatar Challenge, подпишитесь на наш Telegram-канал.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <button type="button" className="btn-primary w-full" onClick={onSubscribeOpen}>
              Подписаться
            </button>
            <button type="button" className="btn-secondary w-full" onClick={onCheckSub}>
              Проверить подписку
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (user && !user.onboarding_complete) {
    return (
      <div className="flex min-h-full flex-col justify-center px-6 pb-24">
        <div className="glass-panel relative overflow-hidden p-8 shadow-soft">
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-podrygka-rose/40 blur-2xl" />
          <div className="mb-6 flex justify-center">
            <PodruzhkaLogo className="h-24 w-24 rounded-2xl shadow-card ring-2 ring-white/80" />
          </div>
          <p className="text-center font-display text-3xl font-bold text-podrygka-deep">Beauty Avatar Challenge</p>
          <p className="mt-4 text-center text-lg text-podrygka-deep/85">
            Создай идеальный образ, проходи уровни и получай промокоды Подружка.
          </p>
          <ul className="mt-6 space-y-2 text-left text-sm text-podrygka-deep/75">
            <li>✓ Слойный редактор лица, макияжа и наряда</li>
            <li>✓ Задания на стиль и креатив</li>
            <li>✓ Промокоды FREE5, FREE10, FREE15, FREE20, FREE25 на этапах 5–25</li>
          </ul>
          <button type="button" className="btn-primary mt-10 w-full" onClick={onStartWelcome}>
            Начать
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-full flex-col pb-24">
      {toast && (
        <div
          role="status"
          className="fixed left-1/2 top-[max(0.75rem,env(safe-area-inset-top))] z-[100] w-[min(92vw,22rem)] -translate-x-1/2 rounded-2xl border border-podrygka-pink/40 bg-white/95 px-4 py-3 text-center shadow-card backdrop-blur-md"
        >
          <p className="font-display text-base font-bold text-podrygka-deep">{toast.title}</p>
          {toast.subtitle && <p className="mt-1 text-sm text-podrygka-deep/75">{toast.subtitle}</p>}
        </div>
      )}
      <header className="sticky top-0 z-30 border-b border-white/40 bg-white/70 px-5 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <PodruzhkaLogo className="h-11 w-11 shrink-0 rounded-xl shadow-sm ring-1 ring-podrygka-rose/20" />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-podrygka-pink">Подружка</p>
              <h1 className="font-display text-xl font-bold text-podrygka-deep">Beauty Avatar</h1>
            </div>
          </div>
          <div className="chip">{user?.points ?? 0} очков</div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pt-4">
        {tab === 'home' && (
          <div className="space-y-6">
            <div className="glass-panel relative overflow-hidden p-6 shadow-soft">
              <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-podrygka-mint/50 blur-3xl" />
              <h2 className="font-display text-2xl font-bold text-podrygka-deep">Ваш стиль — ваша игра</h2>
              <p className="mt-2 text-podrygka-deep/80">
                {allLevelsDone ? (
                  <>Вы прошли все уровни — спасибо за игру! </>
                ) : (
                  <>
                    Следующий уровень: <strong>{nextLevelId}</strong> из {LEVELS.length}
                  </>
                )}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <button type="button" className="btn-primary" onClick={() => setTab('avatar')}>
                  Редактор
                </button>
                <button type="button" className="btn-secondary" onClick={() => setTab('levels')}>
                  Задания
                </button>
              </div>
            </div>
            <div className="glass-panel p-5">
              <p className="font-semibold text-podrygka-deep">Текущее задание</p>
              {currentLevelDef ? (
                <p className="mt-2 text-sm text-podrygka-deep/80">
                  <span className="font-bold text-podrygka-pink">Ур. {currentLevelDef.id}:</span>{' '}
                  {currentLevelDef.title} — {currentLevelDef.description}
                </p>
              ) : (
                <p className="mt-2 text-sm">Вы прошли все уровни! 🎉</p>
              )}
            </div>
            <button type="button" className="btn-secondary w-full" onClick={exportAvatar}>
              Поделиться beauty-аватаром
            </button>
          </div>
        )}

        {tab === 'avatar' && (
          <div className="flex min-h-[70vh] flex-col">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-podrygka-deep">Редактор</h2>
              <button type="button" className="text-sm font-semibold text-podrygka-pink" onClick={() => saveAvatarRemote(avatar)}>
                Сохранить
              </button>
            </div>
            <AvatarEditor value={avatar} onChange={setAvatar} previewRef={stageRef} />
            <button type="button" className="btn-primary mt-4 w-full" onClick={exportAvatar}>
              Поделиться моим beauty-аватаром
            </button>
          </div>
        )}

        {tab === 'levels' && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-podrygka-deep">Уровни</h2>
            {levelMsg && (
              <div className="rounded-2xl border border-podrygka-rose/50 bg-white/90 p-4 text-sm text-podrygka-deep shadow-card">
                {levelMsg}
              </div>
            )}
            <div className="space-y-3">
              {LEVELS.map((l) => {
                const done = (user?.max_completed_level ?? 0) >= l.id;
                const active = l.id === nextLevelId;
                return (
                  <div
                    key={l.id}
                    className={`glass-panel flex flex-col gap-2 p-4 transition ${
                      active ? 'ring-2 ring-podrygka-pink' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold uppercase text-podrygka-pink/90">Уровень {l.id}</p>
                        <p className="font-semibold text-podrygka-deep">{l.title}</p>
                        <p className="mt-1 text-sm text-podrygka-deep/75">{l.description}</p>
                      </div>
                      <span className="chip shrink-0">+{l.points}</span>
                    </div>
                    {active && (
                      <button
                        type="button"
                        className="btn-primary mt-1 w-full sm:w-auto"
                        onClick={() => completeCurrentLevel(l.id)}
                      >
                        Завершить уровень
                      </button>
                    )}
                    {done && !active && (
                      <p className="text-sm font-medium text-emerald-600">Выполнено</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'rewards' && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-podrygka-deep">Мои награды</h2>
            <p className="text-sm text-podrygka-deep/75">
              За уровни 5, 10, 15, 20 и 25 вы получаете фиксированные коды: FREE5, FREE10, FREE15, FREE20, FREE25 (скидка в
              процентах совпадает с числом). Администратор может добавлять отдельные коды PODRYGKA-…
            </p>
            <div className="space-y-3">
              {promos.length === 0 && (
                <div className="glass-panel p-6 text-center text-podrygka-deep/70">Пока нет промокодов — проходите уровни!</div>
              )}
              {promos.map((p) => (
                <div key={p.code} className="glass-panel flex items-center justify-between p-4">
                  <div>
                    <p className="font-mono text-lg font-bold text-podrygka-deep">{p.code}</p>
                    <p className="text-sm text-podrygka-deep/70">−{p.discount}%</p>
                  </div>
                  <span className={`text-xs font-semibold ${p.used ? 'text-podrygka-deep/40' : 'text-emerald-600'}`}>
                    {p.used ? 'использован' : 'активен'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'profile' && (
          <div className="space-y-6">
            <h2 className="font-display text-xl font-bold text-podrygka-deep">Профиль</h2>
            <div className="glass-panel space-y-2 p-5">
              <p>
                <span className="text-podrygka-deep/60">Канал:</span>{' '}
                <a href={CHANNEL} className="font-medium text-podrygka-pink underline" target="_blank" rel="noreferrer">
                  @podruzhkahse
                </a>
              </p>
              <p>
                <span className="text-podrygka-deep/60">Бот:</span>{' '}
                <a href={BOT_LINK} className="font-medium text-podrygka-pink underline" target="_blank" rel="noreferrer">
                  @podruzhkahse_bot
                </a>
              </p>
              <p>
                <span className="text-podrygka-deep/60">Telegram ID:</span>{' '}
                <span className="font-mono">{user?.telegram_id}</span>
              </p>
              {user?.username && (
                <p>
                  <span className="text-podrygka-deep/60">@</span>
                  {user.username}
                </p>
              )}
              <p>
                <span className="text-podrygka-deep/60">Пройдено уровней:</span> {user?.max_completed_level ?? 0}
              </p>
              <p>
                <span className="text-podrygka-deep/60">Очки:</span> {user?.points ?? 0}
              </p>
            </div>
            <button type="button" className="btn-secondary w-full" onClick={() => refresh()}>
              Обновить данные
            </button>
          </div>
        )}
      </main>

      <BottomNav tab={tab} onChange={setTab} />
    </div>
  );
}
