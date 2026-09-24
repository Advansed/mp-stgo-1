import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonButton,
  IonToast,
  IonModal,
  IonTextarea,
} from '@ionic/react';
import { add, documentTextOutline, createOutline, checkmarkDoneOutline, closeOutline } from 'ionicons/icons';
import { useActsStore } from '../../store/actsStore';
import { useAuthStore } from '../../store/authStore';
import { useInvoiceStore } from '../../store/invoiceStore';
import { invoicesApi } from '../../api/invoicesApi';
import { ACT_TEMPLATES } from '../../features/acts/configs/registry';
import './ActsListPage.css';

export const ActsListPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const token = useAuthStore((s) => s.token);
  const { list, loading, loadActs } = useActsStore();
  const loadInvoices = useInvoiceStore((s) => s.loadInvoices);

  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completeText, setCompleteText] = useState('');
  const [completing, setCompleting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const actTemplates = useMemo(() => {
    const allowed = new Set(['work_completed_to', 'work_completed']);
    const all = Object.values(ACT_TEMPLATES).filter((t) => allowed.has(t.type));
    return [
      ...['work_completed_to', 'work_completed']
        .map((type) => all.find((t) => t.type === type))
        .filter(Boolean),
    ] as typeof all;
  }, []);

  useEffect(() => {
    if (token && id) loadActs(token, id);
  }, [token, id, loadActs]);

  const openCompleteModal = () => {
    setCompleteText('');
    setShowCompleteModal(true);
  };

  const pickActType = (type: string) => {
    setShowTypePicker(false);
    history.push(`/app/invoices/${id}/acts/new/${type}`);
  };

  const handleComplete = async () => {
    if (!token || !id) return;
    const text = completeText.trim();
    if (!text) {
      setErrorToast('Введите текст завершения');
      return;
    }

    setCompleting(true);
    try {
      const res = await invoicesApi.completeInvoice(token, id, text);
      if (res.success) {
        setShowCompleteModal(false);
        setToastMessage('Заявка завершена');
        setShowToast(true);
        await loadInvoices(token);
        history.replace('/app/invoices');
      } else {
        setErrorToast(res.description || res.message || 'Не удалось завершить заявку');
      }
    } catch (e: any) {
      console.error(e);
      setErrorToast(e?.message || 'Ошибка при завершении заявки');
    } finally {
      setCompleting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="actsListToolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref={`/app/invoices/${id}`} text="" color="dark" />
          </IonButtons>
          <IonTitle>Документы</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ '--background': '#f7fafc' }}>
        <div className="actsListBody">
          {loading && (
            <div className="ion-text-center ion-padding">
              <IonSpinner />
            </div>
          )}

          {!loading && list.length === 0 && (
            <div className="actsListEmpty">
              <p>Актов пока нет.</p>
              <p>Нажмите "+", чтобы создать.</p>
            </div>
          )}

          <IonList style={{ background: 'transparent', padding: 0 }}>
            {list.map((act) => {
              const template = act.type ? ACT_TEMPLATES[act.type] : undefined;
              return (
                <IonItem
                  key={act.id ?? act.act_number}
                  button
                  className="actsCard"
                  onClick={() => history.push(`/app/invoices/${id}/acts/${act.id}/edit`)}
                  lines="none"
                  detail={false}
                >
                  <div className="actsCardIcon">
                    <IonIcon icon={documentTextOutline} size="small" />
                  </div>
                  <IonLabel>
                    <h2 className="actsCardTitle">{template?.name || act.type}</h2>
                    <p className="actsCardMeta">№ {act.act_number}</p>
                  </IonLabel>
                  <IonIcon icon={createOutline} slot="end" color="medium" style={{ opacity: 0.4 }} />
                </IonItem>
              );
            })}
          </IonList>
        </div>

        <IonFab vertical="bottom" horizontal="end" slot="fixed" style={{ marginBottom: '200px', marginRight: '16px' }}>
          <IonFabButton onClick={() => setShowTypePicker(true)} color="secondary">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonModal
          isOpen={showTypePicker}
          onDidDismiss={() => setShowTypePicker(false)}
          className="actsTypeModal"
        >
          <div className="actsTypeSheet">
            <div className="actsTypeSheet__header">
              <div>
                <div className="actsTypeSheet__title">Новый акт</div>
                <div className="actsTypeSheet__subtitle">Выберите тип документа</div>
              </div>
              <button
                type="button"
                className="actsTypeSheet__close"
                onClick={() => setShowTypePicker(false)}
                aria-label="Закрыть"
              >
                <IonIcon icon={closeOutline} />
              </button>
            </div>

            <IonContent className="actsTypeSheet__content" scrollY>
              <div className="actsTypeSheet__list">
                {actTemplates.map((tpl) => (
                  <button
                    key={tpl.type}
                    type="button"
                    className={`actsTypeSheet__item${
                      tpl.type === 'work_completed_to' || tpl.type === 'work_completed'
                        ? ' actsTypeSheet__item--accent'
                        : ''
                    }`}
                    onClick={() => pickActType(tpl.type)}
                  >
                    <span className="actsTypeSheet__item-icon">
                      <IonIcon icon={documentTextOutline} />
                    </span>
                    <span className="actsTypeSheet__item-text">{tpl.name}</span>
                  </button>
                ))}
              </div>
            </IonContent>
          </div>
        </IonModal>

        <IonModal isOpen={showCompleteModal} onDidDismiss={() => setShowCompleteModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Завершение заявки</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowCompleteModal(false)}>Отмена</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <p style={{ marginTop: 0, color: '#718096', fontSize: '14px' }}>
              Укажите текст завершения. Заявка будет переведена в статус «completed».
            </p>
            <IonTextarea
              autoGrow
              rows={4}
              value={completeText}
              placeholder="Текст завершения"
              onIonInput={(e) => setCompleteText(String(e.detail.value || ''))}
            />
            <IonButton
              expand="block"
              color="success"
              style={{ marginTop: '16px', '--border-radius': '14px', height: '52px', fontWeight: 'bold' }}
              disabled={completing || !completeText.trim()}
              onClick={handleComplete}
            >
              {completing ? <IonSpinner name="crescent" slot="start" /> : null}
              Завершить заявку
            </IonButton>
          </IonContent>
        </IonModal>

        <IonToast
          isOpen={showToast}
          message={toastMessage}
          duration={2000}
          color="success"
          onDidDismiss={() => setShowToast(false)}
        />
        <IonToast
          isOpen={!!errorToast}
          message={errorToast || ''}
          duration={2600}
          color="danger"
          onDidDismiss={() => setErrorToast(null)}
        />

        <div style={{ position: 'fixed', bottom: '120px', left: '16px', right: '16px', zIndex: 999 }}>
          <IonButton
            expand="block"
            color="success"
            disabled={completing || loading}
            onClick={openCompleteModal}
            style={{ height: '56px', fontWeight: 'bold', '--border-radius': '14px' }}
          >
            {completing ? <IonSpinner name="crescent" slot="start" /> : <IonIcon icon={checkmarkDoneOutline} slot="start" />}
            Завершить
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};
