import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonSpinner,
  IonButton,
  IonIcon,
  IonToast,
  IonAlert,
} from '@ionic/react';
import { eyeOutline, checkmarkCircle } from 'ionicons/icons';
import { useActsStore } from '../../store/actsStore';
import { useAuthStore } from '../../store/authStore';
import { useInvoiceStore } from '../../store/invoiceStore';
import { useLicsStore } from '../../store/licsStore';
import { invoicesApi } from '../../api/invoicesApi';
import { ACT_TEMPLATES } from '../../features/acts/configs/registry';
import { GenericForm } from '../../features/acts/components/GenericForm';
import { normalizeInvoice } from '../../domain/normalizers';
import { normalizeAddress, normalizeFio } from '../../utils/formatters';

type Params = {
  id: string;
  actId?: string; // есть только на /acts/:actId/edit
  type?: string;  // есть только на /acts/new/:type
};

const todayYmd = () => new Date().toISOString().split('T')[0];

export const ActEditPage: React.FC = () => {
  const { id, actId: actIdParam, type: typeParam } = useParams<Params>();
  const history = useHistory();

  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const {
    list: actsList,
    currentAct,
    loadActDetails,
    loadActDraft,
    saveAct,
    loading: actLoading,
    clearCurrentAct,
    setCurrentAct,
  } = useActsStore();

  // 1) Заявка из стора
  const invoiceFromStore = useInvoiceStore((s) => s.list.find((i) => String(i.id) === String(id)));

  // 2) Фоллбек: догружаем заявки списком
  const [fetchedInvoice, setFetchedInvoice] = useState<any>(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);

  // ВАЖНО: на роуте /acts/new/:type actId отсутствует => это новый акт
  const isNew = !actIdParam && !!typeParam;
  const actId = actIdParam;

  // На edit-роуте typeParam нет, но тип можно взять из списка актов (actsList)
  const actFromList = useMemo(() => {
    if (!actId) return null;
    return actsList.find((a) => String(a.id) === String(actId)) || null;
  }, [actsList, actId]);

  const actType = useMemo(() => {
    if (isNew) return String(typeParam || '').trim();
    return String(currentAct?.type || actFromList?.type || typeParam || '').trim();
  }, [isNew, typeParam, currentAct?.type, actFromList?.type]);

  const template = actType ? ACT_TEMPLATES[actType] : undefined;

  // чистим currentAct при уходе
  useEffect(() => {
    return () => {
      clearCurrentAct();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // EDIT: грузим акт по id
  useEffect(() => {
    if (isNew) return;
    if (!token || !id || !actId) return;
    loadActDetails(token, id, actId);
  }, [isNew, token, id, actId, loadActDetails]);

  // NEW: просим черновик с сервера (чтобы сервер выдал act_number)
  const draftRequestedRef = useRef(false);
  useEffect(() => {
    if (!isNew) {
      draftRequestedRef.current = false;
      return;
    }
    if (draftRequestedRef.current) return;
    if (!token || !id || !actType) return;

    draftRequestedRef.current = true;
    loadActDraft(token, id, actType).catch(() => {
      // ошибку покажем ниже через UI
    });
  }, [isNew, token, id, actType, loadActDraft]);

  // ФОЛЛБЕК ДОГРУЗКИ ЗАЯВКИ
  useEffect(() => {
    const hasData = invoiceFromStore || fetchedInvoice;
    if (!hasData && token && id && !invoiceLoading) {
      setInvoiceLoading(true);
      invoicesApi
        .fetchAll(token)
        .then((data) => {
          if (Array.isArray(data)) {
            const found = data.find((i: any) => String(i.id) === String(id));
            if (found) setFetchedInvoice(found);
          }
        })
        .finally(() => setInvoiceLoading(false));
    }
  }, [invoiceFromStore, fetchedInvoice, token, id, invoiceLoading]);

  const cleanInvoice = useMemo(() => {
    const raw = invoiceFromStore || fetchedInvoice;
    if (!raw) return null;
    return normalizeInvoice(raw);
  }, [invoiceFromStore, fetchedInvoice]);

  // ЛС из стора, чтобы вытащить пломбу (если есть)
  const lics = useLicsStore((s) => s.list);
  const licObj = useMemo(() => {
    const code = String(cleanInvoice?.lic || '').trim();
    if (!code) return null;
    return (
      lics.find((l: any) => String(l.code || l.account || l.lic || '').trim() === code) || null
    );
  }, [lics, cleanInvoice?.lic]);

  const sealFromLic = useMemo(() => {
    const counters = licObj?.counters || licObj?.meters || licObj?.counter || [];
    const first = Array.isArray(counters) ? counters[0] : null;
    const seal = first?.seal || first?.seal_number || licObj?.seal || '';
    return String(seal || '').trim();
  }, [licObj]);

  const technicianName = useMemo(() => {
    return String(user?.fullName || user?.name || '').trim();
  }, [user]);

  // initialData (NEW + EDIT)
  const initialData = useMemo(() => {
    // EDIT
    if (!isNew) {
      if (!currentAct || Object.keys(currentAct).length === 0) return null;

      const details = currentAct.details || {};
      return {
        ...currentAct,
        ...details,
        lic: currentAct.lic || details.lic || cleanInvoice?.lic || '',
        owner_name: currentAct.owner_name || details.owner_name || normalizeFio(cleanInvoice?.client_name) || '',
        owner_phone: currentAct.owner_phone || details.owner_phone || cleanInvoice?.phone || '',
        object_address:
          normalizeAddress(currentAct.object_address) ||
          normalizeAddress(details.object_address) ||
          normalizeAddress(cleanInvoice?.addressText) ||
          '',
        technician_name:
          currentAct.technician_name || details.technician_name || technicianName || '',
      };
    }

    // NEW
    const draft = currentAct; // после loadActDraft сюда приходит черновик с act_number
    if (!draft || Object.keys(draft).length === 0) return null;

    const d = draft.details || {};

    const merged: any = {
      ...draft,
      ...d,

      // ВАЖНО: номер — от сервера (черновик)
      act_number: draft.act_number || d.act_number || '',
      act_date: (draft.act_date || d.act_date || todayYmd()).toString().split('T')[0],
      type: actType,

      lic: draft.lic || d.lic || cleanInvoice?.lic || '',
      owner_name: draft.owner_name || d.owner_name || normalizeFio(cleanInvoice?.client_name) || '',
      owner_phone: draft.owner_phone || d.owner_phone || cleanInvoice?.phone || '',
      object_address:
        normalizeAddress(draft.object_address) ||
        normalizeAddress(d.object_address) ||
        normalizeAddress(cleanInvoice?.addressText) ||
        '',
      technician_name: draft.technician_name || d.technician_name || technicianName || '',
    };

    // Автоподстановка пломбы, если в форме есть нужные ключи и поле пустое
    if (sealFromLic) {
      if (template?.fields?.some((f) => f.key === 'seal_number') && !merged.seal_number) {
        merged.seal_number = sealFromLic;
      }
      if (template?.fields?.some((f) => f.key === 'removed_seal_number') && !merged.removed_seal_number) {
        merged.removed_seal_number = sealFromLic;
      }
    }

    return merged;
  }, [isNew, currentAct, cleanInvoice, actType, technicianName, sealFromLic, template]);

  const handleSave = async (data: any) => {
    if (!token) return;

    // ID берём от черновика (NEW) или из URL (EDIT)
    const realId = currentAct?.id || (!isNew ? actId : undefined);

    const payload = {
      ...data,
      invoice_id: id,
      type: actType,
      id: realId,
      // на всякий — details всегда полный объект формы
      details: data,
    };

    try {
      const savedAct = await saveAct(token, payload);
      if (savedAct && savedAct.id) {
        setShowToast(true);
        setCurrentAct(savedAct);

        // если это был NEW — переводим в edit-роут (чтобы дальше работало превью/pdf и т.п.)
        if (isNew) history.replace(`/app/invoices/${id}/acts/${savedAct.id}/edit`);
      } else {
        throw new Error('Не удалось сохранить (пустой ответ)');
      }
    } catch (e: any) {
      console.error('Save error:', e);
      setErrorAlert(e?.message || 'Ошибка сохранения. Проверьте заполнение полей.');
    }
  };

  const handlePreview = () => {
    const realId = currentAct?.id || (!isNew ? actId : null);
    if (!realId) {
      alert('Сначала сохраните акт');
      return;
    }
    history.push(`/app/invoices/${id}/acts/${realId}/pdf`);
  };

  // Спиннер: когда реально нет данных для формы
  const hasActForForm = !!initialData;
  const isLoading =
    (actLoading && !hasActForForm) ||
    (invoiceLoading && isNew && !cleanInvoice && !hasActForForm);

  if (!template) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref={`/app/invoices/${id}/acts`} />
            </IonButtons>
            <IonTitle>Тип акта не найден</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">Не удалось определить тип акта.</IonContent>
      </IonPage>
    );
  }

  if (isLoading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref={`/app/invoices/${id}/acts`} />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="ion-text-center ion-padding" style={{ marginTop: '50px' }}>
            <IonSpinner />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  // Если NEW и черновик не пришёл — покажем понятное сообщение + retry
  if (isNew && !hasActForForm) {
    return (
      <IonPage>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref={`/app/invoices/${id}/acts`} text="" color="dark" />
            </IonButtons>
            <IonTitle style={{ fontSize: '16px' }}>{template.name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding" style={{ '--background': '#f7fafc' }}>
          <div style={{ background: 'white', padding: '16px', borderRadius: '16px' }}>
            <b>Не удалось получить черновик акта.</b>
            <div style={{ marginTop: '8px', color: '#718096' }}>
              Сервер должен вернуть номер акта через <code>mp_get_act</code> с <code>act_type</code>.
            </div>
            <IonButton
              expand="block"
              style={{ marginTop: '14px' }}
              onClick={() => {
                if (!token) return;
                // разрешаем повторный запрос
                draftRequestedRef.current = false;
                loadActDraft(token, id, actType);
              }}
            >
              Повторить
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={`/app/invoices/${id}/acts`} text="" color="dark" />
          </IonButtons>
          <IonTitle style={{ fontSize: '16px' }}>{template.name}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handlePreview} color="primary">
              <IonIcon slot="icon-only" icon={eyeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ '--background': '#f7fafc' }}>
        <div style={{ padding: '16px' }}>
          <GenericForm
            // ключ, чтобы форма корректно reset-нулась при приходе draft/details
            key={String(currentAct?.id || initialData?.act_number || (isNew ? actType : actId) || 'form')}
            template={template}
            initialData={initialData || {}}
            onSave={handleSave}
          />
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Сохранено успешно"
          duration={2000}
          color="success"
          icon={checkmarkCircle}
        />
        <IonAlert
          isOpen={!!errorAlert}
          onDidDismiss={() => setErrorAlert(null)}
          header="Ошибка"
          message={errorAlert || ''}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};
