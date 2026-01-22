import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/floating-tab.css';

// Импорты страниц
import { LoginPage } from './pages/auth/LoginPage';
import { TabsLayout } from './pages/tabs/TabsLayout';
import { InvoiceDetailsPage } from './pages/invoices/InvoiceDetailsPage';
import { InvoiceAddressPage } from './pages/invoices/InvoiceAddressPage';
import { ActsListPage } from './pages/acts/ActsListPage';
import { ActEditPage } from './pages/acts/ActEditPage';
import { ActPdfViewerPage } from './pages/acts/ActPdfViewerPage';
import { FinalActPage } from './pages/acts/FinalActPage'; // <--- ВАЖНО: Импорт новой страницы

setupIonicReact({
  mode: 'md', 
});

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/login" component={LoginPage} />
        
        {/* Основной лайаут (Табы) */}
        <Route path="/app" component={TabsLayout} />
        
        {/* Вложенные маршруты для заявок */}
        <Route path="/app/invoices/:id" component={InvoiceDetailsPage} exact />
        <Route path="/app/invoices/:id/address" component={InvoiceAddressPage} exact />
        
        {/* Маршруты Актов */}
        <Route path="/app/invoices/:id/acts" component={ActsListPage} exact />
        <Route path="/app/invoices/:id/acts/new/:type" component={ActEditPage} exact />
        <Route path="/app/invoices/:id/acts/:actId/edit" component={ActEditPage} exact />
        <Route path="/app/invoices/:id/acts/:actId/pdf" component={ActPdfViewerPage} exact />
        
        {/* 🔥 ВОТ ЭТОЙ СТРОКИ НЕ ХВАТАЛО 👇 */}
        <Route path="/app/invoices/:id/final-act" component={FinalActPage} exact />

        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;