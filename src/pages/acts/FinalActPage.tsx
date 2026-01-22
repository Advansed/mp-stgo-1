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
  const invoiceFromStore = useInvoiceStore(s => s.list.find(i => i.id === id));
  
  const [fetchedInvoice, setFetchedInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Используем новый шаблон actfinal
  const template = ACT_TEMPLATES['actfinal']; 

  // Сброс при входе
  useEffect(() => {
    clearCurrentAct();
  }, []);

  // Грузим заявку
  useEffect(() => {
    const hasData = invoiceFromStore || fetchedInvoice;
    if (!hasData && token && id) {
        setLoading(true);
        invoicesApi.fetchAll(token).then(data => {
            if (Array.isArray(data)) {
                const found = data.find((i:any) => i.id === id);
                if(found) setFetchedInvoice(found);
            }
        }).finally(() => setLoading(false));
    }
  }, [invoiceFromStore, fetchedInvoice, token, id]);

  const cleanInvoice = useMemo(() => {
      const raw = invoiceFromStore || fetchedInvoice;
      return raw ? normalizeInvoice(raw) : null;
  }, [invoiceFromStore, fetchedInvoice]);

  // АВТОЗАПОЛНЕНИЕ
  const initialData = useMemo(() => {
      if (!cleanInvoice) return null;

      return {
          act_number: `FIN-${cleanInvoice.number}`,
          act_date: new Date().toISOString().split('T')[0],
          type: 'actfinal', // 🔥 ПРОВЕРЬ: Если сервер ругается, замени 'actfinal' на 'actbr' для теста
          
          lic: cleanInvoice.lic || '',
          owner_name: cleanInvoice.client_name || '',
          owner_phone: cleanInvoice.phone || '',
          object_address: cleanInvoice.addressText || '',
          
          work_description: cleanInvoice.service || 'Работы выполнены в полном объеме',
          amount: 0, // Дефолтное значение для числа
          
          technician_name: 'Слесарь СТГО',
      };
  }, [cleanInvoice]);

  const handleSave = async (data: any) => {
    if (!token) return;
    
    // Формируем payload
    const payload = { 
        ...data, 
        invoice_id: id, 
        type: 'actfinal', 
        details: data 
    };

    console.log("SENDING PAYLOAD:", payload);

    try {
        const result = await saveAct(token, payload);
        
        // Проверяем результат
        if (result && result.id) {
            console.log("Saved success:", result);
            setIsSaved(true);
            setShowToast(true);
        } else {
            console.error("Save failed, result is empty:", result);
            // Если saveAct вернул null, значит в ActsApi/Store ошибка поймана, но не проброшена.
            // Нужно смотреть Network Tab в браузере -> XHR -> запрос 'acts'.
            alert('Ошибка сохранения! Сервер не вернул ID акта. Проверьте консоль Network.');
        }
    } catch (e: any) {
        console.error("Save Error:", e);
        alert(`Ошибка при сохранении: ${e.message || 'Неизвестная ошибка'}`);
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

  const isPageLoading = (loading && !initialData) || !template;

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref={`/app/invoices/${id}/acts`} text="" color="dark" /></IonButtons>
          <IonTitle>Завершение</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen style={{'--background': '#f7fafc'}}>
         {isPageLoading ? (
             <div className="ion-padding ion-text-center" style={{marginTop: '50px'}}>
                 <IonSpinner />
                 <p>Загрузка данных...</p>
             </div>
         ) : (
             <div style={{padding: '16px', paddingBottom: '120px'}}>
                 <GenericForm 
                    key="final-act-form"
                    template={template} 
                    initialData={initialData || {}} 
                    onSave={handleSave} 
                 />
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
      </IonContent>
    </IonPage>
  );
};