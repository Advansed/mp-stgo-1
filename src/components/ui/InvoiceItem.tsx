import React from 'react';
import { IonIcon, IonRippleEffect } from '@ionic/react';
import {
  calendarOutline,
  documentTextOutline,
  locationOutline,
} from 'ionicons/icons';
import type { Invoice } from '../../domain/types';
import './InvoiceItem.css';

interface InvoiceItemProps {
  invoice: Invoice;
  onClick: () => void;
}

const getStatusTone = (status: string): 'new' | 'done' | 'error' | 'muted' => {
  const s = (status || '').toLowerCase();
  if (s.includes('новая') || s.includes('принята') || s.includes('назнач') || s.includes('в работе')) {
    return 'new';
  }
  if (s.includes('завершен') || s.includes('выполнена') || s.includes('закрыта') || s.includes('completed')) {
    return 'done';
  }
  if (s.includes('отмена')) return 'error';
  if (s.includes('отлож')) return 'muted';
  return 'muted';
};

const formatDate = (value?: string) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('ru-RU');
};

const isTechnicalId = (value?: string) => {
  const s = String(value || '').trim();
  if (!s) return true;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
};

export const InvoiceItem: React.FC<InvoiceItemProps> = ({ invoice, onClick }) => {
  const status = invoice.status || 'В работе';
  const tone = getStatusTone(status);
  const clientName = invoice.client_name || invoice.applicant || '';
  const address = invoice.addressText || 'Адрес не указан';
  const service = invoice.service || '';
  const dateLabel = formatDate(invoice.date);
  const numberLabel = !isTechnicalId(invoice.number) ? String(invoice.number).trim() : '';

  return (
    <div
      className={`inv-card ion-activatable inv-card--clickable inv-card--${tone}`}
      onClick={onClick}
    >
      <IonRippleEffect />

      <div className="inv-card__top">
        <div className="inv-card__title-block">
          {numberLabel ? <div className="inv-card__number">№ {numberLabel}</div> : null}
          <div className={`inv-card__client${numberLabel ? '' : ' inv-card__client--title'}`}>
            {clientName || 'Без ФИО'}
          </div>
        </div>
        <span className={`inv-card__status inv-card__status--${tone}`}>{status}</span>
      </div>

      <div className="inv-card__body">
        <div className="inv-card__row">
          <IonIcon icon={locationOutline} className="inv-card__icon inv-card__icon--accent" />
          <span className="inv-card__text inv-card__text--address">{address}</span>
        </div>

        {service ? (
          <div className="inv-card__row">
            <IonIcon icon={documentTextOutline} className="inv-card__icon" />
            <span className="inv-card__text inv-card__text--service">{service}</span>
          </div>
        ) : null}
      </div>

      {dateLabel ? (
        <div className="inv-card__footer">
          <span className="inv-card__chip">
            <IonIcon icon={calendarOutline} />
            <span>{dateLabel}</span>
          </span>
        </div>
      ) : null}
    </div>
  );
};
