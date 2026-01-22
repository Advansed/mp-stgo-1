import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { 
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, 
  IonButtons, IonBackButton, IonFab, IonFabButton, IonIcon, 
  IonList, IonItem, IonLabel, IonActionSheet, IonSpinner, IonBadge 
} from '@ionic/react';
import { 
  add, documentTextOutline, createOutline, 
  arrowBack, documentOutline, batteryChargingOutline, 
  swapHorizontalOutline, shieldCheckmarkOutline 
} from 'ionicons/icons';
import { useActsStore } from '../../store/actsStore';
import { useAuthStore } from '../../store/authStore';
import { ACT_TEMPLATES } from '../../features/acts/configs/registry';

// Хелпер для иконок и цветов
const getActIcon = (type: string) => {
  if (type.includes('br')) return { icon: batteryChargingOutline, color: '#3182ce', bg: '#ebf8ff' }; // Синий
  if (type.includes('mr') || type.includes('mi')) return { icon: swapHorizontalOutline, color: '#805ad5', bg: '#f3e8ff' }; // Фиолетовый
  if (type.includes('plomb') || type.includes('sf')) return { icon: shieldCheckmarkOutline, color: '#e53e3e', bg: '#fff5f5' }; // Красный
  return { icon: documentTextOutline, color: '#718096', bg: '#edf2f7' }; // Серый
};

export const ActsListPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const token = useAuthStore(s => s.token);
  const { list, loading, loadActs } = useActsStore();
  
  const [showActionSheet, setShowActionSheet] = useState(false);

  useEffect(() => {
    if (token && id) loadActs(token, id);
  }, [token, id]);

  const actionSheetButtons = Object.values(ACT_TEMPLATES).map(tpl => ({
    text: tpl.name,
    handler: () => {
      history.push(`/app/invoices/${id}/acts/new/${tpl.type}`);
    }
  }));

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
             <IonBackButton defaultHref={`/app/invoices/${id}`} text="" icon={arrowBack} color="dark" />
          </IonButtons>
          <IonTitle style={{fontWeight: 700}}>Документы</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{'--background': '#f7fafc'}}>
        {loading && <div className="ion-text-center ion-padding"><IonSpinner /></div>}

        {!loading && list.length === 0 && (
            <div style={{textAlign: 'center', marginTop: '120px', color: '#a0aec0'}}>
                <div style={{background: '#edf2f7', width: 80, height: 80, borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <IonIcon icon={documentOutline} style={{fontSize: '40px', opacity: 0.6}} />
                </div>
                <h3 style={{fontSize: '18px', fontWeight: 600, color: '#2d3748', margin: 0}}>Нет актов</h3>
                <p style={{fontSize: '14px', color: '#718096', marginTop: 8}}>Создайте первый документ для этой заявки</p>
            </div>
        )}

        <IonList style={{background: 'transparent', padding: '16px'}}>
            {list.map((act) => {
                const template = ACT_TEMPLATES[act.type];
                const style = getActIcon(act.type);
                
                return (
                    <IonItem 
                        key={act.id} 
                        button 
                        onClick={() => history.push(`/app/invoices/${id}/acts/${act.id}/edit`)}
                        style={{
                            '--background': 'white', 
                            '--border-radius': '20px', 
                            marginBottom: '12px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                            border: '1px solid rgba(0,0,0,0.02)'
                        }}
                        lines="none"
                        detail={false}
                    >
                        <div style={{
                            width: '48px', height: '48px', background: style.bg, 
                            borderRadius: '14px', display: 'flex', alignItems: 'center', 
                            justifyContent: 'center', marginRight: '16px', color: style.color
                        }}>
                            <IonIcon icon={style.icon} size="small" />
                        </div>
                        <IonLabel>
                            <h2 style={{fontWeight: '700', fontSize: '15px', color: '#1a202c', marginBottom: '4px'}}>
                                {template?.name || act.type}
                            </h2>
                            <p style={{fontSize: '13px', color: '#718096', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <span>№ {act.act_number}</span>
                                <span style={{width: 4, height: 4, background: '#cbd5e0', borderRadius: '50%'}}></span>
                                <span>{new Date(act.act_date).toLocaleDateString('ru-RU')}</span>
                            </p>
                        </IonLabel>
                        
                        {/* Статус (Бейдж) */}
                        <div slot="end" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px'}}>
                            <IonIcon icon={createOutline} color="medium" style={{opacity: 0.3, fontSize: '20px'}} />
                        </div>
                    </IonItem>
                );
            })}
        </IonList>

        <IonFab vertical="bottom" horizontal="end" slot="fixed" style={{ marginBottom: '90px', marginRight: '16px' }}>
            <IonFabButton onClick={() => setShowActionSheet(true)} className="corporate-fab-button">
                <IonIcon icon={add} />
            </IonFabButton>
        </IonFab>

        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          header="Выберите тип документа"
          mode="md"
          buttons={[...actionSheetButtons, { text: 'Отмена', role: 'cancel', cssClass: 'action-sheet-cancel' }]}
        />
      </IonContent>
    </IonPage>
  );
};