import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { documentsOutline, walletOutline, settingsOutline } from 'ionicons/icons';
import { useAuthStore } from '../../store/authStore';
import { useSessionStore } from '../../store/sessionStore';
import { ShiftGate, ShiftPending } from '../../components/ShiftGate';

import { InvoicesListPage } from '../invoices/InvoicesListPage';
import { InvoiceDetailsPage } from '../invoices/InvoiceDetailsPage';
import { InvoiceAddressPage } from '../invoices/InvoiceAddressPage';
import { LicsListPage } from '../lics/LicsListPage';
import { SettingsPage } from '../settings/SettingsPage';
import { ActEditPage } from '../acts/ActEditPage';
import { ActsListPage } from '../acts/ActsListPage';
import { ActPdfViewerPage } from '../acts/ActPdfViewerPage';
import { LicDetailsPage } from '../lics/LicDetailsPage';

import '../../theme/floating-tab.css';

export const TabsLayout: React.FC = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isOpen = useSessionStore((s) => s.isOpen);
  const settled = useSessionStore((s) => s.settled);
  const [authHydrated, setAuthHydrated] = useState(() =>
    useAuthStore.persist.hasHydrated()
  );
  const [sessionHydrated, setSessionHydrated] = useState(() =>
    useSessionStore.persist.hasHydrated()
  );

  useEffect(() => {
    setAuthHydrated(useAuthStore.persist.hasHydrated());
    return useAuthStore.persist.onFinishHydration(() => setAuthHydrated(true));
  }, []);

  useEffect(() => {
    setSessionHydrated(useSessionStore.persist.hasHydrated());
    return useSessionStore.persist.onFinishHydration(() => setSessionHydrated(true));
  }, []);

  if (!authHydrated || !sessionHydrated) {
    return <ShiftPending />;
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (!isOpen && !settled) {
    return <ShiftPending label="Проверяем смену" />;
  }

  if (!isOpen) {
    return <ShiftGate />;
  }

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/app/invoices/:id/acts/:actId/edit" component={ActEditPage} />
        <Route exact path="/app/invoices/:id/acts/new/:type" component={ActEditPage} />
        <Route exact path="/app/invoices/:id/acts/:actId/pdf" component={ActPdfViewerPage} />
        <Route exact path="/app/invoices/:id/acts" component={ActsListPage} />

        {/* === ЗАЯВКИ === */}
        <Route exact path="/app/invoices/:id/address" component={InvoiceAddressPage} />
        <Route exact path="/app/invoices/:id" component={InvoiceDetailsPage} />
        <Route exact path="/app/invoices" component={InvoicesListPage} />
        
        {/* === ЛИЦЕВЫЕ === */}
        <Route exact path="/app/lics/:code" component={LicDetailsPage} />
        <Route exact path="/app/lics" component={LicsListPage} />
        
        {/* === НАСТРОЙКИ === */}
        <Route exact path="/app/settings" component={SettingsPage} />

        <Route exact path="/app">
          <Redirect to="/app/invoices" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom" className="floating-tab-bar">
        <IonTabButton tab="invoices" href="/app/invoices">
          <IonIcon icon={documentsOutline} />
          <IonLabel>Заявки</IonLabel>
        </IonTabButton>

        <IonTabButton tab="lics" href="/app/lics">
          <IonIcon icon={walletOutline} />
          <IonLabel>Лицевые</IonLabel>
        </IonTabButton>

        <IonTabButton tab="settings" href="/app/settings">
          <IonIcon icon={settingsOutline} />
          <IonLabel>Настройки</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};
