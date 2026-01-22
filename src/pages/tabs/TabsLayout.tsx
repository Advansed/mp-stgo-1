import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { documentsOutline, walletOutline, settingsOutline } from 'ionicons/icons';

// Импорты страниц
import { InvoicesListPage } from '../invoices/InvoicesListPage';
import { InvoiceDetailsPage } from '../invoices/InvoiceDetailsPage';
import { InvoiceAddressPage } from '../invoices/InvoiceAddressPage';
import { LicsListPage } from '../lics/LicsListPage';
import { SettingsPage } from '../settings/SettingsPage';
import { ActEditPage } from '../acts/ActEditPage';
import { ActsListPage } from '../acts/ActsListPage'; // 🔥 НОВЫЙ ИМПОРТ
import { ActPdfViewerPage } from '../acts/ActPdfViewerPage'; // 🔥 ИМПОРТ

import '../../theme/floating-tab.css';

export const TabsLayout: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        
        {/* === АКТЫ === */}
        {/* 1. Редактор */}
        <Route exact path="/app/invoices/:id/acts/:actId/edit" component={ActEditPage} />
        <Route exact path="/app/invoices/:id/acts/new/:type" component={ActEditPage} />
        <Route exact path="/app/invoices/:id/acts/:actId/pdf" component={ActPdfViewerPage} />
        
        {/* 2. 🔥 СПИСОК АКТОВ (Исправление белого экрана) */}
        <Route exact path="/app/invoices/:id/acts" component={ActsListPage} />


        {/* === ЗАЯВКИ === */}
        <Route exact path="/app/invoices/:id/address" component={InvoiceAddressPage} />
        <Route exact path="/app/invoices/:id" component={InvoiceDetailsPage} />
        <Route exact path="/app/invoices" component={InvoicesListPage} />
        
        {/* === ЛИЦЕВЫЕ === */}
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