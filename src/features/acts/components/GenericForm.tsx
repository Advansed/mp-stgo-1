import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonModal,
  IonButton,
  IonIcon,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
} from '@ionic/react';
import {
  cameraOutline,
  closeCircle,
  calendarOutline,
  chevronDownOutline,
  documentTextOutline,
  peopleOutline,
  homeOutline,
  createOutline,
  constructOutline,
  flashOutline,
  listOutline,
} from 'ionicons/icons';
import type { ActFieldConfig, ActTemplateConfig } from '../types';
import styles from './GenericForm.module.css';

const ACCENTS = ['#2563eb', '#0ea5e9', '#8b5cf6', '#d69e2e', '#0d9488', '#ef4444', '#f59e0b', '#6366f1'];

function sectionAccent(title: string, index: number): string {
  const t = title.toLowerCase();
  if (t.includes('подпис')) return '#6366f1';
  if (t.includes('абонент') || t.includes('владель')) return '#2563eb';
  if (t.includes('объект') || t.includes('адрес')) return '#ef4444';
  if (t.includes('прибор') || t.includes('счетчик') || t.includes('счётчик') || t.includes('пломб')) return '#0ea5e9';
  if (t.includes('оборуд')) return '#f59e0b';
  if (t.includes('услуг') || t.includes('работ')) return '#d69e2e';
  if (t.includes('фото') || t.includes('реквизит') || t.includes('данн')) return '#0d9488';
  return ACCENTS[index % ACCENTS.length];
}

function sectionIcon(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('подпис')) return createOutline;
  if (t.includes('абонент') || t.includes('владель') || t.includes('сторон')) return peopleOutline;
  if (t.includes('объект') || t.includes('адрес')) return homeOutline;
  if (t.includes('прибор') || t.includes('счетчик') || t.includes('счётчик') || t.includes('пломб')) return constructOutline;
  if (t.includes('оборуд')) return flashOutline;
  if (t.includes('услуг') || t.includes('работ')) return listOutline;
  return documentTextOutline;
}

type FieldGroup = { title: string; fields: ActFieldConfig[] };

function groupFields(fields: ActFieldConfig[]): FieldGroup[] {
  const groups: FieldGroup[] = [];
  const map = new Map<string, FieldGroup>();

  for (const field of fields) {
    const title = (field.section || 'Основное').trim() || 'Основное';
    let group = map.get(title);
    if (!group) {
      group = { title, fields: [] };
      map.set(title, group);
      groups.push(group);
    }
    group.fields.push(field);
  }
  return groups;
}

const SignaturePad = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = 160;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
      }
    }
  }, []);

  const startDrawing = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    ctx?.beginPath();
    ctx?.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) onChange(canvas.toDataURL('image/png'));
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onChange('');
    }
  };

  if (value && !isDrawing) {
    return (
      <div className={styles.signPreview}>
        <img src={value} alt="Signature" />
        <IonButton
          fill="clear"
          color="danger"
          size="small"
          className={styles.signClear}
          onClick={() => onChange('')}
        >
          <IonIcon slot="icon-only" icon={closeCircle} />
        </IonButton>
      </div>
    );
  }

  return (
    <div className={styles.signPad}>
      <div className={styles.signCanvasWrap}>
        <canvas
          ref={canvasRef}
          className={styles.signCanvas}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
        {!isDrawing && !value && <div className={styles.signHint}>Расписаться</div>}
      </div>
      <div className={styles.signActions}>
        <IonButton fill="clear" size="small" color="medium" onClick={clear}>
          Очистить
        </IonButton>
      </div>
    </div>
  );
};

interface GenericFormProps {
  template: ActTemplateConfig;
  initialData?: any;
  onSave: (data: any) => void;
}

export const GenericForm: React.FC<GenericFormProps> = ({ template, initialData, onSave }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {},
  });

  const [showDateModal, setShowDateModal] = useState<string | null>(null);
  const groups = useMemo(() => groupFields(template.fields ?? []), [template.fields]);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    groups.forEach((g, i) => {
      init[g.title] = i === 0;
    });
    return init;
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      reset(initialData);
    }
  }, [initialData, reset]);

  useEffect(() => {
    setOpenSections((prev) => {
      const next = { ...prev };
      groups.forEach((g, i) => {
        if (next[g.title] === undefined) next[g.title] = i === 0;
      });
      return next;
    });
  }, [groups]);

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const onError = (_errors: any) => {};

  const renderFieldControl = (field: ActFieldConfig) => (
    <Controller
      name={field.key}
      control={control}
      rules={{ required: field.required ? 'Обязательное поле' : false }}
      render={({ field: { onChange, value } }) => {
        switch (field.type) {
          case 'date':
            return (
              <>
                <IonItem
                  lines="none"
                  detail={false}
                  className={styles.dateTrigger}
                  onClick={() => setShowDateModal(field.key)}
                >
                  <IonIcon icon={calendarOutline} slot="start" color="primary" />
                  <IonLabel className={value ? styles.dateValue : styles.datePlaceholder}>
                    {value ? new Date(value).toLocaleDateString('ru-RU') : 'Выберите дату'}
                  </IonLabel>
                </IonItem>

                <IonModal
                  isOpen={showDateModal === field.key}
                  onDidDismiss={() => setShowDateModal(null)}
                  keepContentsMounted={true}
                >
                  <IonHeader>
                    <IonToolbar>
                      <IonTitle>Выберите дату</IonTitle>
                      <IonButtons slot="end">
                        <IonButton onClick={() => setShowDateModal(null)}>Закрыть</IonButton>
                      </IonButtons>
                    </IonToolbar>
                  </IonHeader>
                  <IonContent className="ion-padding">
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <IonDatetime
                        presentation="date"
                        value={value}
                        onIonChange={(e) => onChange(e.detail.value)}
                      />
                    </div>
                  </IonContent>
                </IonModal>
              </>
            );

          case 'select':
            return (
              <IonSelect
                value={value}
                onIonChange={(e) => onChange(e.detail.value)}
                placeholder="Выберите"
                interface="action-sheet"
                className={styles.fieldControl}
              >
                {field.options?.map((opt: string) => (
                  <IonSelectOption key={opt} value={opt}>
                    {opt}
                  </IonSelectOption>
                ))}
              </IonSelect>
            );

          case 'textarea':
          case 'address':
            return (
              <IonTextarea
                value={value}
                onIonInput={(e) => onChange(e.detail.value)}
                autoGrow
                rows={3}
                placeholder={field.label}
                className={styles.fieldControl}
              />
            );

          case 'image':
            return value ? (
              <div className={styles.imagePreview}>
                <img src={value} alt="evidence" />
                <div className={styles.imageClear} onClick={() => onChange('')}>
                  <IonIcon icon={closeCircle} />
                </div>
              </div>
            ) : (
              <div className={styles.dropzone}>
                <IonIcon icon={cameraOutline} className={styles.dropzoneIcon} />
                <div className={styles.dropzoneText}>Добавить фото</div>
                <input
                  type="file"
                  accept="image/*"
                  className={styles.dropzoneInput}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => onChange(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            );

          case 'signature':
            return <SignaturePad value={value} onChange={onChange} />;

          default:
            return (
              <IonInput
                value={value}
                onIonInput={(e) => onChange(e.detail.value)}
                type={field.type === 'number' ? 'number' : 'text'}
                placeholder={field.label}
                className={styles.fieldControl}
              />
            );
        }
      }}
    />
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSave, onError)}>
      {groups.map((group, index) => {
        const open = openSections[group.title] !== false;
        const accent = sectionAccent(group.title, index);
        const icon = sectionIcon(group.title);

        return (
          <section
            key={group.title}
            className={`${styles.section}${open ? '' : ` ${styles.sectionCollapsed}`}`}
            style={{ ['--act-accent' as string]: accent }}
          >
            <div
              className={styles.sectionHead}
              onClick={() => toggleSection(group.title)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleSection(group.title);
                }
              }}
            >
              <div className={styles.sectionHeadMain}>
                <IonIcon icon={icon} className={styles.sectionIcon} />
                <div>
                  <div className={styles.sectionTitle}>{group.title}</div>
                  <div className={styles.sectionSubtitle}>
                    {open ? `${group.fields.length} полей` : 'Нажмите, чтобы раскрыть'}
                  </div>
                </div>
              </div>
              <IonIcon
                icon={chevronDownOutline}
                className={`${styles.sectionChevron}${open ? ` ${styles.sectionChevronOpen}` : ''}`}
              />
            </div>

            {open && (
              <div className={styles.sectionBody}>
                {group.fields.map((field) => (
                  <div
                    key={field.key}
                    className={`${styles.field}${errors[field.key] ? ` ${styles.fieldError}` : ''}`}
                  >
                    <label className={styles.fieldLabel}>
                      {field.label}{' '}
                      {field.required && <span className={styles.fieldRequired}>*</span>}
                    </label>
                    {renderFieldControl(field)}
                    {errors[field.key] && (
                      <div className={styles.fieldHint}>Обязательное поле</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}

      <div className={styles.fabBar}>
        <IonButton expand="block" type="submit">
          Сохранить акт
        </IonButton>
      </div>
    </form>
  );
};
