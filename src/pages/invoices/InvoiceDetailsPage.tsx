// src/pages/invoices/InvoiceDetailsPage.tsx
import React, { useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { 
  IonPage, IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, 
  IonTitle, IonIcon, IonButton, IonSpinner, IonChip 
} from '@ionic/react';
import { 
  locationOutline, callOutline, documentTextOutline, 
  arrowForwardOutline, personOutline 
} from 'ionicons/icons';
import { useInvoiceStore } from '../../store/invoiceStore';

export const InvoiceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const list = useInvoiceStore(s => s.list);
  
  // Ищем заявку в сторе по ID
  const invoice = useMemo(() => list.find(i => i.id === id), [list, id]);

  if (!invoice) {
    return (
      <IonPage>
        <IonHeader className="ion-no-border"><IonToolbar><IonTitle>Загрузка...</IonTitle></IonToolbar></IonHeader>
        <IonContent className="ion-padding"><IonSpinner /></IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            {/* Кнопка Назад стандартная */}
            <IonBackButton defaultHref="/app/invoices" text="Назад" color="dark" />
          </IonButtons>
          <IonTitle>Заявка #{invoice.number}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ '--background': '#f7fafc' }}>
        <div style={{ padding: '16px', paddingBottom: '120px' }}>
          
          {/* 1. Карточка Статуса */}
          <div style={{ background: 'white', padding: '16px', borderRadius: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#a0aec0' }}>Статус</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{invoice.status}</div>
            </div>
            <IonChip color="primary">{invoice.date}</IonChip>
          </div>

          {/* 2. Блок Адреса */}
          <div style={{ background: 'white', padding: '16px', borderRadius: '16px', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
              <IonIcon icon={locationOutline} style={{ fontSize: '20px', color: '#3182ce', marginRight: '10px', marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '12px', color: '#a0aec0', marginBottom: '4px' }}>АДРЕС</div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#2d3748', lineHeight: '1.4' }}>
                   {/* 🔥 Safe Render */}
                   {invoice.addressText}
                </div>
              </div>
            </div>
            {/* Кнопка редактирования адреса (задел на M4) */}
            <IonButton 
                fill="outline" size="small" expand="block" 
                style={{ height: '36px', '--border-radius': '10px' }}
                onClick={() => history.push(`/app/invoices/${id}/address`)}
            >
              Изменить адрес
            </IonButton>
          </div>

          {/* 3. Описание и Контакты */}
          <div style={{ background: 'white', padding: '16px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <IonIcon icon={callOutline} style={{ fontSize: '20px', color: '#38a169', marginRight: '10px' }} />
              <div>
                <div style={{ fontSize: '12px', color: '#a0aec0' }}>ТЕЛЕФОН</div>
                <div style={{ fontSize: '15px', fontWeight: '500' }}>{invoice.phone || 'Не указан'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <IonIcon icon={documentTextOutline} style={{ fontSize: '20px', color: '#d69e2e', marginRight: '10px', marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '12px', color: '#a0aec0' }}>ОПИСАНИЕ</div>
                <div style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.4' }}>
                  {invoice.service || 'Нет описания'}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Floating Action Button (Переход к актам) */}
        <div style={{ position: 'fixed', bottom: '90px', left: '16px', right: '16px' }}>
          <IonButton 
            expand="block" 
            style={{ '--background': '#086CA2', '--border-radius': '14px', height: '54px', fontWeight: 'bold' }}
            onClick={() => history.push(`/app/invoices/${id}/acts`)}
          >
            Перейти к Актам
            <IonIcon slot="end" icon={arrowForwardOutline} />
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};