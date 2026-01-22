// src/pages/settings/SettingsPage.tsx
import React from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButton } from '@ionic/react';
import { useAuthStore } from '../../store/authStore';

export const SettingsPage: React.FC = () => {
  const logout = useAuthStore(s => s.logout);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>Настройки</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div style={{ padding: 20 }}>
          <IonButton expand="block" color="danger" onClick={logout}>
            Выйти из аккаунта
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};