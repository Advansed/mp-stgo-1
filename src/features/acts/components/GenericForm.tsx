import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  IonList, IonItem, IonLabel, IonInput, IonTextarea, 
  IonSelect, IonSelectOption, IonDatetime, IonModal,
  IonButton, IonIcon, IonContent, IonHeader, IonToolbar, IonButtons, IonTitle // 🔥 ДОБАВИЛ IonHeader
} from '@ionic/react';
import { cameraOutline, closeCircle, pencilOutline, calendarOutline } from 'ionicons/icons';
import { ActTemplateConfig } from '../types';

// --- КОМПОНЕНТ ПОДПИСИ ---
const SignaturePad = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
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
            <div style={{position: 'relative', width: '100%', textAlign: 'center'}}>
                <img src={value} alt="Signature" style={{maxHeight: '120px', border: '1px solid #ccc', borderRadius: '8px'}} />
                <IonButton fill="clear" color="danger" size="small" style={{position: 'absolute', top: 0, right: 0}} onClick={() => onChange('')}>
                    <IonIcon slot="icon-only" icon={closeCircle} />
                </IonButton>
            </div>
        );
    }

    return (
        <div style={{width: '100%'}}>
            <div style={{border: '2px dashed #cbd5e0', borderRadius: '12px', background: '#f8fafc', overflow: 'hidden', touchAction: 'none'}}>
                <canvas
                    ref={canvasRef}
                    style={{width: '100%', height: '160px', display: 'block'}}
                    onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={endDrawing} onMouseLeave={endDrawing}
                    onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={endDrawing}
                />
                {!isDrawing && !value && <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', color: '#a0aec0', fontSize: '12px'}}>Расписаться</div>}
            </div>
            <div style={{textAlign: 'right'}}><IonButton fill="clear" size="small" color="medium" onClick={clear}>Очистить</IonButton></div>
        </div>
    );
};

interface GenericFormProps {
  template: ActTemplateConfig;
  initialData?: any;
  onSave: (data: any) => void;
}

export const GenericForm: React.FC<GenericFormProps> = ({ template, initialData, onSave }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: initialData || {}
  });

  const [showDateModal, setShowDateModal] = useState<string | null>(null);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onError = (errors: any) => {
      console.log("Validation Errors:", errors);
  };

  const renderField = (field: any) => {
    return (
      <Controller
        key={field.key}
        name={field.key}
        control={control}
        rules={{ required: field.required ? 'Обязательное поле' : false }}
        render={({ field: { onChange, value } }) => {
          switch (field.type) {
            
            // 🔥 БЕЗОПАСНАЯ ДАТА (Через модалку, без крашей)
            case 'date':
              return (
                <>
                  <IonItem 
                    lines="none" 
                    detail={false} 
                    onClick={() => setShowDateModal(field.key)}
                    style={{'--padding-start': '0', '--inner-padding-end': '0', cursor: 'pointer'}}
                  >
                     <IonIcon icon={calendarOutline} slot="start" color="primary" style={{marginRight: '8px'}} />
                     <IonLabel style={{color: value ? '#000' : '#a0aec0'}}>
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
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <IonDatetime 
                                presentation="date" 
                                value={value} 
                                onIonChange={e => onChange(e.detail.value)} 
                            />
                        </div>
                    </IonContent>
                  </IonModal>
                </>
              );

            case 'select':
              return (
                <IonSelect value={value} onIonChange={e => onChange(e.detail.value)} placeholder="Выберите" interface="action-sheet">
                  {field.options?.map((opt: string) => <IonSelectOption key={opt} value={opt}>{opt}</IonSelectOption>)}
                </IonSelect>
              );

            case 'textarea':
            case 'address':
              return <IonTextarea value={value} onIonInput={e => onChange(e.detail.value)} autoGrow rows={3} placeholder={field.label} />;

            case 'image':
              return (
                <div style={{width: '100%', marginTop: '8px'}}>
                   {value ? (
                       <div style={{position: 'relative', width: '100%', height: '200px', borderRadius: '12px', overflow: 'hidden'}}>
                           <img src={value} style={{width: '100%', height: '100%', objectFit: 'cover'}} alt="evidence" />
                           <div style={{position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '4px'}} onClick={() => onChange('')}>
                               <IonIcon icon={closeCircle} style={{color: 'white', fontSize: '24px'}} />
                           </div>
                       </div>
                   ) : (
                       <div style={{border: '2px dashed #cbd5e0', borderRadius: '12px', height: '100px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
                           <IonIcon icon={cameraOutline} style={{fontSize: '24px', color: '#a0aec0'}} />
                           <div style={{fontSize: '12px', color: '#a0aec0'}}>Добавить фото</div>
                           <input type="file" accept="image/*" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0}}
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
                   )}
                </div>
              );

            case 'signature':
                return <SignaturePad value={value} onChange={onChange} />;

            default:
              return (
                <IonInput 
                    value={value} 
                    onIonInput={e => onChange(e.detail.value)} 
                    type={field.type === 'number' ? 'number' : 'text'}
                    placeholder={field.label}
                />
              );
          }
        }}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit(onSave, onError)}>
      <IonList lines="none" style={{background: 'transparent', paddingBottom: '140px'}}>
        {template.fields.map((field) => (
          <div key={field.key} style={{marginBottom: '16px'}}>
            {field.section && (
              <div style={{fontSize: '13px', fontWeight: '800', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '24px 4px 8px 4px'}}>
                {field.section}
              </div>
            )}
            <IonItem style={{'--background': 'white', '--border-radius': '16px', '--padding-start': '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', border: errors[field.key] ? '1px solid #e53e3e' : 'none'}}>
              <div style={{width: '100%', padding: '10px 0'}}>
                  <IonLabel position="stacked" style={{marginBottom: '6px', fontSize: '12px', fontWeight: '600', color: '#718096'}}>
                    {field.label} {field.required && <span style={{color: '#e53e3e'}}>*</span>}
                  </IonLabel>
                  {renderField(field)}
              </div>
            </IonItem>
          </div>
        ))}
      </IonList>

      <div style={{position: 'fixed', bottom: '100px', left: '16px', right: '16px', zIndex: 1000}}>
        <IonButton expand="block" type="submit" style={{'--border-radius': '14px', fontWeight: 'bold', height: '54px', '--box-shadow': '0 8px 20px rgba(49, 130, 206, 0.3)'}}>
          Сохранить акт
        </IonButton>
      </div>
    </form>
  );
};