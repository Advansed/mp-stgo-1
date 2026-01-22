// src/components/ui/InvoiceItem.tsx
import React from 'react';
import { IonIcon, IonRippleEffect } from '@ionic/react';
import { locationOutline, calendarOutline } from 'ionicons/icons';
import './InvoiceItem.css'; // 🔥 Теперь этот файл существует!

interface InvoiceItemProps {
  invoice: any;
  onClick: () => void;
}

export const InvoiceItem: React.FC<InvoiceItemProps> = ({ invoice, onClick }) => {
  
  // Определяем стиль статуса
  const getStatusClass = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('новая') || s.includes('принята')) return 'new';
    if (s.includes('выполнена') || s.includes('закрыта')) return 'done';
    if (s.includes('отмена')) return 'error';
    return 'new'; // default
  };

  return (
    <div className="invoice-card ion-activatable" onClick={onClick}>
      <IonRippleEffect />
      
      {/* Шапка */}
      <div className="card-header">
        <div>
           <span className="invoice-number">#{invoice.number}</span>
           <span className="invoice-date">{invoice.date}</span>
        </div>
        <div className={`status-badge ${getStatusClass(invoice.status)}`}>
            {invoice.status}
        </div>
      </div>

      {/* Адрес (Гарантированная строка) */}
      <div className="info-row">
         <IonIcon icon={locationOutline} className="info-icon icon-blue" />
         <span className="info-value info-text">
            {invoice.addressText}
         </span>
      </div>

      {/* Дата плана */}
      <div className="info-row">
         <IonIcon icon={calendarOutline} className="info-icon icon-gray" />
         <span className="info-value info-text">
            План: {invoice.date}
         </span>
      </div>
    </div>
  );
};