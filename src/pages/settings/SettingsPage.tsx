// src/pages/settings/SettingsPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonToggle,
  IonButton,
  IonAlert,
  IonToast,
  IonNote,
} from '@ionic/react';
import {
  personCircleOutline,
  moonOutline,
  sunnyOutline,
  copyOutline,
  informationCircleOutline,
  logOutOutline,
  trashOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import './SettingsPage.css';

const THEME_KEY = 'mp-stgo-theme';

export const SettingsPage: React.FC = () => {
  const history = useHistory();

  // ✅ ВАЖНО: НЕ возвращаем объект из селектора (иначе бесконечные рендеры)
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem(THEME_KEY) === 'dark';
  });

  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showResetAlert, setShowResetAlert] = useState(false);

  const [toast, setToast] = useState<{ open: boolean; message: string; color?: string }>({
    open: false,
    message: '',
    color: 'primary',
  });

  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  const displayName = user?.fullName || user?.name || 'Пользователь';
  const displayRole = user?.role ? String(user.role) : '—';

  const supportPayload = useMemo(() => {
    const data = {
      ts: new Date().toISOString(),
      user: {
        id: user?.id ?? '—',
        name: user?.name ?? '—',
        fullName: user?.fullName ?? '—',
        role: user?.role ?? '—',
      },
      app: {
        version: (import.meta as any)?.env?.VITE_APP_VERSION ?? '—',
      },
      device: {
        lang: navigator.language,
        ua: navigator.userAgent,
      },
    };
    return JSON.stringify(data, null, 2);
  }, [user]);

  const copySupportInfo = async () => {
    try {
      await navigator.clipboard.writeText(supportPayload);
      setToast({ open: true, message: 'Данные для поддержки скопированы', color: 'success' });
    } catch {
      setToast({ open: true, message: 'Не удалось скопировать (браузер запретил доступ)', color: 'danger' });
    }
  };

  const handleLogout = () => {
    logout();
    history.replace('/login');
  };

  const handleResetLocalData = () => {
    localStorage.clear();
    logout();
    history.replace('/login');
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#f7fafc' } as any}>
          <IonTitle className="settings-title">Настройки</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ '--background': '#f7fafc' } as any}>
        <div className="settings-wrap">
          {/* Профиль */}
          <div className="profile-card">
            <div className="profile-avatar">
              <IonIcon icon={personCircleOutline} />
            </div>

            <div className="profile-meta">
              <div className="profile-name">{displayName}</div>
              <div className="profile-sub">
                <span className="profile-pill">ID: {user?.id ?? '—'}</span>
                <span className="profile-pill">Роль: {displayRole}</span>
              </div>
            </div>
          </div>

          {/* Приложение */}
          <div className="section-head">Приложение</div>
          <div className="settings-card">
            <IonList lines="none">
              <IonItem className="settings-item">
                <IonIcon slot="start" icon={isDark ? moonOutline : sunnyOutline} className="settings-icon" />
                <IonLabel>
                  <div className="settings-label">Тёмная тема</div>
                  <IonNote className="settings-note">Включает dark-режим (без перезапуска)</IonNote>
                </IonLabel>
                <IonToggle checked={isDark} onIonChange={(e) => setIsDark(!!e.detail.checked)} />
              </IonItem>

              <IonItem button className="settings-item" onClick={copySupportInfo}>
                <IonIcon slot="start" icon={copyOutline} className="settings-icon" />
                <IonLabel>
                  <div className="settings-label">Скопировать данные для поддержки</div>
                  <IonNote className="settings-note">Пользователь + версия + устройство</IonNote>
                </IonLabel>
                <IonIcon slot="end" icon={chevronForwardOutline} className="chev" />
              </IonItem>

              <IonItem
                button
                className="settings-item"
                onClick={() =>
                  setToast({
                    open: true,
                    message: 'Мобильный инспектор • Сахатранснефтегаз',
                    color: 'primary',
                  })
                }
              >
                <IonIcon slot="start" icon={informationCircleOutline} className="settings-icon" />
                <IonLabel>
                  <div className="settings-label">О приложении</div>
                  <IonNote className="settings-note">
                    Версия: {(import.meta as any)?.env?.VITE_APP_VERSION ?? '—'}
                  </IonNote>
                </IonLabel>
                <IonIcon slot="end" icon={chevronForwardOutline} className="chev" />
              </IonItem>
            </IonList>
          </div>

          {/* Безопасность */}
          <div className="section-head">Безопасность</div>
          <div className="settings-card">
            <IonList lines="none">
              <IonItem button className="settings-item danger" onClick={() => setShowResetAlert(true)}>
                <IonIcon slot="start" icon={trashOutline} className="settings-icon" />
                <IonLabel>
                  <div className="settings-label">Сбросить локальные данные</div>
                  <IonNote className="settings-note">Очистит кэш/состояние и выйдет из аккаунта</IonNote>
                </IonLabel>
                <IonIcon slot="end" icon={chevronForwardOutline} className="chev" />
              </IonItem>
            </IonList>
          </div>

          {/* Выход */}
          <div className="logout-wrap">
            <IonButton expand="block" color="danger" onClick={() => setShowLogoutAlert(true)}>
              <IonIcon slot="start" icon={logOutOutline} />
              Выйти из аккаунта
            </IonButton>
          </div>
        </div>

        <IonAlert
          isOpen={showLogoutAlert}
          onDidDismiss={() => setShowLogoutAlert(false)}
          header="Выйти из аккаунта?"
          message="Вы уверены, что хотите выйти?"
          buttons={[
            { text: 'Отмена', role: 'cancel' },
            { text: 'Выйти', role: 'destructive', handler: handleLogout },
          ]}
        />

        <IonAlert
          isOpen={showResetAlert}
          onDidDismiss={() => setShowResetAlert(false)}
          header="Сбросить локальные данные?"
          message="Будет очищен кэш/состояние приложения. Вы выйдете из аккаунта."
          buttons={[
            { text: 'Отмена', role: 'cancel' },
            { text: 'Сбросить', role: 'destructive', handler: handleResetLocalData },
          ]}
        />

        <IonToast
          isOpen={toast.open}
          message={toast.message}
          duration={2200}
          color={toast.color as any}
          onDidDismiss={() => setToast((t) => ({ ...t, open: false }))}
        />
      </IonContent>
    </IonPage>
  );
};
