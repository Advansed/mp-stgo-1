import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { 
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, 
  IonButtons, IonBackButton, IonSpinner, IonButton, IonIcon, IonToast
} from '@ionic/react';
import { eyeOutline, checkmarkCircle } from 'ionicons/icons';
import { useActsStore } from '../../store/actsStore';
import { useAuthStore } from '../../store/authStore';
import { ACT_TEMPLATES } from '../../features/acts/configs/registry';
import { GenericForm } from '../../features/acts/components/GenericForm';
import { invoicesApi } from '../../api/invoicesApi'; // Прямой API запрос

export const ActEditPage: React.FC = () => {
  const { id, actId, type } = useParams<{ id: string, actId: string, type: string }>();
  const history = useHistory();
  const token = useAuthStore(s => s.token);
  const { currentAct, loadActDetails, saveAct, loading, clearCurrentAct, setCurrentAct } = useActsStore();
  
  const [invoiceData, setInvoiceData] = useState<any>(null); // Локальные данные заявки
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const isNew = actId === 'new';
  const actType = isNew ? type : (currentAct?.type || type);
  const template = ACT_TEMPLATES[actType];

  // 1. Очистка при выходе
  useEffect(() => {
    return () => { clearCurrentAct(); };
  }, []);

  // 2. Загрузка данных Заявки (для автозаполнения)
  useEffect(() => {
      const fetchInv = async () => {
          if (!token || !id) return;
          try {
              const res = await invoicesApi.getInvoices(token);
              if (res.success && res.data) {
                  const found = res.data.find((i:any) => i.id === id);
                  if (found) setInvoiceData(found);
              }
          } catch (e) { console.error(e); }
      };
      // Если данных нет - грузим
      if (isNew && !invoiceData) fetchInv();
  }, [id, token, isNew]);

  // 3. Загрузка самого Акта (если редактируем)
  useEffect(() => {
    if (!isNew && token && actId) {
      loadActDetails(token, id, actId);
    }
  }, [actId, isNew, token, id]);

  // 🔥 ПОДГОТОВКА ДАННЫХ ДЛЯ ФОРМЫ
  const initialData = useMemo(() => {
      // Приоритет 1: Загруженный акт
      if (currentAct && Object.keys(currentAct).length > 0) return currentAct;
      
      // Приоритет 2: Автозаполнение для нового
      if (isNew && invoiceData) {
          return {
              act_number: invoiceData.number, // Номер заявки
              act_date: new Date().toISOString().split('T')[0],
              details: {
                  object_address: invoiceData.address || invoiceData.addressText,
                  owner_name: invoiceData.client_name || invoiceData.fio,
                  owner_phone: invoiceData.phone,
                  technician_name: 'Слесарь СТГО',
                  object_type: 'Квартира'
              }
          };
      }
      return {};
  }, [currentAct, isNew, invoiceData]);

  const handleSave = async (data: any) => {
    if (!token) return;
    setIsSaving(true);

    const payload = { 
        ...data, 
        invoice_id: id, 
        type: actType, 
        id: isNew ? undefined : actId 
    };
    
    // Сохраняем
    const savedAct = await saveAct(token, payload);
    setIsSaving(false);
    
    if (savedAct && savedAct.id) {
        setShowToast(true);
        // 🔥 Обновляем currentAct, чтобы форма не сбросилась
        setCurrentAct(savedAct);
        
        // 🔥 Если был новый, меняем URL без перезагрузки
        if (isNew) {
            history.replace(`/app/invoices/${id}/acts/${savedAct.id}/edit`);
        }
    } else {
        alert("Не удалось сохранить акт");
    }
  };

  const handlePreview = () => {
     // Берем ID из памяти (только что сохранили) или из URL
     const realId = currentAct?.id || (actId !== 'new' ? actId : null);
     if (!realId) {
        alert('Сначала сохраните акт');
        return;
     }
     history.push(`/app/invoices/${id}/acts/${realId}/pdf`);
  };

  if (!template) return <div>Тип не найден</div>;

  if (loading && !isNew) return <IonSpinner />;

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref={`/app/invoices/${id}/acts`} text="" color="dark" /></IonButtons>
          <IonTitle>{template.name}</IonTitle>
          <IonButtons slot="end">
             <IonButton onClick={handlePreview} disabled={isSaving}>
                 <IonIcon slot="icon-only" icon={eyeOutline} />
             </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen style={{'--background': '#f7fafc'}}>
         <div style={{padding: 16}}>
             {/* Key заставляет перерисоваться, когда подгрузилась invoiceData */}
             <GenericForm 
                key={initialData.act_number ? 'loaded' : 'loading'}
                template={template} 
                initialData={initialData} 
                onSave={handleSave} 
             />
         </div>
         <IonToast isOpen={showToast} onDidDismiss={() => setShowToast(false)} message="Сохранено!" duration={2000} color="success" icon={checkmarkCircle} />
      </IonContent>
    </IonPage>
  );
};