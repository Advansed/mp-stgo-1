import React, { useEffect, useMemo, useRef } from 'react';
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
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonIcon,
} from '@ionic/react';
import {
  alertCircleOutline,
  buildOutline,
  documentTextOutline,
  locationOutline,
  personOutline,
  walletOutline,
  waterOutline,
} from 'ionicons/icons';
import { useAuthStore } from '../../store/authStore';
import { useLicsStore } from '../../store/licsStore';
import { formatAddress, formatSum, getDebtStatus, getTotalDebt } from '../../utils/licsFormat';

type RouteParams = { code: string };

const getLicCode = (lic: any): string =>
  String(lic?.code ?? lic?.account ?? lic?.lic ?? '').trim();

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
  if (!s) return 'не указано';
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString('ru-RU');
};

export const LicDetailsPage: React.FC = () => {
  const params = useParams<RouteParams>();
  const token = useAuthStore((s) => s.token);
  const { list, fetchLics, loading } = useLicsStore();

  const codeParam = useMemo(() => {
    const raw = params?.code ?? '';
    try {
      return decodeURIComponent(raw).trim();
    } catch {
      return String(raw).trim();
    }
  }, [params?.code]);

  const lic = useMemo(() => {
    if (!Array.isArray(list)) return null;
    return list.find((x: any) => getLicCode(x) === codeParam) ?? null;
  }, [list, codeParam]);

  const hasTriedFetch = useRef(false);
  useEffect(() => {
    if (!token) return;
    if (lic) return;
    if (hasTriedFetch.current) return;

    hasTriedFetch.current = true;
    fetchLics(token);
  }, [token, lic, fetchLics]);

  if ((loading && !lic) || (!lic && token && !hasTriedFetch.current)) {
    return (
      <IonPage>
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
      <IonPage>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/app/lics" />
            </IonButtons>
            <IonTitle>Лицевой счет</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding ion-text-center">
          <IonIcon icon={alertCircleOutline} style={{ fontSize: 64, color: '#ccc' }} />
          <p>Лицевой счет {codeParam || '—'} не найден</p>
        </IonContent>
      </IonPage>
    );
  }

  // НОРМАЛИЗАЦИЯ (под old + новые варианты полей)
  const code = getLicCode(lic) || codeParam;
  const name = safeString(lic?.name ?? lic?.fio ?? lic?.owner) || 'Не указан';
  const plot = safeString(lic?.plot);
  const addressRaw = lic?.address_go ?? lic?.address;
  const address = formatAddress(addressRaw) || safeString(addressRaw) || 'Не указан';

  const debtsRaw = Array.isArray(lic?.debts) ? lic.debts : [];
  const countersRaw = Array.isArray(lic?.counters) ? lic.counters : [];
  const agreesRaw = Array.isArray(lic?.agrees) ? lic.agrees : [];
  const equipsRaw = Array.isArray(lic?.equips) ? lic.equips : [];

  const debtTotal = getTotalDebt(debtsRaw);
  const debtStatus = getDebtStatus(debtsRaw);
  const debtBadgeColor = debtStatus === 'positive' ? 'danger' : debtStatus === 'negative' ? 'success' : 'medium';

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/lics" text="" color="dark" />
          </IonButtons>
          <IonTitle>Лицевой счет {code}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ '--background': '#f7fafc' } as any}>
        {/* ОСНОВНАЯ ИНФОРМАЦИЯ */}
        <IonCard style={{ margin: '16px', borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <IonCardHeader>
            <IonCardSubtitle>Основная информация</IonCardSubtitle>
            <IonCardTitle style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <IonIcon icon={personOutline} />
              {name}
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList lines="none">
              <IonItem>
                <IonLabel>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>Номер лицевого счета</div>
                  <div style={{ fontWeight: 700 }}>{code || '—'}</div>
                </IonLabel>
              </IonItem>

              {plot && (
                <IonItem>
                  <IonLabel>
                    <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>Участок</div>
                    <div>{plot}</div>
                  </IonLabel>
                </IonItem>
              )}

              <IonItem>
                <IonIcon icon={locationOutline} slot="start" style={{ color: '#6b7280' }} />
                <IonLabel>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>Адрес</div>
                  <div style={{ lineHeight: 1.4 }}>{address}</div>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* ЗАДОЛЖЕННОСТЬ */}
        <IonCard style={{ margin: '0 16px 16px', borderRadius: 20 }}>
          <IonCardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <IonIcon icon={walletOutline} />
              <div>
                <IonCardTitle style={{ fontSize: 16 }}>Задолженность</IonCardTitle>
                <IonCardSubtitle>Общая сумма</IonCardSubtitle>
              </div>
            </div>

            <IonBadge color={debtBadgeColor} style={{ padding: '8px 10px', borderRadius: 12, fontSize: 14 }}>
              {formatSum(debtTotal)}
            </IonBadge>
          </IonCardHeader>

          <IonCardContent>
            <IonList lines="none">
              {debtsRaw.length === 0 && (
                <IonItem>
                  <IonLabel color="medium">Не найдено</IonLabel>
                </IonItem>
              )}

              {debtsRaw.map((d: any, i: number) => {
                const label = safeString(d?.label ?? d?.type ?? d?.name ?? d?.service) || 'Услуга';
                const period = safeString(d?.period ?? d?.month ?? d?.date);
                const sum = d?.sum ?? d?.amount ?? d?.debt ?? 0;

                return (
                  <IonItem key={i}>
                    <IonLabel>
                      <div style={{ fontWeight: 600 }}>{label}</div>
                      {period && <div style={{ fontSize: 12, color: '#6b7280' }}>{period}</div>}
                    </IonLabel>
                    <IonBadge slot="end" color="light">
                      {formatSum(sum)}
                    </IonBadge>
                  </IonItem>
                );
              })}
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* ПРИБОРЫ УЧЕТА */}
        <IonCard style={{ margin: '0 16px 16px', borderRadius: 20 }}>
          <IonCardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <IonIcon icon={waterOutline} />
            <div>
              <IonCardTitle style={{ fontSize: 16 }}>Приборы учета</IonCardTitle>
              <IonCardSubtitle>Счетчики</IonCardSubtitle>
            </div>
          </IonCardHeader>

          <IonCardContent>
            <IonList lines="none">
              {countersRaw.length === 0 && (
                <IonItem>
                  <IonLabel color="medium">Не найдено</IonLabel>
                </IonItem>
              )}

              {countersRaw.map((c: any, i: number) => {
                const cCode = safeString(c?.code ?? c?.number ?? c?.counter);
                const cTip = safeString(c?.tip ?? c?.type);
                const cName = safeString(c?.name ?? c?.title) || 'Счетчик';
                const seal = safeString(c?.seal);
                const sealDate = safeString(c?.seal_date ?? c?.sealDate);
                const indice = safeString(c?.indice ?? c?.value ?? c?.indication);
                const period = safeString(c?.period ?? c?.date);

                return (
                  <IonItem key={i}>
                    <IonLabel>
                      <div style={{ fontWeight: 700 }}>{cName}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>
                        {cTip && <span>{cTip} · </span>}
                        {cCode ? `№ ${cCode}` : '№ не указан'}
                      </div>
                      {(seal || sealDate) && (
                        <div style={{ fontSize: 12, color: '#6b7280' }}>
                          Пломба: {seal || '—'}{sealDate ? ` (${formatDate(sealDate)})` : ''}
                        </div>
                      )}
                      {period && <div style={{ fontSize: 12, color: '#6b7280' }}>Период: {period}</div>}
                    </IonLabel>

                    {indice && (
                      <IonBadge slot="end" color="light">
                        {indice}
                      </IonBadge>
                    )}
                  </IonItem>
                );
              })}
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* ДОГОВОР */}
        <IonCard style={{ margin: '0 16px 16px', borderRadius: 20 }}>
          <IonCardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <IonIcon icon={documentTextOutline} />
            <div>
              <IonCardTitle style={{ fontSize: 16 }}>Договор</IonCardTitle>
              <IonCardSubtitle>Данные договоров</IonCardSubtitle>
            </div>
          </IonCardHeader>

          <IonCardContent>
            <IonList lines="none">
              {agreesRaw.length === 0 && (
                <IonItem>
                  <IonLabel color="medium">Не найдено</IonLabel>
                </IonItem>
              )}

              {agreesRaw.map((a: any, i: number) => {
                const aName = safeString(a?.name) || 'Договор';
                const aStatus = safeString(a?.status);
                const aNumber = safeString(a?.number);
                const beginDate = formatDate(a?.begin_date);
                const endDate = formatDate(a?.end_date);

                return (
                  <IonItem key={i}>
                    <IonLabel>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ fontWeight: 700 }}>{aName}</div>
                        {aStatus && <IonBadge color="medium">{aStatus}</IonBadge>}
                      </div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>
                        {aNumber ? `№ ${aNumber}` : '№ не указан'}
                      </div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>
                        {beginDate !== 'не указано' ? `с ${beginDate}` : 'дата начала: не указано'}
                        {endDate !== 'не указано' ? ` по ${endDate}` : ''}
                      </div>
                    </IonLabel>
                  </IonItem>
                );
              })}
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* ГАЗОВОЕ ОБОРУДОВАНИЕ */}
        <IonCard style={{ margin: '0 16px 90px', borderRadius: 20 }}>
          <IonCardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <IonIcon icon={buildOutline} />
            <div>
              <IonCardTitle style={{ fontSize: 16 }}>Газовое оборудование</IonCardTitle>
              <IonCardSubtitle>Оборудование по ЛС</IonCardSubtitle>
            </div>
          </IonCardHeader>

          <IonCardContent>
            <IonList lines="none">
              {equipsRaw.length === 0 && (
                <IonItem>
                  <IonLabel color="medium">Не найдено</IonLabel>
                </IonItem>
              )}

              {equipsRaw.map((e: any, i: number) => {
                const tip = safeString(e?.tip ?? e?.type);
                const eName = safeString(e?.name) || 'Оборудование';
                const number = safeString(e?.number);
                const activeRaw = e?.active;
                const isActive =
                  activeRaw === true || activeRaw === 'true' || activeRaw === 1 || activeRaw === '1';

                return (
                  <IonItem key={i}>
                    <IonLabel>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ fontWeight: 700 }}>{eName}</div>
                        <IonBadge color={isActive ? 'success' : 'medium'}>{isActive ? 'активно' : 'не активно'}</IonBadge>
                      </div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>
                        {tip && <span>{tip} · </span>}
                        {number ? `№ ${number}` : '№ не указан'}
                      </div>
                    </IonLabel>
                  </IonItem>
                );
              })}
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};
