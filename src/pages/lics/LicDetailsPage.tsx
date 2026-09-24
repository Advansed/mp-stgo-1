import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonSpinner,
  IonIcon,
} from '@ionic/react';
import {
  alertCircleOutline,
  buildOutline,
  chevronDownOutline,
  documentTextOutline,
  locationOutline,
  personOutline,
  walletOutline,
  waterOutline,
} from 'ionicons/icons';
import { useAuthStore } from '../../store/authStore';
import { useLicsStore } from '../../store/licsStore';
import { pickArray } from '../../domain/objects';
import { formatAddress, formatSum, getDebtStatus, getLicCode, getTotalDebt } from '../../utils/licsFormat';
import './LicDetailsPage.css';

type RouteParams = { code: string };

type SectionAccent = 'default' | 'debt' | 'counters' | 'agreements' | 'equipments';

const safeString = (value: any): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object') {
    const maybeAddr = formatAddress(value);
    if (maybeAddr) return maybeAddr;
    try {
      return JSON.stringify(value);
    } catch {
      return '';
    }
  }
  return '';
};

const formatDate = (dateString: any): string => {
  const s = safeString(dateString);
  if (!s) return '';
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString('ru-RU');
};

const isTruthyFlag = (value: any): boolean =>
  value === true || value === 'true' || value === 1 || value === '1' || value === 'Y' || value === 'y';

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
      'lic-section',
      accent !== 'default' ? `lic-section--${accent}` : '',
      collapsible ? 'lic-section--collapsible' : '',
      collapsible && !open ? 'lic-section--collapsed' : '',
    ]
      .filter(Boolean)
      .join(' ')}
  >
    <div
      className={`lic-section__header${collapsible ? ' lic-section__header--toggle' : ''}`}
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
      <div className="lic-section__header-main">
        <IonIcon icon={icon} className="lic-section__icon" />
        <div>
          <div className="lic-section__title">{title}</div>
          {subtitle && <div className="lic-section__subtitle">{subtitle}</div>}
        </div>
      </div>
      <div className="lic-section__header-aside">
        {aside}
        {collapsible && (
          <IonIcon
            icon={chevronDownOutline}
            className={`lic-section__chevron${open ? ' lic-section__chevron--open' : ''}`}
          />
        )}
      </div>
    </div>
    {(!collapsible || open) && children != null && (
      <div className="lic-section__body">{children}</div>
    )}
  </section>
);

const EmptyHint: React.FC<{ text?: string }> = ({ text = 'Не найдено' }) => (
  <div className="lic-section__empty">{text}</div>
);

export const LicDetailsPage: React.FC = () => {
  const params = useParams<RouteParams>();
  const token = useAuthStore((s) => s.token);
  const { list, byCode, fetchLics, fetchByCode, loading } = useLicsStore();
  const [infoOpen, setInfoOpen] = useState(false);
  const [debtOpen, setDebtOpen] = useState(false);
  const [countersOpen, setCountersOpen] = useState(false);
  const [agreementsOpen, setAgreementsOpen] = useState(false);
  const [equipmentsOpen, setEquipmentsOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const codeParam = useMemo(() => {
    const raw = params?.code ?? '';
    try {
      return decodeURIComponent(raw).trim();
    } catch {
      return String(raw).trim();
    }
  }, [params?.code]);

  const lic = useMemo(() => {
    if (codeParam && byCode[codeParam]) return byCode[codeParam];
    if (!Array.isArray(list)) return null;
    return list.find((x: any) => getLicCode(x) === codeParam) ?? null;
  }, [list, byCode, codeParam]);

  const hasTriedFetch = useRef(false);
  useEffect(() => {
    if (!token || !codeParam) return;
    if (lic) return;
    if (hasTriedFetch.current) return;

    hasTriedFetch.current = true;
    setDetailLoading(true);
    (async () => {
      try {
        await fetchLics(token);
        const afterList = useLicsStore.getState().list.find((x) => getLicCode(x) === codeParam);
        if (!afterList) {
          await fetchByCode(token, codeParam);
        } else if (!useLicsStore.getState().byCode[codeParam]) {
          await fetchByCode(token, codeParam);
        }
      } finally {
        setDetailLoading(false);
      }
    })();
  }, [token, lic, codeParam, fetchLics, fetchByCode]);

  if ((loading || detailLoading) && !lic) {
    return (
      <IonPage className="lic-details">
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/app/lics" />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center">
          <IonSpinner />
        </IonContent>
      </IonPage>
    );
  }

  if (!lic) {
    return (
      <IonPage className="lic-details">
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/app/lics" />
            </IonButtons>
            <IonTitle>Лицевой счет</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <div className="lic-details__empty">
            <IonIcon icon={alertCircleOutline} className="lic-details__empty-icon" />
            <p>Лицевой счет {codeParam || '—'} не найден</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const code = getLicCode(lic) || codeParam;
  const name = safeString(lic?.name ?? lic?.fio ?? lic?.owner) || 'Не указан';
  const plot = safeString(lic?.plot);
  const addressRaw = lic?.address_go ?? lic?.address;
  const address = formatAddress(addressRaw) || safeString(addressRaw) || 'Не указан';

  const debts = pickArray(lic, ['debts', 'debt', 'balances']);
  const counters = pickArray(lic, ['counters', 'meters', 'pu']);
  const agreements = pickArray(lic, ['agreements', 'agrees', 'contracts', 'dogs']);
  const equipments = pickArray(lic, ['equipments', 'equips', 'equipment', 'devices', 'vdgo']);

  const debtTotal = getTotalDebt(debts);
  const debtStatus = getDebtStatus(debts);
  const debtChipClass =
    debtStatus === 'positive'
      ? 'lic-chip lic-chip--danger'
      : debtStatus === 'negative'
        ? 'lic-chip lic-chip--success'
        : 'lic-chip lic-chip--muted';

  return (
    <IonPage className="lic-details">
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/lics" text="" color="dark" />
          </IonButtons>
          <IonTitle className="lic-details__title">ЛС {code}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen scrollY>
        <div className="lic-details__body">
          {/* Основная информация */}
          <Section
            title="Основная информация"
            subtitle={infoOpen ? name : 'Нажмите, чтобы раскрыть'}
            icon={personOutline}
            collapsible
            open={infoOpen}
            onToggle={() => setInfoOpen((v) => !v)}
            aside={
              code ? (
                <span className="lic-chip lic-chip--muted lic-section__badge">{code}</span>
              ) : undefined
            }
          >
            <div className="lic-row lic-row--compact">
              <div className="lic-row__main">
                <div className="lic-row__title lic-row__title--compact">Абонент</div>
                <div className="lic-row__meta">{name}</div>
              </div>
            </div>

            <div className="lic-row lic-row--compact">
              <div className="lic-row__main">
                <div className="lic-row__title lic-row__title--compact">Номер лицевого счета</div>
                <div className="lic-row__meta">{code || '—'}</div>
              </div>
            </div>

            {plot && (
              <div className="lic-row lic-row--compact">
                <div className="lic-row__main">
                  <div className="lic-row__title lic-row__title--compact">Участок</div>
                  <div className="lic-row__meta">{plot}</div>
                </div>
              </div>
            )}

            <div className="lic-row lic-row--compact">
              <div className="lic-row__main">
                <div className="lic-row__title lic-row__title--compact">
                  <IonIcon icon={locationOutline} className="lic-row__inline-icon" />
                  Адрес
                </div>
                <div className="lic-row__meta">{address}</div>
              </div>
            </div>
          </Section>

          {/* Задолженность */}
          <Section
            title="Задолженность"
            subtitle={debtOpen ? 'Статьи задолженности' : 'Нажмите, чтобы раскрыть'}
            icon={walletOutline}
            accent="debt"
            collapsible
            open={debtOpen}
            onToggle={() => setDebtOpen((v) => !v)}
            aside={<span className={`${debtChipClass} lic-section__badge`}>{formatSum(debtTotal)}</span>}
          >
            {debts.length === 0 ? (
              <EmptyHint />
            ) : (
              debts.map((d: any, i: number) => {
                const label = safeString(d?.label ?? d?.type ?? d?.name ?? d?.service) || 'Услуга';
                const period = safeString(d?.period ?? d?.month ?? d?.date);
                const sum = d?.sum ?? d?.amount ?? d?.debt ?? 0;

                return (
                  <div className="lic-row lic-row--compact" key={i}>
                    <div className="lic-row__main">
                      <div className="lic-row__title lic-row__title--compact">{label}</div>
                      {period && <div className="lic-row__meta">{period}</div>}
                    </div>
                    <div className="lic-row__aside">
                      <span className="lic-row__value">{formatSum(sum)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </Section>

          {/* Приборы учета */}
          <Section
            title="Приборы учета"
            subtitle={countersOpen ? `${counters.length || 'нет'}` : 'Нажмите, чтобы раскрыть'}
            icon={waterOutline}
            accent="counters"
            collapsible
            open={countersOpen}
            onToggle={() => setCountersOpen((v) => !v)}
            aside={
              counters.length > 0 ? (
                <span className="lic-chip lic-chip--muted lic-section__badge">{counters.length}</span>
              ) : undefined
            }
          >
            {counters.length === 0 ? (
              <EmptyHint />
            ) : (
              counters.map((c: any, i: number) => {
                const cCode = safeString(c?.code ?? c?.number ?? c?.counter);
                const cTip = safeString(c?.tip ?? c?.type);
                const cName = safeString(c?.name ?? c?.title) || 'Счетчик';
                const seal = safeString(c?.seal);
                const sealDate = formatDate(c?.seal_date ?? c?.sealDate);
                const indice = safeString(c?.indice ?? c?.value ?? c?.indication);
                const period = safeString(c?.period ?? c?.date);

                return (
                  <div className="lic-row lic-row--compact" key={i}>
                    <div className="lic-row__main">
                      <div className="lic-row__title lic-row__title--compact">{cName}</div>
                      <div className="lic-row__meta">
                        {cTip ? `${cTip} · ` : ''}
                        {cCode ? `№ ${cCode}` : '№ не указан'}
                      </div>
                      {(seal || sealDate) && (
                        <div className="lic-row__meta">
                          Пломба: {seal || '—'}
                          {sealDate ? ` (${sealDate})` : ''}
                        </div>
                      )}
                      {period && <div className="lic-row__meta">Период: {period}</div>}
                    </div>
                    {indice && (
                      <div className="lic-row__aside">
                        <span className="lic-row__value">{indice}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </Section>

          {/* Договоры */}
          <Section
            title="Договоры"
            subtitle={agreementsOpen ? `${agreements.length || 'нет'}` : 'Нажмите, чтобы раскрыть'}
            icon={documentTextOutline}
            accent="agreements"
            collapsible
            open={agreementsOpen}
            onToggle={() => setAgreementsOpen((v) => !v)}
            aside={
              agreements.length > 0 ? (
                <span className="lic-chip lic-chip--muted lic-section__badge">{agreements.length}</span>
              ) : undefined
            }
          >
            {agreements.length === 0 ? (
              <EmptyHint text="Договоры не найдены" />
            ) : (
              agreements.map((a: any, i: number) => {
                const aName = safeString(a?.name ?? a?.title ?? a?.type) || 'Договор';
                const aStatus = safeString(a?.status ?? a?.state);
                const aNumber = safeString(a?.number ?? a?.num ?? a?.code);
                const beginDate = formatDate(a?.begin_date ?? a?.beginDate ?? a?.date_begin ?? a?.start);
                const endDate = formatDate(a?.end_date ?? a?.endDate ?? a?.date_end ?? a?.finish);
                const service = safeString(a?.service ?? a?.usluga ?? a?.kind);

                return (
                  <div className="lic-row lic-row--compact" key={a?.id ?? aNumber ?? i}>
                    <div className="lic-row__main">
                      <div className="lic-row__title lic-row__title--compact">
                        {aName}
                        {aStatus && <span className="lic-chip">{aStatus}</span>}
                      </div>
                      <div className="lic-row__meta">
                        {aNumber ? `№ ${aNumber}` : '№ не указан'}
                        {service ? ` · ${service}` : ''}
                      </div>
                      <div className="lic-row__meta">
                        {beginDate ? `с ${beginDate}` : 'дата начала: не указана'}
                        {endDate ? ` по ${endDate}` : ''}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </Section>

          {/* Оборудование */}
          <Section
            title="Оборудование"
            subtitle={equipmentsOpen ? `${equipments.length || 'нет'}` : 'Нажмите, чтобы раскрыть'}
            icon={buildOutline}
            accent="equipments"
            collapsible
            open={equipmentsOpen}
            onToggle={() => setEquipmentsOpen((v) => !v)}
            aside={
              equipments.length > 0 ? (
                <span className="lic-chip lic-chip--muted lic-section__badge">{equipments.length}</span>
              ) : undefined
            }
          >
            {equipments.length === 0 ? (
              <EmptyHint text="Оборудование не найдено" />
            ) : (
              equipments.map((e: any, i: number) => {
                const tip = safeString(e?.tip ?? e?.type ?? e?.kind);
                const eName = safeString(e?.name ?? e?.title ?? e?.model) || 'Оборудование';
                const number = safeString(e?.number ?? e?.num ?? e?.serial ?? e?.code);
                const brand = safeString(e?.brand ?? e?.mark ?? e?.manufacturer);
                const place = safeString(
                  e?.place ?? e?.location ?? e?.room ?? e?.position
                );
                const year = safeString(e?.year ?? e?.year_made ?? e?.manufacture_year);
                const isActive = isTruthyFlag(e?.active ?? e?.is_active ?? e?.enabled);

                return (
                  <div className="lic-row lic-row--compact" key={e?.id ?? number ?? i}>
                    <div className="lic-row__main">
                      <div className="lic-row__title lic-row__title--compact">
                        {eName}
                        <span className={`lic-chip ${isActive ? 'lic-chip--success' : 'lic-chip--muted'}`}>
                          {isActive ? 'активно' : 'не активно'}
                        </span>
                      </div>
                      <div className="lic-row__meta">
                        {tip ? `${tip} · ` : ''}
                        {number ? `№ ${number}` : '№ не указан'}
                      </div>
                      {(brand || year) && (
                        <div className="lic-row__meta">
                          {[brand, year && `г.в. ${year}`].filter(Boolean).join(' · ')}
                        </div>
                      )}
                      {place && <div className="lic-row__meta">Место: {place}</div>}
                    </div>
                  </div>
                );
              })
            )}
          </Section>
        </div>
      </IonContent>
    </IonPage>
  );
};
