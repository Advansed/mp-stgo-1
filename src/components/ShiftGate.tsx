import React from 'react';
import { IonButton, IonContent, IonIcon, IonPage, IonSpinner } from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useSessionStore } from '../store/sessionStore';
import { ShiftControl } from './ShiftControl';
import './ShiftGate.css';

export const ShiftPending: React.FC<{ label?: string }> = ({ label = 'Загрузка' }) => (
  <IonPage>
    <IonContent className="stng-content">
      <div className="shift-gate shift-gate--pending">
        <IonSpinner name="crescent" />
        <div className="shift-gate__lead">{label}</div>
      </div>
    </IonContent>
  </IonPage>
);

/** Единственный экран, пока смена закрыта. */
export const ShiftGate: React.FC = () => {
  const history = useHistory();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const clearSession = useSessionStore((s) => s.clear);
  const displayName = user?.fullName || user?.name;

  const handleLogout = () => {
    clearSession();
    logout();
    history.replace('/login');
  };

  return (
    <IonPage>
      <IonContent className="stng-content shift-gate-content">
        <div className="shift-gate">
          <div className="shift-gate__panel">
            <div className="shift-gate__title">Начало работы</div>
            {displayName && <div className="shift-gate__user">{displayName}</div>}
            <p className="shift-gate__lead">
              Заявки, лицевые и настройки откроются после начала смены.
            </p>
            <ShiftControl />
            <IonButton expand="block" fill="clear" color="medium" onClick={handleLogout}>
              <IonIcon slot="start" icon={logOutOutline} />
              Выйти из аккаунта
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
