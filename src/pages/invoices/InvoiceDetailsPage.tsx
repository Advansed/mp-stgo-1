import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonIcon,
  IonButton,
  IonSpinner,
  IonToast,
} from '@ionic/react';
import {
  locationOutline,
  callOutline,
  documentTextOutline,
  arrowForwardOutline,
  personOutline,
  timeOutline,
  createOutline,
  mapOutline,
  alertCircleOutline,
  chevronDownOutline,
  walletOutline,
  listOutline,
  playOutline,
  pauseOutline,
  checkmarkDoneOutline,
} from 'ionicons/icons';
import { useInvoiceStore } from '../../store/invoiceStore';
import { useAuthStore } from '../../store/authStore';
import { useLicsStore } from '../../store/licsStore';
import { getLicCode } from '../../utils/licsFormat';
import {
  formatSum,
  getLicDisplay,
  getWorkSubtitle,
  getWorkTitle,
  LicDebtRows,
  pickWorks,
  WorkDetailRows,
} from './InvoiceLicBlock';
import './InvoiceDetailsPage.css';

type SectionAccent = 'default' | 'address' | 'task' | 'debt' | 'work';

const STATUS_ASSIGNED = 'Назначен';
const STATUS_IN_PROGRESS = 'В работе';
const STATUS_POSTPONED = 'Отложено';
const STATUS_DONE = 'Завершено';

type StatusKind = 'assigned' | 'in_progress' | 'postponed' | 'done' | 'other';

function getStatusKind(status: string): StatusKind {
  const s = (status || '').toLowerCase();
  if (s.includes('назнач')) return 'assigned';
  if (s.includes('в работе') || s.includes('в_работе') || s === 'in progress' || s === 'in_progress') {
    return 'in_progress';
  }
  if (s.includes('отлож')) return 'postponed';
  if (s.includes('завершен') || s.includes('выполнен') || s.includes('completed') || s.includes('закрыт')) {
    return 'done';
  }
  return 'other';
}

const Section: React.FC<{
  title: string;
  subtitle?: string;
  icon: string;
  accent?: SectionAccent;
  aside?: React.ReactNode;
  children?: React.ReactNode;
  collapsible?: boolean;
  open?: boolean;
  onToggle?: () => void;
}> = ({
  title,
  subtitle,
  icon,
  accent = 'default',
  aside,
  children,
  collapsible = false,
  open = true,
  onToggle,
}) => (
  <section
    className={[
      'inv-section',
      accent !== 'default' ? `inv-section--${accent}` : '',
      collapsible ? 'inv-section--collapsible' : '',
      collapsible && !open ? 'inv-section--collapsed' : '',
    ]
      .filter(Boolean)
      .join(' ')}
  >
    <div
      className={`inv-section__header${collapsible ? ' inv-section__header--toggle' : ''}`}
      onClick={collapsible ? onToggle : undefined}
      role={collapsible ? 'button' : undefined}
      tabIndex={collapsible ? 0 : undefined}
      onKeyDown={
        collapsible
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onToggle?.();
              }
            }
          : undefined
      }
    >
      <div className="inv-section__header-main">
        <IonIcon icon={icon} className="inv-section__icon" />
        <div>
          <div className="inv-section__title">{title}</div>
          {subtitle && <div className="inv-section__subtitle">{subtitle}</div>}
        </div>
      </div>
      <div className="inv-section__header-aside">
        {aside}
        {collapsible && (
          <IonIcon
            icon={chevronDownOutline}
            className={`inv-section__chevron${open ? ' inv-section__chevron--open' : ''}`}
          />
        )}
      </div>
    </div>
    {(!collapsible || open) && children != null && (
      <div className="inv-section__body">{children}</div>
    )}
  </section>
);

export const InvoiceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const token = useAuthStore((s) => s.token);
  const { list, loading, loadInvoices, setInvoiceStatus } = useInvoiceStore();
  const addLicToUser = useLicsStore((s) => s.addLicToUser);
  const fetchLicByCode = useLicsStore((s) => s.fetchByCode);
  const fetchLics = useLicsStore((s) => s.fetchLics);
  const licByCode = useLicsStore((s) => s.byCode);
  const licList = useLicsStore((s) => s.list);

  const invoice = useMemo(() => list.find((i) => i.id === id), [list, id]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [addingLic, setAddingLic] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [clientOpen, setClientOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [debtOpen, setDebtOpen] = useState(false);
  const [worksOpen, setWorksOpen] = useState<Record<number, boolean>>({});
  const [licDetailsLoading, setLicDetailsLoading] = useState(false);
  const [licDetailsError, setLicDetailsError] = useState<string | null>(null);
  const licFetchAttemptedRef = useRef<string | null>(null);

  const licCode = String(invoice?.lic || '').trim();
  const hasLic = Boolean(licCode) && licCode.toLowerCase() !== 'нет';
  const licDetails = hasLic
    ? licByCode[licCode] ?? licList.find((l) => getLicCode(l) === licCode) ?? null
    : null;

  const works = useMemo(() => {
    if (!invoice) return [] as unknown[];
    const fromInvoice = pickWorks(invoice);
    if (fromInvoice.length) return fromInvoice;
    return pickWorks(licDetails);
  }, [invoice, licDetails]);

  useEffect(() => {
    if (!invoice && token) {
      loadInvoices(token);
    }
  }, [invoice, token, loadInvoices]);

  useEffect(() => {
    if (!token || !hasLic) return;
    if (licDetails) return;
    if (licFetchAttemptedRef.current === licCode) return;
    licFetchAttemptedRef.current = licCode;

    setLicDetailsLoading(true);
    setLicDetailsError(null);
    fetchLicByCode(token, licCode).then((lic) => {
      if (!lic) setLicDetailsError('Не удалось загрузить данные лицевого счёта');
    })
      .finally(() => setLicDetailsLoading(false));
  }, [token, hasLic, licCode, licDetails, fetchLicByCode]);

  if (loading && !invoice) {
    return (
      <IonPage className="inv-details">
        <IonHeader className="ion-no-border">
          <IonToolbar className="inv-details__toolbar">
            <IonTitle>Загрузка...</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center">
          <IonSpinner />
        </IonContent>
      </IonPage>
    );
  }

  if (!invoice) {
    return (
      <IonPage className="inv-details">
        <IonHeader className="ion-no-border">
          <IonToolbar className="inv-details__toolbar">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/app/invoices" />
            </IonButtons>
            <IonTitle>Заявка</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="inv-details__empty">
            <IonIcon icon={alertCircleOutline} className="inv-details__empty-icon" />
            <p>Заявка не найдена</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const clientName = invoice.client_name || invoice.applicant || 'Не указан';
  const licView = getLicDisplay(licDetails, licCode);
  const licLabel = hasLic ? licCode : 'Нет';
  const address = invoice.addressText || 'Адрес не указан';
  const service = invoice.service || 'Нет описания';
  const status = invoice.status || STATUS_ASSIGNED;
  const statusKind = getStatusKind(status);
  const isDone = statusKind === 'done';
  const dateLabel = invoice.date
    ? new Date(invoice.date).toLocaleDateString('ru-RU')
    : '';

  const handleSetStatus = async (nextStatus: string) => {
    if (!token || !id || statusSaving) return;
    setStatusSaving(true);
    try {
      const result = await setInvoiceStatus(token, id, nextStatus, nextStatus);
      if (!result.success) {
        setToastMessage(result.message || 'Не удалось изменить статус');
        setShowToast(true);
        return;
      }
      setToastMessage(`Статус: ${nextStatus}`);
      setShowToast(true);
    } finally {
      setStatusSaving(false);
    }
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (invoice.phone) window.location.href = `tel:${invoice.phone}`;
    else {
      setToastMessage('Номер телефона не указан в заявке');
      setShowToast(true);
    }
  };

  const handleMap = (e: React.MouseEvent) => {
    e.stopPropagation();
    const query = encodeURIComponent(invoice.addressText || '');
    window.open(`yandexmaps://maps.yandex.ru/?text=${query}`, '_system');
  };

  const handleEditAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    history.push(`/app/invoices/${id}/address`);
  };

  const handleOpenLic = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token || !hasLic || addingLic) return;

    setAddingLic(true);
    try {
      // Список «моих» ЛС мог ещё не быть загружен
      if (!useLicsStore.getState().list.length) {
        await fetchLics(token);
      }

      const alreadyAdded = useLicsStore
        .getState()
        .list.some((l) => getLicCode(l) === licCode);

      if (!alreadyAdded) {
        const payload = {
          code: licCode,
          account: licCode,
          lic: licCode,
          fio: clientName,
          name: clientName,
          address: invoice.addressText,
          address_go: invoice.addressText,
        };
        const result = await addLicToUser(token, payload);
        if (!result.success) {
          setToastMessage(result.message || 'Не удалось добавить лицевой счёт');
          setShowToast(true);
          return;
        }
      }

      await fetchLicByCode(token, licCode);
      history.push(`/app/lics/${encodeURIComponent(licCode)}`);
    } finally {
      setAddingLic(false);
    }
  };

  return (
    <IonPage className="inv-details">
      <IonHeader className="ion-no-border">
        <IonToolbar className="inv-details__toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/invoices" text="" color="dark" />
          </IonButtons>
          <IonTitle className="inv-details__title">Заявка № {invoice.number}</IonTitle>
          <IonButtons slot="end">
            <span className={`inv-chip ${isDone ? 'inv-chip--success' : 'inv-chip--warning'}`}>
              {status}
            </span>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen scrollY>
        <div className="inv-details__body">
          {/* Абонент */}
          <Section
            title="Абонент"
            subtitle={clientOpen ? clientName : 'Нажмите, чтобы раскрыть'}
            icon={personOutline}
            collapsible
            open={clientOpen}
            onToggle={() => setClientOpen((v) => !v)}
          >
            <div className="inv-row">
              <div className="inv-row__main">
                <div className="inv-row__title">ФИО</div>
                <div className="inv-row__meta">{clientName}</div>
              </div>
            </div>

            <div
              className={`inv-row${hasLic ? ' inv-row--clickable' : ''}`}
              onClick={hasLic ? handleOpenLic : undefined}
              role={hasLic ? 'button' : undefined}
              tabIndex={hasLic ? 0 : undefined}
              onKeyDown={
                hasLic
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleOpenLic(e as unknown as React.MouseEvent);
                      }
                    }
                  : undefined
              }
            >
              <div className="inv-row__main">
                <div className="inv-row__title">Лицевой счет</div>
                <div className={`inv-row__meta${hasLic ? ' inv-lic-link' : ''}`}>
                  {addingLic ? 'Добавление…' : licLabel}
                </div>
              </div>
              <div className="inv-row__aside">
                {addingLic ? (
                  <IonSpinner name="crescent" />
                ) : hasLic ? (
                  <IonIcon icon={arrowForwardOutline} className="inv-row__inline-icon" />
                ) : null}
              </div>
            </div>

            {invoice.phone && (
              <div className="inv-row">
                <div className="inv-row__main">
                  <div className="inv-row__title">Телефон</div>
                  <div className="inv-row__meta">{invoice.phone}</div>
                </div>
              </div>
            )}

            <div className="inv-section__actions">
              <IonButton expand="block" fill="outline" onClick={handleCall}>
                <IonIcon icon={callOutline} slot="start" />
                Позвонить
              </IonButton>
            </div>
          </Section>

          {hasLic && (
            <>
              <Section
                title="Задолженность"
                subtitle={debtOpen ? 'Статьи задолженности' : 'Нажмите, чтобы раскрыть'}
                icon={walletOutline}
                accent="debt"
                collapsible
                open={debtOpen}
                onToggle={() => setDebtOpen((v) => !v)}
                aside={
                  licDetailsLoading && !licView ? (
                    <IonSpinner name="crescent" />
                  ) : licView ? (
                    <span className={licView.debtChip}>{formatSum(licView.debtTotal)}</span>
                  ) : undefined
                }
              >
                {licDetailsError && !licView ? (
                  <div className="inv-lic-status inv-lic-status--error">{licDetailsError}</div>
                ) : (
                  <LicDebtRows debts={licView?.debts ?? []} />
                )}
              </Section>
            </>
          )}

          {works.map((work, index) => {
            const title = getWorkTitle(work, index);
            const open = !!worksOpen[index];
            const workId =
              work && typeof work === 'object' && 'id' in work
                ? String((work as { id?: unknown }).id ?? index)
                : String(index);
            return (
              <Section
                key={`work-${workId}-${index}`}
                title={title}
                subtitle={open ? getWorkSubtitle(work) || 'Детали' : 'Нажмите, чтобы раскрыть'}
                icon={listOutline}
                accent="work"
                collapsible
                open={open}
                onToggle={() => setWorksOpen((prev) => ({ ...prev, [index]: !prev[index] }))}
                aside={<span className="inv-chip inv-chip--muted">{index + 1}</span>}
              >
                <WorkDetailRows work={work} />
              </Section>
            );
          })}

          {/* Адрес */}
          <Section
            title="Адрес объекта"
            subtitle={addressOpen ? address : 'Нажмите, чтобы раскрыть'}
            icon={locationOutline}
            accent="address"
            collapsible
            open={addressOpen}
            onToggle={() => setAddressOpen((v) => !v)}
          >
            <div className="inv-row">
              <div className="inv-row__main">
                <div className="inv-row__title">
                  <IonIcon icon={locationOutline} className="inv-row__inline-icon" />
                  Адрес
                </div>
                <div className="inv-row__meta">{address}</div>
              </div>
              <div className="inv-row__aside">
                <IonButton fill="clear" size="small" onClick={handleEditAddress}>
                  <IonIcon slot="icon-only" icon={createOutline} />
                </IonButton>
              </div>
            </div>

            <div className="inv-section__actions">
              <IonButton expand="block" fill="outline" color="secondary" onClick={handleMap}>
                <IonIcon icon={mapOutline} slot="start" />
                Показать на карте
              </IonButton>
            </div>
          </Section>

          {/* Задача */}
          <Section
            title="Описание задачи"
            subtitle={taskOpen ? (dateLabel || 'Задача') : 'Нажмите, чтобы раскрыть'}
            icon={documentTextOutline}
            accent="task"
            collapsible
            open={taskOpen}
            onToggle={() => setTaskOpen((v) => !v)}
            aside={
              dateLabel ? (
                <span className="inv-chip inv-chip--muted">{dateLabel}</span>
              ) : undefined
            }
          >
            <div className="inv-row">
              <div className="inv-row__main">
                <div className="inv-row__title">Услуга / задача</div>
                <div className="inv-row__meta">{service}</div>
              </div>
            </div>

            {dateLabel && (
              <div className="inv-row">
                <div className="inv-row__main">
                  <div className="inv-row__title">
                    <IonIcon icon={timeOutline} className="inv-row__inline-icon" />
                    Дата
                  </div>
                  <div className="inv-row__meta">{dateLabel}</div>
                </div>
              </div>
            )}
          </Section>
        </div>

        <IonToast
          isOpen={showToast}
          message={toastMessage}
          duration={2500}
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>

      <div className="inv-details__fab-bar">
        <div className="inv-details__status-actions">
          {(statusKind === 'assigned' || statusKind === 'other') && (
            <>
              <IonButton
                expand="block"
                fill="outline"
                color="primary"
                className="inv-details__status-btn"
                disabled={statusSaving}
                onClick={() => handleSetStatus(STATUS_IN_PROGRESS)}
              >
                {statusSaving ? (
                  <IonSpinner name="crescent" slot="start" />
                ) : (
                  <IonIcon icon={playOutline} slot="start" />
                )}
                Взять в работу
              </IonButton>
              <IonButton
                expand="block"
                fill="outline"
                color="warning"
                className="inv-details__status-btn"
                disabled={statusSaving}
                onClick={() => handleSetStatus(STATUS_POSTPONED)}
              >
                {statusSaving ? (
                  <IonSpinner name="crescent" slot="start" />
                ) : (
                  <IonIcon icon={pauseOutline} slot="start" />
                )}
                Отложить
              </IonButton>
            </>
          )}

          {statusKind === 'in_progress' && (
            <>
              <IonButton
                expand="block"
                fill="outline"
                color="warning"
                className="inv-details__status-btn"
                disabled={statusSaving}
                onClick={() => handleSetStatus(STATUS_POSTPONED)}
              >
                {statusSaving ? (
                  <IonSpinner name="crescent" slot="start" />
                ) : (
                  <IonIcon icon={pauseOutline} slot="start" />
                )}
                Отложить
              </IonButton>
              <IonButton
                expand="block"
                fill="solid"
                color="success"
                className="inv-details__status-btn"
                disabled={statusSaving}
                onClick={() => handleSetStatus(STATUS_DONE)}
              >
                {statusSaving ? (
                  <IonSpinner name="crescent" slot="start" />
                ) : (
                  <IonIcon icon={checkmarkDoneOutline} slot="start" />
                )}
                Завершить
              </IonButton>
            </>
          )}

          {(statusKind === 'postponed' || statusKind === 'done') && (
            <IonButton
              expand="block"
              fill="outline"
              color="primary"
              className="inv-details__status-btn inv-details__status-btn--full"
              disabled={statusSaving}
              onClick={() => handleSetStatus(STATUS_IN_PROGRESS)}
            >
              {statusSaving ? (
                <IonSpinner name="crescent" slot="start" />
              ) : (
                <IonIcon icon={playOutline} slot="start" />
              )}
              Вернуть в работу
            </IonButton>
          )}
        </div>

        <IonButton expand="block" onClick={() => history.push(`/app/invoices/${id}/acts`)}>
          Перейти к актам
          <IonIcon slot="end" icon={arrowForwardOutline} />
        </IonButton>
      </div>
    </IonPage>
  );
};
