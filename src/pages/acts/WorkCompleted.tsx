import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonModal,
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea,
  IonList,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonToast,
  IonNote,
  IonText,
} from '@ionic/react';
import {
  addOutline,
  calendarOutline,
  checkboxOutline,
  cloudyOutline,
  createOutline,
  documentTextOutline,
  flameOutline,
  layersOutline,
  peopleOutline,
  printOutline,
  restaurantOutline,
  resizeOutline,
  saveOutline,
  sparklesOutline,
  speedometerOutline,
  thermometerOutline,
  trashOutline,
  waterOutline,
} from 'ionicons/icons';
import styles from './WorkCompleted.module.css';
import WorkCompletedPrint, { type WorkCompletedPrintData } from './WorkCompletedPrint';
import printStyles from './WorkCompletedPrint.module.css';
import { SH_2_CHECKBOX_LABELS } from '../../features/acts/configs/htmlWc';
import {
  validateWorkCompletedForm,
  type WorkCompletedFormData,
} from './workCompletedAct';

export type { WorkCompletedFormData };

type SectionAccent =
  | 'slate'
  | 'indigo'
  | 'violet'
  | 'amber'
  | 'cyan'
  | 'orange'
  | 'rose'
  | 'fuchsia'
  | 'sky'
  | 'teal'
  | 'emerald'
  | 'stone'
  | 'blue';

function FormSection({
  icon,
  title,
  accent,
  children,
}: {
  icon: string;
  title: string;
  accent: SectionAccent;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.section} data-accent={accent}>
      <div className={styles.sectionHead}>
        <span className={styles.iconBadge}>
          <IonIcon icon={icon} aria-hidden />
        </span>
        <h3 className={styles.sectionTitle}>{title}</h3>
      </div>
      <IonList className={styles.sectionList} lines="full">
        {children}
      </IonList>
    </section>
  );
}

function getMonthName(monthIndex: number): string {
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
  ];
  return months[monthIndex];
}

/** Поля для бланка: число, месяц словом, год двумя цифрами */
export function deriveActDateParts(act_date: string): {
  act_day: string;
  act_month: string;
  act_year: string;
} {
  const iso = (act_date || '').trim().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    return { act_day: '', act_month: '', act_year: '' };
  }
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) {
    return { act_day: '', act_month: '', act_year: '' };
  }
  return {
    act_day: String(d),
    act_month: getMonthName(dt.getMonth()),
    act_year: String(y).slice(-2),
  };
}

export type EquipmentKind = 'pipe' | 'boiler' | 'stove' | 'convector' | 'heater' | 'other';

export const EQUIPMENT_KIND_LABELS: Record<EquipmentKind, string> = {
  pipe: 'Газопровод',
  boiler: 'Котёл',
  stove: 'Плита',
  convector: 'Конвектор',
  heater: 'Водонагреватель',
  other: 'Иное',
};

export const EQUIPMENT_KINDS: EquipmentKind[] = ['pipe', 'boiler', 'stove', 'convector', 'heater', 'other'];

/** Строка оборудования: тип + поля (для pipe — свои, для приборов — mark/qty/дата/кВт) */
export interface EquipmentRow {
  id: string;
  kind: EquipmentKind;
  pipeBrand: string;
  pipeLength: string;
  pipeDiameter: string;
  shutoffDevice: string;
  pipeDate: string;
  mark: string;
  qty: string;
  mfgDate: string;
  powerKw: string;
  description: string;
}

function newEquipmentId(): string {
  return `eq_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createEmptyEquipment(kind: EquipmentKind): EquipmentRow {
  const base: EquipmentRow = {
    id: newEquipmentId(),
    kind,
    pipeBrand: '',
    pipeLength: '',
    pipeDiameter: '',
    shutoffDevice: '',
    pipeDate: '',
    mark: '',
    qty: '',
    mfgDate: '',
    powerKw: '',
    description: '',
  };
  switch (kind) {
    case 'pipe':
      return {
        ...base,
        pipeBrand: 'ПЭ 80',
        pipeDiameter: '63',
        shutoffDevice: 'Кран шаровой',
      };
    case 'boiler':
      return { ...base, qty: '1', powerKw: '24' };
    case 'stove':
      return { ...base, qty: '1', powerKw: '10' };
    case 'convector':
      return { ...base, qty: '0' };
    case 'heater':
      return { ...base, qty: '0' };
    default:
      return base;
  }
}

function equipmentIcon(kind: EquipmentKind): string {
  const map: Record<EquipmentKind, string> = {
    pipe: flameOutline,
    boiler: thermometerOutline,
    stove: restaurantOutline,
    convector: cloudyOutline,
    heater: waterOutline,
    other: layersOutline,
  };
  return map[kind];
}

function equipmentAccent(kind: EquipmentKind): SectionAccent {
  const map: Record<EquipmentKind, SectionAccent> = {
    pipe: 'orange',
    boiler: 'rose',
    stove: 'fuchsia',
    convector: 'sky',
    heater: 'cyan',
    other: 'teal',
  };
  return map[kind];
}

/** Один учётный узел: счётчик + список оборудования + площади и жильцы */
export interface MeterWithEquipment {
  id: string;
  meterType: string;
  meterNumber: string;
  meterValue: string;
  meterSeal: string;
  meterColor: string;
  equipment: EquipmentRow[];
  livingArea: string;
  nonlivingArea: string;
  residentsCount: string;
}

function newMeterId(): string {
  return `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export function createEmptyMeter(): MeterWithEquipment {
  return {
    id: newMeterId(),
    meterType: '4',
    meterNumber: '',
    meterValue: '',
    meterSeal: '',
    meterColor: 'красный',
    equipment: [],
    livingArea: '',
    nonlivingArea: '',
    residentsCount: '',
  };
}

/** Совместимость со старым плоским JSON: берём первый экземпляр каждого типа, «иное» — склейка всех */
function legacyFieldsFromMeter(m: MeterWithEquipment) {
  const first = (k: EquipmentKind) => m.equipment.find((e) => e.kind === k);
  const allOther = m.equipment.filter((e) => e.kind === 'other');
  const pipe = first('pipe');
  const boiler = first('boiler');
  const stove = first('stove');
  const convector = first('convector');
  const heater = first('heater');
  return {
    pipeBrand: pipe?.pipeBrand ?? '',
    pipeLength: pipe?.pipeLength ?? '',
    pipeDiameter: pipe?.pipeDiameter ?? '',
    shutoffDevice: pipe?.shutoffDevice ?? '',
    pipeDate: pipe?.pipeDate ?? '',
    boilerMark: boiler?.mark ?? '',
    boilerQty: boiler?.qty ?? '',
    boilerDate: boiler?.mfgDate ?? '',
    boilerPower: boiler?.powerKw ?? '',
    stoveMark: stove?.mark ?? '',
    stoveQty: stove?.qty ?? '',
    stoveDate: stove?.mfgDate ?? '',
    stovePower: stove?.powerKw ?? '',
    convectorMark: convector?.mark ?? '',
    convectorQty: convector?.qty ?? '',
    convectorDate: convector?.mfgDate ?? '',
    convectorPower: convector?.powerKw ?? '',
    heaterMark: heater?.mark ?? '',
    heaterQty: heater?.qty ?? '',
    heaterDate: heater?.mfgDate ?? '',
    heaterPower: heater?.powerKw ?? '',
    otherEquipment: allOther
      .map((e) => e.description.trim())
      .filter(Boolean)
      .join('; '),
  };
}

interface FormData extends WorkCompletedFormData {}

export interface WorkCompletedFormHandle {
  getFormData(): WorkCompletedFormData;
  validate(): { ok: boolean; message?: string };
}

export interface WorkCompletedProps {
  embedded?: boolean;
  defaultBackHref?: string;
  /** YYYY-MM-DD с бэка / родителя; day и month для бланка считаются через deriveActDateParts */
  initialActDate?: string;
  initialValues?: Partial<WorkCompletedFormData>;
  formRef?: React.Ref<WorkCompletedFormHandle>;
  /** Номер акта с сервера (read-only подсказка) */
  serverActNumber?: string;
}

function normalizeActDateYmd(v: string | undefined): string {
  if (!v) return '';
  const s = String(v).trim().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '';
}

function EquipmentCard({
  row,
  orderInKind,
  onPatch,
  onRemove,
}: {
  row: EquipmentRow;
  orderInKind: number;
  onPatch: (patch: Partial<EquipmentRow>) => void;
  onRemove: () => void;
}) {
  const Icon = equipmentIcon(row.kind);
  const accent = equipmentAccent(row.kind);
  const baseTitle = EQUIPMENT_KIND_LABELS[row.kind];
  const title = orderInKind > 1 ? `${baseTitle} (${orderInKind})` : baseTitle;

  const pipeFields = (
    <>
      <IonItem>
        <IonLabel position="stacked">Марка / материал</IonLabel>
        <IonInput
          value={row.pipeBrand}
          placeholder="например, ПЭ 80"
          onIonInput={(e) => onPatch({ pipeBrand: e.detail.value! })}
        />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Длина, м</IonLabel>
        <IonInput
          value={row.pipeLength}
          placeholder="метры"
          onIonInput={(e) => onPatch({ pipeLength: e.detail.value! })}
        />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Диаметр Ø, мм</IonLabel>
        <IonInput
          value={row.pipeDiameter}
          placeholder="например, 63"
          onIonInput={(e) => onPatch({ pipeDiameter: e.detail.value! })}
        />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Отключающее устройство</IonLabel>
        <IonInput
          value={row.shutoffDevice}
          placeholder="тип запорной арматуры"
          onIonInput={(e) => onPatch({ shutoffDevice: e.detail.value! })}
        />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Дата изготовления / ввода</IonLabel>
        <IonInput
          type="date"
          value={row.pipeDate}
          onIonInput={(e) => onPatch({ pipeDate: e.detail.value! })}
        />
      </IonItem>
    </>
  );

  const applianceFields = (
    <>
      <IonItem>
        <IonLabel position="stacked">Марка / модель</IonLabel>
        <IonInput value={row.mark} placeholder="модель" onIonInput={(e) => onPatch({ mark: e.detail.value! })} />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Количество, шт.</IonLabel>
        <IonInput value={row.qty} onIonInput={(e) => onPatch({ qty: e.detail.value! })} />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Дата изготовления</IonLabel>
        <IonInput type="date" value={row.mfgDate} onIonInput={(e) => onPatch({ mfgDate: e.detail.value! })} />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Мощность, кВт</IonLabel>
        <IonInput
          value={row.powerKw}
          placeholder="кВт"
          onIonInput={(e) => onPatch({ powerKw: e.detail.value! })}
        />
      </IonItem>
    </>
  );

  return (
    <div className={styles.equipmentCard}>
      <FormSection icon={Icon} title={title} accent={accent}>
        {row.kind === 'pipe' && pipeFields}
        {row.kind === 'other' && (
          <IonItem>
            <IonLabel position="stacked">Описание</IonLabel>
            <IonTextarea
              autoGrow
              rows={2}
              value={row.description}
              placeholder="иное оборудование"
              onIonInput={(e) => onPatch({ description: e.detail.value! })}
            />
          </IonItem>
        )}
        {row.kind !== 'pipe' && row.kind !== 'other' && applianceFields}
        <IonItem lines="none" className={styles.equipmentRemoveRow}>
          <IonButton fill="outline" color="danger" size="small" onClick={onRemove}>
            <IonIcon icon={trashOutline} className={styles.equipTrashInline} />
            Удалить позицию
          </IonButton>
        </IonItem>
      </FormSection>
    </div>
  );
}

function MeterBundle({
  index,
  meter: m,
  onPatchMeter,
  onAddEquipment,
  onPatchEquipment,
  onRemoveEquipment,
  onRemove,
  canRemove,
}: {
  index: number;
  meter: MeterWithEquipment;
  onPatchMeter: (patch: Partial<Omit<MeterWithEquipment, 'equipment'>>) => void;
  onAddEquipment: (kind: EquipmentKind) => void;
  onPatchEquipment: (eqIndex: number, patch: Partial<EquipmentRow>) => void;
  onRemoveEquipment: (eqIndex: number) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const n = index + 1;
  return (
    <div className={styles.meterBundle}>
      <div className={styles.meterToolbar}>
        <div className={styles.meterToolbarLeft}>
          <span className={styles.meterIndex}>{n}</span>
          <span className={styles.meterToolbarTitle}>Учётный узел №{n}</span>
        </div>
        <IonButton
          fill="clear"
          color="danger"
          size="small"
          disabled={!canRemove}
          onClick={onRemove}
          aria-label={`Удалить учётный узел ${n}`}
        >
          <IonIcon icon={trashOutline} className={styles.meterTrashIcon} />
        </IonButton>
      </div>

      <FormSection icon={speedometerOutline} title="Счётчик учёта" accent="amber">
        <IonItem>
          <IonLabel position="stacked">Тип G</IonLabel>
          <IonInput
            value={m.meterType}
            placeholder="например, 4"
            onIonInput={(e) => onPatchMeter({ meterType: e.detail.value! })}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Заводской №</IonLabel>
          <IonInput
            value={m.meterNumber}
            placeholder="номер прибора"
            onIonInput={(e) => onPatchMeter({ meterNumber: e.detail.value! })}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Показания, м³</IonLabel>
          <IonInput
            value={m.meterValue}
            placeholder="целое или с десятичными"
            onIonInput={(e) => onPatchMeter({ meterValue: e.detail.value! })}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Пломба</IonLabel>
          <IonInput
            value={m.meterSeal}
            placeholder="№ пломбы"
            onIonInput={(e) => onPatchMeter({ meterSeal: e.detail.value! })}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Цвет пломбы</IonLabel>
          <IonSelect
            interface="popover"
            value={m.meterColor}
            onIonChange={(e) => onPatchMeter({ meterColor: String(e.detail.value) })}
          >
            <IonSelectOption value="красный">красный</IonSelectOption>
            <IonSelectOption value="синий">синий</IonSelectOption>
            <IonSelectOption value="зеленый">зеленый</IonSelectOption>
            <IonSelectOption value="желтый">желтый</IonSelectOption>
          </IonSelect>
        </IonItem>
      </FormSection>

      <div className={styles.equipAddBar}>
        <p className={styles.equipAddLabel}>Оборудование у узла №{n}</p>
        <p className={styles.equipAddHint}>Добавляйте только то, что есть; один тип можно добавить несколько раз.</p>
        <div className={styles.equipKindChips}>
          {EQUIPMENT_KINDS.map((kind) => (
            <IonButton
              key={kind}
              size="small"
              fill="outline"
              color="medium"
              className={styles.equipChip}
              onClick={() => onAddEquipment(kind)}
            >
              <IonIcon icon={addOutline} className={styles.equipChipPlus} />
              {EQUIPMENT_KIND_LABELS[kind]}
            </IonButton>
          ))}
        </div>
      </div>

      {m.equipment.length === 0 ? (
        <p className={styles.equipEmpty}>Пока нет позиций оборудования — выберите тип кнопкой выше.</p>
      ) : (
        m.equipment.map((row, ei) => {
          const orderInKind = m.equipment.slice(0, ei + 1).filter((x) => x.kind === row.kind).length;
          return (
            <EquipmentCard
              key={row.id}
              row={row}
              orderInKind={orderInKind}
              onPatch={(patch) => onPatchEquipment(ei, patch)}
              onRemove={() => onRemoveEquipment(ei)}
            />
          );
        })
      )}

      <FormSection icon={resizeOutline} title="Площади и жильцы" accent="emerald">
        <IonItem>
          <IonLabel position="stacked">Жилая площадь, м²</IonLabel>
          <IonInput
            value={m.livingArea}
            placeholder="м²"
            onIonInput={(e) => onPatchMeter({ livingArea: e.detail.value! })}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Нежилая площадь, м²</IonLabel>
          <IonInput
            value={m.nonlivingArea}
            placeholder="м²"
            onIonInput={(e) => onPatchMeter({ nonlivingArea: e.detail.value! })}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Количество проживающих</IonLabel>
          <IonInput
            value={m.residentsCount}
            placeholder="чел."
            onIonInput={(e) => onPatchMeter({ residentsCount: e.detail.value! })}
          />
        </IonItem>
      </FormSection>
    </div>
  );
}

const WorkCompleted: React.FC<WorkCompletedProps> = ({
  embedded = false,
  defaultBackHref = '/home',
  initialActDate,
  initialValues,
  formRef,
  serverActNumber,
}) => {
  const [formData, setFormData] = useState<FormData>({
    actNumber: '',
    act_date: normalizeActDateYmd(initialActDate) || new Date().toISOString().split('T')[0],
    inspectorName: '',
    subscriberFullname: '',
    address: '',
    personalAccount: '',
    idDocument: '',
    subscriberSecond: '',
    idDocumentSecond: '',
    inspectionDate: new Date().toISOString().split('T')[0],
    inspectionTime: '',
    inspectionResult: 'Замечаний нет',
    meters: [createEmptyMeter()],
    conclusion: 'Газовое оборудование находится в исправном состоянии. Замечаний нет.',
    recommendations: 'Своевременно проходить техническое обслуживание.',
    inspectorSignature: false,
    subscriberSignature: false,
    serviceChecks: Array.from({ length: 16 }, () => false),
    workConfirmed: false,
    instructPassed: false,
    subscriberPhone: '',
    gbu: 'no',
    rating: '2',
    generalNote: '',
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printData, setPrintData] = useState<WorkCompletedPrintData | null>(null);
  const printIframeRef = useRef<HTMLIFrameElement>(null);

  useImperativeHandle(
    formRef,
    () => ({
      getFormData: () => formData,
      validate: () => validateWorkCompletedForm(formData),
    }),
    [formData]
  );

  useEffect(() => {
    if (!initialValues || Object.keys(initialValues).length === 0) return;
    setFormData((prev) => ({
      ...prev,
      ...initialValues,
      meters: initialValues.meters?.length ? initialValues.meters : prev.meters,
      serviceChecks: initialValues.serviceChecks?.length
        ? initialValues.serviceChecks
        : prev.serviceChecks,
    }));
  }, [initialValues]);

  useEffect(() => {
    const ymd = normalizeActDateYmd(initialActDate);
    if (!ymd) return;
    setFormData((prev) => (prev.act_date === ymd ? prev : { ...prev, act_date: ymd }));
  }, [initialActDate]);

  const handleInputChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const setServiceCheck = (index: number, checked: boolean) => {
    setFormData((prev) => {
      const next = [...prev.serviceChecks];
      next[index] = checked;
      return { ...prev, serviceChecks: next };
    });
  };

  const patchMeter = (index: number, patch: Partial<Omit<MeterWithEquipment, 'equipment'>>) => {
    setFormData((prev) => ({
      ...prev,
      meters: prev.meters.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    }));
  };

  const patchMeterEquipment = (meterIndex: number, eqIndex: number, patch: Partial<EquipmentRow>) => {
    setFormData((prev) => ({
      ...prev,
      meters: prev.meters.map((meter, mi) =>
        mi !== meterIndex
          ? meter
          : {
              ...meter,
              equipment: meter.equipment.map((eq, ei) => (ei === eqIndex ? { ...eq, ...patch } : eq)),
            }
      ),
    }));
  };

  const addMeterEquipment = (meterIndex: number, kind: EquipmentKind) => {
    setFormData((prev) => ({
      ...prev,
      meters: prev.meters.map((meter, mi) =>
        mi !== meterIndex
          ? meter
          : { ...meter, equipment: [...meter.equipment, createEmptyEquipment(kind)] }
      ),
    }));
  };

  const removeMeterEquipment = (meterIndex: number, eqIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      meters: prev.meters.map((meter, mi) =>
        mi !== meterIndex
          ? meter
          : { ...meter, equipment: meter.equipment.filter((_, ei) => ei !== eqIndex) }
      ),
    }));
  };

  const addMeter = () => {
    setFormData((prev) => ({ ...prev, meters: [...prev.meters, createEmptyMeter()] }));
  };

  const removeMeter = (index: number) => {
    setFormData((prev) => {
      if (prev.meters.length <= 1) return prev;
      return { ...prev, meters: prev.meters.filter((_, i) => i !== index) };
    });
  };

  const handlePrint = () => {
    setPrintData(formData as unknown as WorkCompletedPrintData);
    setIsPrintModalOpen(true);
    setToastMessage('Предпросмотр открыт. Нажмите «Печать» в модальном окне.');
    setShowToast(true);
  };

  const handleSave = () => {
    const { act_day, act_month, act_year } = deriveActDateParts(formData.act_date);
    const m0 = formData.meters[0];
    const legacyFirst = m0
      ? {
          meter1Type: m0.meterType,
          meter1Number: m0.meterNumber,
          meter1Value: m0.meterValue,
          meter1Seal: m0.meterSeal,
          meter1Color: m0.meterColor,
          ...legacyFieldsFromMeter(m0),
          livingArea: m0.livingArea,
          nonlivingArea: m0.nonlivingArea,
          residentsCount: m0.residentsCount,
        }
      : {};
    const payload = {
      ...formData,
      act_day,
      act_month,
      act_year,
      actDay: act_day,
      actMonth: act_month,
      actYear: act_year,
      ...legacyFirst,
    };
    localStorage.setItem('actFormData', JSON.stringify(payload));
    setToastMessage('Черновик сохранён локально');
    setShowToast(true);
  };

  const formInner = (
    <>
      <FormSection icon={calendarOutline} title="Номер и дата акта" accent="slate">
        <IonItem>
          <IonLabel position="stacked">Номер (ААА №)</IonLabel>
          <IonInput
            value={formData.actNumber}
            placeholder="по журналу"
            onIonInput={(e) => handleInputChange('actNumber', e.detail.value!)}
          />
          {serverActNumber ? (
            <IonNote slot="helper">Номер акта в системе: {serverActNumber}</IonNote>
          ) : (
            <IonNote slot="helper">Внутренний номер акта</IonNote>
          )}
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Дата акта</IonLabel>
          <IonInput
            type="date"
            value={formData.act_date}
            onIonInput={(e) => handleInputChange('act_date', e.detail.value!)}
          />
          <IonNote slot="helper">
            {(() => {
              const { act_day, act_month, act_year } = deriveActDateParts(formData.act_date);
              if (!act_day) return 'Выберите дату — для бланка подставятся день и месяц.';
              return `Для бланка: день «${act_day}», месяц «${act_month}», год «20${act_year}».`;
            })()}
          </IonNote>
        </IonItem>
      </FormSection>

      <FormSection icon={peopleOutline} title="Стороны" accent="indigo">
        <IonItem>
          <IonLabel position="stacked">
            Представитель ГРО <IonText color="danger">*</IonText>
          </IonLabel>
          <IonInput
            value={formData.inspectorName}
            placeholder="ФИО полностью"
            onIonInput={(e) => handleInputChange('inspectorName', e.detail.value!)}
          />
          <IonNote slot="helper">Кто проводил осмотр</IonNote>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">
            Абонент <IonText color="danger">*</IonText>
          </IonLabel>
          <IonInput
            value={formData.subscriberFullname}
            placeholder="ФИО"
            onIonInput={(e) => handleInputChange('subscriberFullname', e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">
            Адрес объекта <IonText color="danger">*</IonText>
          </IonLabel>
          <IonInput
            value={formData.address}
            placeholder="полный адрес"
            onIonInput={(e) => handleInputChange('address', e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">
            Лицевой счёт <IonText color="danger">*</IonText>
          </IonLabel>
          <IonInput
            value={formData.personalAccount}
            placeholder="л/с"
            onIonInput={(e) => handleInputChange('personalAccount', e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Документ, удостоверяющий личность</IonLabel>
          <IonInput
            value={formData.idDocument}
            placeholder="серия, номер, кем выдан"
            onIonInput={(e) => handleInputChange('idDocument', e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Второе лицо при осмотре (если есть)</IonLabel>
          <IonInput
            value={formData.subscriberSecond}
            placeholder="ФИО собственника / представителя"
            onIonInput={(e) => handleInputChange('subscriberSecond', e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Документ второго лица</IonLabel>
          <IonInput
            value={formData.idDocumentSecond}
            placeholder="при необходимости"
            onIonInput={(e) => handleInputChange('idDocumentSecond', e.detail.value!)}
          />
        </IonItem>
      </FormSection>

      <FormSection icon={checkboxOutline} title="Осмотр" accent="violet">
        <IonItem>
          <IonLabel position="stacked">Дата проверки</IonLabel>
          <IonInput
            type="date"
            value={formData.inspectionDate}
            onIonInput={(e) => handleInputChange('inspectionDate', e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Время</IonLabel>
          <IonInput
            type="time"
            value={formData.inspectionTime}
            onIonInput={(e) => handleInputChange('inspectionTime', e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Результат осмотра</IonLabel>
          <IonTextarea
            autoGrow
            rows={3}
            value={formData.inspectionResult}
            placeholder="что выявлено"
            onIonInput={(e) => handleInputChange('inspectionResult', e.detail.value!)}
          />
        </IonItem>
      </FormSection>

      <div className={styles.metersBlock}>
        <div className={styles.metersBlockHead}>
          <IonIcon icon={speedometerOutline} className={styles.metersBlockIcon} aria-hidden />
          <div>
            <h3 className={styles.metersBlockTitle}>Счётчики и оборудование</h3>
            <p className={styles.metersBlockHint}>
              У каждого счётчика добавляйте нужные позиции оборудования кнопками (можно несколько одинаковых), затем площади и жильцов. Несколько счётчиков — кнопка «Добавить счётчик».
            </p>
          </div>
        </div>
        {formData.meters.map((meter, index) => (
          <MeterBundle
            key={meter.id}
            index={index}
            meter={meter}
            onPatchMeter={(patch) => patchMeter(index, patch)}
            onAddEquipment={(kind) => addMeterEquipment(index, kind)}
            onPatchEquipment={(ei, patch) => patchMeterEquipment(index, ei, patch)}
            onRemoveEquipment={(ei) => removeMeterEquipment(index, ei)}
            onRemove={() => removeMeter(index)}
            canRemove={formData.meters.length > 1}
          />
        ))}
        <div className={styles.addMeterRow}>
          <IonButton expand="block" fill="outline" color="primary" className={styles.addMeterBtn} onClick={addMeter}>
            <IonIcon icon={addOutline} className={styles.addMeterIcon} />
            Добавить счётчик
          </IonButton>
        </div>
      </div>

      <FormSection icon={checkboxOutline} title="Техническое обслуживание (стр. 2)" accent="violet">
        {Array.from({ length: 16 }).map((_, i) => (
          <IonItem key={i}>
            <IonCheckbox
              slot="start"
              checked={formData.serviceChecks[i]}
              onIonChange={(e) => setServiceCheck(i, !!e.detail.checked)}
            />
            <IonLabel style={{ fontSize: '12px', lineHeight: 1.2 }}>
              {SH_2_CHECKBOX_LABELS[i] ?? `Пункт ${i + 1}`}
            </IonLabel>
          </IonItem>
        ))}

        <IonItem>
          <IonCheckbox
            slot="start"
            checked={formData.workConfirmed}
            onIonChange={(e) => handleInputChange('workConfirmed', !!e.detail.checked)}
          />
          <IonLabel>
            По выполненным работам по договору технического обслуживания (ремонта) ВДГО и (или) ВКГО проведено в полном объеме, претензий не имею.
          </IonLabel>
        </IonItem>

        <IonItem>
          <IonCheckbox
            slot="start"
            checked={formData.instructPassed}
            onIonChange={(e) => handleInputChange('instructPassed', !!e.detail.checked)}
          />
          <IonLabel>Проведен инструктаж по безопасному пользованию газом в быту.</IonLabel>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Номер телефона абонента</IonLabel>
          <IonInput
            value={formData.subscriberPhone}
            placeholder="телефон"
            onIonInput={(e) => handleInputChange('subscriberPhone', e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Наличие ГБУ</IonLabel>
          <IonSelect
            value={formData.gbu}
            onIonChange={(e) => handleInputChange('gbu', String(e.detail.value) as FormData['gbu'])}
          >
            <IonSelectOption value="yes">Да</IonSelectOption>
            <IonSelectOption value="no">Нет</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Оценка работ по ТО ВДГО</IonLabel>
          <IonSelect
            value={formData.rating}
            onIonChange={(e) => handleInputChange('rating', String(e.detail.value) as FormData['rating'])}
          >
            <IonSelectOption value="bad">Неуд.</IonSelectOption>
            <IonSelectOption value="2">2</IonSelectOption>
            <IonSelectOption value="3">3</IonSelectOption>
            <IonSelectOption value="4">4</IonSelectOption>
            <IonSelectOption value="excellent">Отл.</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Примечание</IonLabel>
          <IonTextarea
            autoGrow
            rows={2}
            value={formData.generalNote}
            placeholder="доп. примечание"
            onIonInput={(e) => handleInputChange('generalNote', e.detail.value!)}
          />
        </IonItem>
      </FormSection>

      <FormSection icon={documentTextOutline} title="Заключение" accent="blue">
        <IonItem>
          <IonLabel position="stacked">Заключение</IonLabel>
          <IonTextarea
            autoGrow
            rows={3}
            value={formData.conclusion}
            placeholder="итог осмотра"
            onIonInput={(e) => handleInputChange('conclusion', e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Рекомендации абоненту</IonLabel>
          <IonTextarea
            autoGrow
            rows={3}
            value={formData.recommendations}
            placeholder="что рекомендовать"
            onIonInput={(e) => handleInputChange('recommendations', e.detail.value!)}
          />
        </IonItem>
      </FormSection>

      <FormSection icon={createOutline} title="Подписи (отметка в акте)" accent="stone">
        <IonItem>
          <IonCheckbox
            slot="start"
            checked={formData.inspectorSignature}
            onIonChange={(e) => handleInputChange('inspectorSignature', e.detail.checked)}
          />
          <IonLabel>Представитель ГРО подписал (после подписи на бумаге)</IonLabel>
        </IonItem>
        <IonItem>
          <IonCheckbox
            slot="start"
            checked={formData.subscriberSignature}
            onIonChange={(e) => handleInputChange('subscriberSignature', e.detail.checked)}
          />
          <IonLabel>Абонент подписал</IonLabel>
        </IonItem>
      </FormSection>

      <div className={styles.actions}>
        <IonButton expand="block" className={styles.actionBtn} fill="solid" color="primary" onClick={handlePrint}>
          <span className={styles.btnIcon} aria-hidden>
            <IonIcon icon={printOutline} />
          </span>
          Печать
        </IonButton>
      </div>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
      />
    </>
  );

  const body = (
    <div className={embedded ? styles.embeddedRoot : styles.scrollPad}>
      <div className={styles.leadCard}>
        <span className={styles.leadIcon} aria-hidden>
          <IonIcon icon={sparklesOutline} />
        </span>
        <p className={styles.leadText}>
          Заполните поля ниже. Обязательные отмечены <span className={styles.reqMark}>*</span>.
        </p>
      </div>
      {formInner}
    </div>
  );

  const printModal = (
    <IonModal isOpen={isPrintModalOpen} onDidDismiss={() => setIsPrintModalOpen(false)}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Печать акта</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setIsPrintModalOpen(false)}>Закрыть</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {printData && (
          <>
            <div style={{ padding: 12 }}>
              <WorkCompletedPrint
                data={printData}
                className={printStyles.previewFrame}
                iframeRef={printIframeRef}
              />
            </div>
            <div style={{ padding: '0 12px 18px' }}>
              <IonButton
                expand="block"
                color="primary"
                onClick={() => {
                  try {
                    printIframeRef.current?.contentWindow?.print();
                  } catch {
                    // ignore
                  }
                }}
              >
                <IonIcon icon={printOutline} slot="start" />
                Печать
              </IonButton>
            </div>
          </>
        )}
      </IonContent>
    </IonModal>
  );

  if (embedded) {
    return (
      <>
        <div className={styles.embeddedWrap}>{body}</div>
        {printModal}
      </>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={defaultBackHref} />
          </IonButtons>
          <IonTitle>Акт проверки объекта</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave} aria-label="Сохранить черновик">
              <IonIcon icon={saveOutline} className={styles.toolbarLucide} />
            </IonButton>
            <IonButton onClick={handlePrint} aria-label="Печать">
              <IonIcon icon={printOutline} className={styles.toolbarLucide} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className={styles.pageContent}>{body}</IonContent>
      {printModal}
    </IonPage>
  );
};

export default WorkCompleted;
