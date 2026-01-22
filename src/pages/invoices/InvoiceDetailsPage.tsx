import React, { useMemo, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { 
  IonPage, IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, 
  IonTitle, IonIcon, IonButton, IonSpinner, IonCard, IonCardContent, 
  IonItem, IonLabel, IonChip, IonGrid, IonRow, IonCol, IonToast
} from '@ionic/react';
import { 
  locationOutline, callOutline, documentTextOutline, 
  arrowForwardOutline, personOutline, timeOutline,
  createOutline, mapOutline, alertCircleOutline
} from 'ionicons/icons';
import { useInvoiceStore } from '../../store/invoiceStore';
import { useAuthStore } from '../../store/authStore';

export const InvoiceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const token = useAuthStore(s => s.token);
  const { list, loading, loadInvoices } = useInvoiceStore();
  
  const invoice = useMemo(() => list.find(i => i.id === id), [list, id]);
  const [showToast, setShowToast] = useState(false);

  React.useEffect(() => {
    if (!invoice && token) {
      loadInvoices(token);
    }
  }, [invoice, token]);

  if (loading && !invoice) {
    return (
      <IonPage>
        <IonHeader className="ion-no-border"><IonToolbar><IonTitle>Загрузка...</IonTitle></IonToolbar></IonHeader>
        <IonContent className="ion-padding ion-text-center"><IonSpinner /></IonContent>
      </IonPage>
    );
  }

  if (!invoice) {
    return (
      <IonPage>
        <IonHeader><IonToolbar><IonButtons slot="start"><IonBackButton /></IonButtons></IonToolbar></IonHeader>
        <IonContent className="ion-padding ion-text-center">
            <IonIcon icon={alertCircleOutline} size="large" color="medium" />
            <p>Заявка не найдена</p>
        </IonContent>
      </IonPage>
    );
  }

  const handleCall = () => {
    if (invoice.phone) window.location.href = `tel:${invoice.phone}`;
    else setShowToast(true);
  };

  const handleMap = () => {
    const query = encodeURIComponent(invoice.addressText || '');
    window.open(`yandexmaps://maps.yandex.ru/?text=${query}`, '_system');
  };

  const handleEditAddress = () => history.push(`/app/invoices/${id}/address`);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{'--background': '#f7fafc'}}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/invoices" text="" color="dark" />
          </IonButtons>
          <IonTitle style={{fontSize: '18px', fontWeight: 'bold'}}>Заявка № {invoice.number}</IonTitle>
          <IonButtons slot="end">
             <IonChip color={invoice.status === 'Выполнена' ? 'success' : 'warning'}>
                {invoice.status || 'В работе'}
             </IonChip>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{'--background': '#f7fafc'}}>
        {/* Отступ снизу 120px, чтобы контент не уходил под кнопку */}
        <div style={{padding: '16px', paddingBottom: '120px'}}>

          {/* 1. АБОНЕНТ */}
          <IonCard style={{margin: '0 0 16px 0', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)'}}>
            <IonCardContent style={{padding: '0'}}>
                <IonItem lines="none">
                    <IonIcon icon={personOutline} slot="start" color="primary" />
                    <IonLabel>
                        <p style={{fontSize: '12px', color: '#718096', fontWeight: '600'}}>АБОНЕНТ</p>
                        {/* 🔥 ТУТ ТЕПЕРЬ ТОЧНО БУДЕТ ИМЯ (из поля applicant) */}
                        <h2 style={{fontSize: '16px', fontWeight: '700', whiteSpace: 'normal', marginTop: '4px'}}>
                            {invoice.client_name || invoice.applicant || 'Не указан'}
                        </h2>
                        <p style={{fontSize: '14px', marginTop: '6px', color: '#4a5568'}}>
                           Л/С: <b>{invoice.lic || 'Нет'}</b>
                        </p>
                    </IonLabel>
                </IonItem>
                
                <div style={{padding: '0 16px 16px 16px'}}>
                    <IonButton expand="block" fill="outline" onClick={handleCall} style={{'--border-radius': '12px'}}>
                        <IonIcon icon={callOutline} slot="start" />
                        Позвонить
                    </IonButton>
                </div>
            </IonCardContent>
          </IonCard>

          {/* 2. АДРЕС */}
          <IonCard style={{margin: '0 0 16px 0', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)'}}>
            <IonCardContent>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                    <div style={{display: 'flex', alignItems: 'flex-start'}}>
                        <IonIcon icon={locationOutline} style={{fontSize: '24px', color: '#e53e3e', marginRight: '12px'}} />
                        <div>
                            <div style={{fontSize: '12px', color: '#718096', fontWeight: '600'}}>АДРЕС ОБЪЕКТА</div>
                            <div style={{fontSize: '15px', color: '#2d3748', fontWeight: '500', marginTop: '4px', lineHeight: '1.4'}}>
                                {invoice.addressText || 'Адрес не указан'}
                            </div>
                        </div>
                    </div>
                    <IonButton fill="clear" size="small" onClick={handleEditAddress}>
                        <IonIcon icon={createOutline} slot="icon-only" />
                    </IonButton>
                </div>
                <div style={{marginTop: '16px'}}>
                    <IonButton expand="block" fill="outline" color="secondary" onClick={handleMap} style={{'--border-radius': '12px'}}>
                        <IonIcon icon={mapOutline} slot="start" />
                        Показать на карте
                    </IonButton>
                </div>
            </IonCardContent>
          </IonCard>

          {/* 3. ЗАДАЧА */}
          <IonCard style={{margin: '0 0 16px 0', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)'}}>
            <IonCardContent>
                <div style={{display: 'flex', alignItems: 'flex-start'}}>
                    <IonIcon icon={documentTextOutline} style={{fontSize: '24px', color: '#d69e2e', marginRight: '12px'}} />
                    <div>
                        <div style={{fontSize: '12px', color: '#718096', fontWeight: '600'}}>ОПИСАНИЕ ЗАДАЧИ</div>
                        <div style={{fontSize: '15px', color: '#2d3748', marginTop: '4px', lineHeight: '1.5'}}>
                            {invoice.service || 'Нет описания'}
                        </div>
                        {invoice.date && (
                            <div style={{marginTop: '12px', display: 'flex', alignItems: 'center', color: '#718096', fontSize: '13px'}}>
                                <IonIcon icon={timeOutline} style={{marginRight: '6px'}} />
                                {new Date(invoice.date).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                </div>
            </IonCardContent>
          </IonCard>

        </div>
        
        <IonToast isOpen={showToast} message="Номер телефона не указан в заявке" duration={2000} onDidDismiss={() => setShowToast(false)} />
      </IonContent>

      {/* 🔥 КНОПКА ПОДНЯТА НА 80px (над таббаром) + Z-INDEX */}
      <div style={{
          position: 'absolute', 
          bottom: '120px', 
          left: '16px', 
          right: '16px', 
          zIndex: 999 
      }}>
        <IonButton 
          expand="block" 
          onClick={() => history.push(`/app/invoices/${id}/acts`)}
          style={{
              '--background': '#3182ce', 
              '--border-radius': '14px', 
              height: '56px', 
              fontSize: '16px',
              fontWeight: 'bold',
              '--box-shadow': '0 4px 12px rgba(49, 130, 206, 0.4)'
          }}
        >
          Перейти к актам
          <IonIcon slot="end" icon={arrowForwardOutline} />
        </IonButton>
      </div>
    </IonPage>
  );
};