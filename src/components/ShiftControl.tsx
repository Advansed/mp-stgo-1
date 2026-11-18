import React, { useState } from 'react';
import { IonAlert, IonButton, IonIcon, IonSpinner, IonToast } from '@ionic/react';
import { locateOutline, timeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useSessionStore } from '../store/sessionStore';
import './ShiftControl.css';

function formatOpenedAt(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const ShiftControl: React.FC<{ placement?: 'list' | 'plain' }> = ({
  placement = 'plain',
}) => {
  const history = useHistory();
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const isOpen = useSessionStore((s) => s.isOpen);
  const session = useSessionStore((s) => s.session);
  const action = useSessionStore((s) => s.action);
  const error = useSessionStore((s) => s.error);
  const openSession = useSessionStore((s) => s.open);
  const closeSession = useSessionStore((s) => s.close);

  const [confirmClose, setConfirmClose] = useState(false);
  const [toast, setToast] = useState('');

  const busy = action === 'opening' || action === 'closing';
  const openedLabel = formatOpenedAt(session?.openedAt);

  const handleOpen = async () => {
    if (!token) return;
    const result = await openSession(token);
    if (!result.success && result.message) setToast(result.message);
  };

  const handleClose = async () => {
    if (!token) return;
    const result = await closeSession(token);
    if (!result.success) {
      if (result.message) setToast(result.message);
      return;
    }
    useSessionStore.getState().clear();
    logout();
    history.replace('/login');
  };

  return (
    <div className={`shift-card${placement === 'list' ? ' shift-card--list' : ''}${isOpen ? ' shift-card--open' : ''}`}>
      <div className="shift-card__head">
        <div className={`shift-card__icon${isOpen ? ' shift-card__icon--open' : ''}`}>
          <IonIcon icon={isOpen ? locateOutline : timeOutline} />
        </div>
        <div className="shift-card__meta">
          <div className="shift-card__title">{isOpen ? 'Смена открыта' : 'Смена закрыта'}</div>
          <div className="shift-card__note">
            {isOpen
              ? openedLabel
                ? `С ${openedLabel}. Координаты отправляются каждые 15 сек`
                : 'Координаты отправляются каждые 15 сек'
              : 'Откройте смену, чтобы начать работу'}
          </div>
        </div>
      </div>

      {error && action === 'idle' && <div className="shift-card__error">{error}</div>}

      {isOpen ? (
        <IonButton
          expand="block"
          fill="outline"
          color="danger"
          disabled={busy || !token}
          onClick={() => setConfirmClose(true)}
        >
          {action === 'closing' && <IonSpinner slot="start" name="crescent" />}
          Закрыть смену
        </IonButton>
      ) : (
        <IonButton expand="block" disabled={busy || !token} onClick={handleOpen}>
          {action === 'opening' && <IonSpinner slot="start" name="crescent" />}
          Открыть смену
        </IonButton>
      )}

      <IonAlert
        isOpen={confirmClose}
        onDidDismiss={() => setConfirmClose(false)}
        header="Закрыть смену?"
        message="Смена закроется, отправка координат остановится, и вы выйдете из аккаунта."
        buttons={[
          { text: 'Отмена', role: 'cancel' },
          { text: 'Закрыть', role: 'destructive', handler: () => void handleClose() },
        ]}
      />

      <IonToast
        isOpen={!!toast}
        message={toast}
        duration={2400}
        color="danger"
        onDidDismiss={() => setToast('')}
      />
    </div>
  );
};
