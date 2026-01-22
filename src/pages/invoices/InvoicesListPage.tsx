// src/pages/invoices/InvoicesListPage.tsx
import React, { useEffect } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonRefresher, IonRefresherContent, IonSpinner } from '@ionic/react';
import { useHistory } from 'react-router-dom'; // 🔥 Импорт
import { useInvoiceStore } from '../../store/invoiceStore';
import { useAuthStore } from '../../store/authStore';
import { InvoiceItem } from '../../components/ui/InvoiceItem';

export const InvoicesListPage: React.FC = () => {
  const { list, loading, loadInvoices } = useInvoiceStore();
  const token = useAuthStore(s => s.token);
  const history = useHistory(); // 🔥 Хук навигации

  useEffect(() => {
    if (token) loadInvoices(token);
  }, [token, loadInvoices]);

  const doRefresh = async (event: CustomEvent) => {
    if (token) await loadInvoices(token);
    event.detail.complete();
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{'--background': '#f7fafc'}}>
          <IonTitle style={{fontWeight: '800', fontSize: '24px', color: '#2d3748', paddingLeft: '16px'}}>
            Заявки
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{'--background': '#f7fafc'}}>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div style={{paddingBottom: '100px'}}>
          {loading && list.length === 0 && (
             <div style={{display: 'flex', justifyContent: 'center', paddingTop: '20px'}}>
               <IonSpinner name="crescent" />
             </div>
          )}
          
          {list.map(inv => (
            <InvoiceItem 
                key={inv.id} 
                invoice={inv} 
                onClick={() => history.push(`/app/invoices/${inv.id}`)} // 🔥 Поехали!
            />
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};