import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { 
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, 
  IonButtons, IonBackButton, IonSpinner, IonButton, IonIcon, IonToast
} from '@ionic/react';
import { checkmarkDoneOutline } from 'ionicons/icons';
import { useActsStore } from '../../store/actsStore';
import { useAuthStore } from '../../store/authStore';
import { useInvoiceStore } from '../../store/invoiceStore'; 
import { invoicesApi } from '../../api/invoicesApi'; 
import { ACT_TEMPLATES } from '../../features/acts/configs/registry';
import { GenericForm } from '../../features/acts/components/GenericForm';
import { normalizeInvoice } from '../../domain/normalizers';

export const FinalActPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const token = useAuthStore(s => s.token);
  
  const { saveAct, clearCurrentAct } = useActsStore();
  // id в сторе может быть number, а из URL — string
  const invoiceFromStore = useInvoiceStore(s => s.list.find(i => String(i.id) === String(id)));
  
  const [fetchedInvoice, setFetchedInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const template = ACT_TEMPLATES['work_completed']; 

  useEffect(() => {
    clearCurrentAct();
  }, []);

  useEffect(() => {
    const hasData = invoiceFromStore || fetchedInvoice;
    if (!hasData && token && id) {
        setLoading(true);
        invoicesApi.fetchAll(token).then(data => {
            if (Array.isArray(data)) {
                const found = data.find((i:any) => String(i.id) === String(id));
                if(found) setFetchedInvoice(found);
            }
        }).finally(() => setLoading(false));
    }
  }, [invoiceFromStore, fetchedInvoice, token, id]);

  const cleanInvoice = useMemo(() => {
      const raw = invoiceFromStore || fetchedInvoice;
      return raw ? normalizeInvoice(raw) : null;
  }, [invoiceFromStore, fetchedInvoice]);

  const initialData = useMemo(() => {
      if (!cleanInvoice) return null;

      return {
          act_number: `FIN-${cleanInvoice.number}`,
          act_date: new Date().toISOString().split('T')[0],
          type: 'work_completed',
          
          lic: cleanInvoice.lic || '',
          owner_name: cleanInvoice.client_name || '',
          owner_phone: cleanInvoice.phone || '',
          object_address: cleanInvoice.addressText || '',
          
          work_description: cleanInvoice.service || 'Работы выполнены в полном объеме',
          amount: 0,
          warranty: '12',
          
          technician_name: 'Слесарь СТГО',
          technician_signature: '',
          owner_signature: '',
          photo_result: ''
      };
  }, [cleanInvoice]);

  const normalizeActNumber = (n: any) => {
    const s = String(n || '').trim();
    // FIN-000073930 -> 000073930
    return s.startsWith('FIN-') ? s.slice(4) : s;
  };

  const cleanDataUrl = (v: any) => {
    if (typeof v !== 'string') return '';
    const s = v.trim();
    return s.startsWith('data:') && s.length > 32 ? s : '';
  };

  const handleSave = async (data: any) => {
    if (!token) return;

    const cleanSignature = (sig: any) => cleanDataUrl(sig);

    const payload = {
        invoice_id: id,
        type: 'work_completed',
        
        act_number: normalizeActNumber(data.act_number),
        act_date: data.act_date,

        // важно для SQL NOT NULL
        status: 'draft',
        
        executor_name: data.technician_name || "Не указан",
        executor_position: 'Слесарь', 
        executor_signature: cleanSignature(data.technician_signature),

        client_name: data.owner_name || "Не указан",
        address: data.object_address || "",
        client_signature: cleanSignature(data.owner_signature),
        
        work_description: data.work_description || "",
        amount: Number(data.amount) || 0,
        warranty: String(data.warranty || ""),
        photo_result: cleanSignature(data.photo_result),
        
        notes: '',
        quality_assessment: 'Удовлетворительно',

        // совместимость
        lic: data.lic,
        owner_name: data.owner_name,
        technician_name: data.technician_name
    };

    console.log("🚀 Sending FLAT Payload:", payload);

    try {
        const result = await saveAct(token, payload);
        console.log("✅ Saved success:", result);
        setIsSaved(true);
        setShowToast(true);
    } catch (e: any) {
        console.error("❌ Save Exception:", e);
        setErrorToast(e?.message || 'Не удалось сохранить акт');
    }
  };

  const handleCloseInvoice = async () => {
      if (!token) return;
      if (!window.confirm("Вы уверены, что хотите закрыть заявку?")) return;

      try {
          await invoicesApi.closeInvoice(token, id);
          alert("Заявка успешно закрыта!");
          history.replace('/app/invoices');
      } catch (e) {
          console.error(e);
          alert("Не удалось закрыть заявку");
      }
  };

  const showForm = !loading && template && initialData;

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref={`/app/invoices/${id}/acts`} text="" color="dark" /></IonButtons>
          <IonTitle>Завершение</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen style={{'--background': '#f7fafc'}}>
         {loading && (
             <div className="ion-padding ion-text-center" style={{marginTop: '50px'}}>
                 <IonSpinner />
                 <p style={{color: '#888'}}>Загрузка...</p>
             </div>
         )}

         {!loading && !template && (
             <div className="ion-padding ion-text-center" style={{marginTop: '20px', color: 'red'}}>
                 Ошибка: Шаблон 'work_completed' не найден.
             </div>
         )}

         {showForm && (
             <div style={{padding: '16px', paddingBottom: '120px'}}>
                 <GenericForm 
                    key="final-act-form"
                    template={template} 
                    initialData={initialData} 
                    onSave={handleSave} 
                 />
             </div>
         )}

         {!loading && template && !initialData && (
             <div className="ion-padding ion-text-center" style={{marginTop: '20px', color: '#666'}}>
                Заявка не найдена. Вернитесь назад и откройте акты заново.
             </div>
         )}

         {isSaved && (
             <div style={{position: 'fixed', bottom: '30px', left: '16px', right: '16px', zIndex: 1001}}>
                 <IonButton 
                    expand="block" color="success" onClick={handleCloseInvoice}
                    style={{height: '56px', fontWeight: 'bold', '--border-radius': '14px', '--box-shadow': '0 8px 20px rgba(72, 187, 120, 0.4)'}}
                 >
                    <IonIcon slot="start" icon={checkmarkDoneOutline} />
                    ЗАКРЫТЬ ЗАЯВКУ
                 </IonButton>
             </div>
         )}

         <IonToast isOpen={showToast} message="Акт сохранен! Теперь закройте заявку." duration={3000} onDidDismiss={() => setShowToast(false)} color="primary"/>
         <IonToast isOpen={!!errorToast} message={errorToast || ''} duration={3500} onDidDismiss={() => setErrorToast(null)} color="danger"/>
      </IonContent>
    </IonPage>
  );
};
