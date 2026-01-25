import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { 
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, 
  IonButtons, IonBackButton, IonFab, IonFabButton, IonIcon, 
  IonList, IonItem, IonLabel, IonActionSheet, IonSpinner, IonButton, IonToast
} from '@ionic/react';
import { 
  add, documentTextOutline, createOutline, 
  sendOutline, arrowForward
} from 'ionicons/icons';
import { useActsStore } from '../../store/actsStore';
import { useAuthStore } from '../../store/authStore';
import { ACT_TEMPLATES } from '../../features/acts/configs/registry';

export const ActsListPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const token = useAuthStore(s => s.token);
  const { list, loading, loadActs, sendAllActs } = useActsStore();
  
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  useEffect(() => {
    if (token && id) loadActs(token, id);
  }, [token, id]);

  const actionSheetButtons = Object.values(ACT_TEMPLATES).map(tpl => ({
    text: tpl.name,
    handler: () => history.push(`/app/invoices/${id}/acts/new/${tpl.type}`)
  }));

  const hasActs = list.length > 0;

  const handleSendAll = async () => {
    if (!token || !id) return;
    setSending(true);
    try {
      await sendAllActs(token, id);
      setIsSent(true);
      setShowToast(true);
    } catch (e: any) {
      console.error('Send acts failed:', e);
      setErrorToast(e?.message || 'Не удалось отправить акты');
    } finally {
      setSending(false);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
             <IonBackButton defaultHref={`/app/invoices/${id}`} text="" color="dark" />
          </IonButtons>
          <IonTitle>Документы</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{'--background': '#f7fafc'}}>
        <div style={{paddingBottom: '250px'}}>
            {loading && <div className="ion-text-center ion-padding"><IonSpinner /></div>}

            {!loading && list.length === 0 && (
                <div style={{textAlign: 'center', marginTop: '60px', padding: '20px', color: '#a0aec0'}}>
                    <p>Актов пока нет.</p>
                    <p>Нажмите "+", чтобы создать.</p>
                </div>
            )}

            <IonList style={{background: 'transparent', padding: '16px'}}>
                {list.map((act) => {
                    const template = ACT_TEMPLATES[act.type];
                    return (
                        <IonItem 
                            key={act.id} 
                            button 
                            onClick={() => history.push(`/app/invoices/${id}/acts/${act.id}/edit`)}
                            style={{
                                '--background': 'white', 
                                '--border-radius': '16px', 
                                marginBottom: '10px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                            }}
                            lines="none"
                            detail={false}
                        >
                            <div style={{
                                width: '42px', height: '42px', background: '#ebf8ff', 
                                borderRadius: '12px', display: 'flex', alignItems: 'center', 
                                justifyContent: 'center', marginRight: '16px', color: '#3182ce'
                            }}>
                                <IonIcon icon={documentTextOutline} size="small" />
                            </div>
                            <IonLabel>
                                <h2 style={{fontWeight: '700', fontSize: '15px'}}>{template?.name || act.type}</h2>
                                <p style={{fontSize: '13px', color: '#718096'}}>№ {act.act_number}</p>
                            </IonLabel>
                            <IonIcon icon={createOutline} slot="end" color="medium" style={{opacity: 0.4}} />
                        </IonItem>
                    );
                })}
            </IonList>
        </div>

        <IonFab vertical="bottom" horizontal="end" slot="fixed" style={{ marginBottom: '200px', marginRight: '16px' }}>
            <IonFabButton onClick={() => setShowActionSheet(true)} color="secondary">
                <IonIcon icon={add} />
            </IonFabButton>
        </IonFab>

        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          header="Выберите тип акта"
          buttons={[...actionSheetButtons, { text: 'Отмена', role: 'cancel' }]}
        />
        
        <IonToast isOpen={showToast} message="Отправлено!" duration={2000} color="success" onDidDismiss={() => setShowToast(false)}/>
        <IonToast isOpen={!!errorToast} message={errorToast || ''} duration={2600} color="danger" onDidDismiss={() => setErrorToast(null)} />
        
        <div style={{ position: 'fixed', bottom: '120px', left: '16px', right: '16px', zIndex: 999 }}>
            {!isSent ? (
                <IonButton 
                    expand="block" 
                    color="primary" 
                    disabled={!hasActs || sending || loading} 
                    onClick={handleSendAll}
                    style={{
                        height: '56px', fontWeight: 'bold', 
                        '--border-radius': '14px', 
                        '--box-shadow': '0 8px 20px rgba(49, 130, 206, 0.4)'
                    }}
                >
                    {sending ? <IonSpinner slot="start" /> : <IonIcon icon={sendOutline} slot="start" />}
                    {sending ? 'Отправляем…' : 'Отправить акты'}
                </IonButton>
            ) : (
                <IonButton 
                    expand="block" 
                    color="success" 
                    onClick={() => history.push(`/app/invoices/${id}/final-act`)}
                    style={{height: '56px', fontWeight: 'bold', '--border-radius': '14px'}}
                >
                    Далее: Акт выполненных работ
                    <IonIcon icon={arrowForward} slot="end" />
                </IonButton>
            )}
        </div>
      </IonContent>
    </IonPage>
  );
};
