import React from 'react';
import { IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { checkmarkCircle, layersOutline, trashOutline } from 'ionicons/icons';
import { formatAddress, getLicCode } from '../../utils/licsFormat';
import './LicCard.css';

export type LicCardLic = {
  id?: string | number;
  code?: string;
  account?: string;
  lic?: string;
  fio?: string;
  owner?: string;
  name?: string;
  address?: unknown;
  address_go?: unknown;
  [key: string]: unknown;
};

type ListModeProps = {
  mode?: 'list';
  lic: LicCardLic;
  onOpen?: () => void;
  onDelete?: () => void;
};

type SearchModeProps = {
  mode: 'search';
  lic: LicCardLic;
  added?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onAdd?: () => void;
};

export type LicCardProps = ListModeProps | SearchModeProps;

function getLicFio(lic: LicCardLic): string {
  return String(lic.fio || lic.owner || lic.name || 'ФИО не указано');
}

export const LicCard: React.FC<LicCardProps> = (props) => {
  const { lic } = props;
  const code = getLicCode(lic);
  const fio = getLicFio(lic);

  if (props.mode === 'search') {
    const { added, loading, disabled, onAdd } = props;

    return (
      <div className="lic-card">
        <div className="lic-card__number">{code || '—'}</div>
        <div className="lic-card__fio">
          <IonIcon icon={layersOutline} className="lic-card__fio-icon" />
          {fio}
        </div>

        {added ? (
          <IonButton expand="block" color="success" fill="outline" disabled>
            <IonIcon icon={checkmarkCircle} slot="start" />
            Уже добавлен
          </IonButton>
        ) : (
          <IonButton expand="block" onClick={onAdd} disabled={disabled}>
            {loading ? <IonSpinner name="crescent" /> : 'Добавить этот счет'}
          </IonButton>
        )}
      </div>
    );
  }

  const { onOpen, onDelete } = props;
  const address = formatAddress(lic.address_go ?? lic.address);
  const clickable = Boolean(code && onOpen);

  return (
    <div
      className={`lic-card ion-activatable${clickable ? ' lic-card--clickable' : ''}`}
      onClick={clickable ? onOpen : undefined}
    >
      <div className="lic-card__header">
        <div className="lic-card__info">
          <div className="lic-card__number">{code || '—'}</div>
          <div className="lic-card__fio">{fio}</div>
        </div>

        {onDelete && (
          <IonButton
            fill="clear"
            color="danger"
            className="lic-card__delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <IonIcon slot="icon-only" icon={trashOutline} />
          </IonButton>
        )}
      </div>

      {!!address && <div className="lic-card__address">{address}</div>}
    </div>
  );
};
