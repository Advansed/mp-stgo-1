import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { 
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, 
  IonButtons, IonBackButton, IonSpinner, IonButton, IonIcon, IonToast, IonAlert
} from '@ionic/react';
import { eyeOutline, checkmarkCircle } from 'ionicons/icons';
import { useActsStore } from '../../store/actsStore';
import { useAuthStore } from '../../store/authStore';
import { useInvoiceStore } from '../../store/invoiceStore'; 
import { invoicesApi } from '../../api/invoicesApi'; 
import { ACT_TEMPLATES } from '../../features/acts/configs/registry';
import { GenericForm } from '../../features/acts/components/GenericForm';
import { normalizeInvoice } from '../../domain/normalizers';
import { normalizeAddress, normalizeFio } from '../../utils/formatters';

export const ActEditPage: React.FC = () => {
  const { id, actId, type } = useParams<{ id: string, actId: string, type: string }>();
  const history = useHistory();
  const token = useAuthStore(s => s.token);
  
  const { currentAct, loadActDetails, saveAct, loading: actLoading, clearCurrentAct, setCurrentAct } = useActsStore();
  
  // 1. Ищем заявку в памяти
  const invoiceFromStore = useInvoiceStore(s => s.list.find(i => i.id === id));
  
  // 2. Локальный стейт для догрузки
  const [fetchedInvoice, setFetchedInvoice] = useState<any>(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);

  const isNew = actId === 'new';
  const actType = isNew ? type : (currentAct?.type || type);
  const template = ACT_TEMPLATES[actType];

  useEffect(() => {
    return () => { clearCurrentAct(); };
  }, []);

  // Если редактируем — грузим акт
  useEffect(() => {
    if (!isNew && token && actId) {
      loadActDetails(token, id, actId);
    }
  }, [actId, isNew, token, id]);

  // 🔥 ЗАГРУЗКА ЗАЯВКИ (даже если она выполнена)
  useEffect(() => {
    const hasData = invoiceFromStore || fetchedInvoice;
    
    // Если данных нет, пытаемся загрузить весь список и найти там
    // (В идеале тут нужен метод API getInvoiceById(id), но используем то что есть)
    if (!hasData && token && id && !invoiceLoading) {
        setInvoiceLoading(true);
        console.log("Пытаюсь найти заявку на сервере...", id);
        invoicesApi.fetchAll(token).then(data => {
            if (Array.isArray(data)) {
                const found = data.find((i:any) => i.id === id);
                if(found) {
                    console.log("Заявка найдена:", found);
                    setFetchedInvoice(found);
                } else {
                    console.warn("Заявка НЕ найдена в списке (возможно архив?)");
                }
            }
        }).finally(() => setInvoiceLoading(false));
    }
  }, [invoiceFromStore, fetchedInvoice, token, id]);

  // 🔥 ЧИСТЫЕ ДАННЫЕ ЗАЯВКИ
  const cleanInvoice = useMemo(() => {
      const raw = invoiceFromStore || fetchedInvoice;
      if (!raw) return null;
      return normalizeInvoice(raw);
  }, [invoiceFromStore, fetchedInvoice]);

  // 🔥 АВТОЗАПОЛНЕНИЕ
  const initialData = useMemo(() => {
    // A. РЕДАКТИРОВАНИЕ
    if (!isNew && currentAct && Object.keys(currentAct).length > 0) {
        const details = currentAct.details || {};
        return {
            ...currentAct,
            ...details,
            // Если поля пустые, пробуем подтянуть из заявки (fallback)
            lic: currentAct.lic || details.lic || cleanInvoice?.lic || '',
            owner_name: currentAct.owner_name || details.owner_name || cleanInvoice?.client_name || '',
            object_address: currentAct.object_address || details.object_address || cleanInvoice?.addressText || ''
        };
    }

    // B. СОЗДАНИЕ
    if (isNew) {
        // Если заявка еще грузится - ждем
        if (invoiceLoading && !cleanInvoice) return null;

        console.log("Данные для автозаполнения:", cleanInvoice);

        return {
            act_number: cleanInvoice?.number || '',
            act_date: new Date().toISOString().split('T')[0],
            type: actType,
            
            // Заполняем даже если заявка Выполнена/Отменена
            lic: cleanInvoice?.lic || '',
            owner_name: cleanInvoice?.client_name || '',
            owner_phone: cleanInvoice?.phone || '',
            object_address: cleanInvoice?.addressText || '',
            
            technician_name: 'Слесарь СТГО',
            object_type: 'Квартира'
        };
    }
    return null;
  }, [isNew, currentAct, cleanInvoice, actType, invoiceLoading]);

  const handleSave = async (data: any) => {
    if (!token) return;

    // Проверка статуса (только предупреждение)
    if (cleanInvoice) {
        const s = (cleanInvoice.status || '').toLowerCase();
        if (s.includes('отмен')) {
             console.warn("Попытка сохранить акт для отмененной заявки");
        }
    }

    const payload = { 
        ...data, 
        invoice_id: id, 
        type: actType, 
        id: isNew ? undefined : actId,
        details: data // Дублируем для совместимости
    };
    
    try {
        const savedAct = await saveAct(token, payload);
        if (savedAct && savedAct.id) {
            setShowToast(true);
            setCurrentAct(savedAct);
            if (isNew) history.replace(`/app/invoices/${id}/acts/${savedAct.id}/edit`);
        } else {
            throw new Error("Не удалось сохранить (пустой ответ)");
        }
    } catch (e: any) {
        console.error("Save error:", e);
        setErrorAlert("Ошибка сохранения. Возможно, статус заявки не позволяет добавлять акты.");
    }
  };

  const handlePreview = () => {
     const realId = currentAct?.id || (actId !== 'new' ? actId : null);
     if (!realId) { alert('Сначала сохраните акт'); return; }
     history.push(`/app/invoices/${id}/acts/${realId}/pdf`);
  };

  if (!template) return <div className="ion-padding">Тип акта не найден</div>;
  
  // Показываем спиннер ТОЛЬКО если реально грузимся
  const isLoading = (actLoading && !isNew) || (invoiceLoading && isNew && !initialData);

  if (isLoading) {
      return (
          <IonPage>
              <IonHeader><IonToolbar><IonButtons slot="start"><IonBackButton /></IonButtons></IonToolbar></IonHeader>
              <IonContent><div className="ion-text-center ion-padding" style={{marginTop: '50px'}}><IonSpinner /></div></IonContent>
          </IonPage>
      );
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref={`/app/invoices/${id}/acts`} text="" color="dark" /></IonButtons>
          <IonTitle style={{fontSize: '16px'}}>{template.name}</IonTitle>
          <IonButtons slot="end">
             <IonButton onClick={handlePreview} color="primary"><IonIcon slot="icon-only" icon={eyeOutline} /></IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen style={{'--background': '#f7fafc'}}>
         <div style={{padding: '16px'}}>
             
             {/* Предупреждение о статусе */}
             {cleanInvoice && (cleanInvoice.status?.includes('Отмен') || cleanInvoice.status?.includes('Закрыт') || cleanInvoice.status?.includes('Выполн')) && (
                 <div style={{
                     background: '#fffaf0', color: '#c05621', padding: '12px', 
                     borderRadius: '12px', marginBottom: '16px', border: '1px solid #fbd38d',
                     fontSize: '13px', textAlign: 'center'
                 }}>
                     Статус заявки: <b>{cleanInvoice.status}</b>. <br/>
                     Автозаполнение может быть ограничено сервером.
                 </div>
             )}

             <GenericForm 
                key={initialData?.act_number || 'form'} 
                template={template} 
                initialData={initialData || {}} 
                onSave={handleSave} 
             />
         </div>
         <IonToast isOpen={showToast} onDidDismiss={() => setShowToast(false)} message="Сохранено успешно" duration={2000} color="success" icon={checkmarkCircle} />
         <IonAlert isOpen={!!errorAlert} onDidDismiss={() => setErrorAlert(null)} header="Ошибка" message={errorAlert || ''} buttons={['OK']} />
      </IonContent>
    </IonPage>
  );
};