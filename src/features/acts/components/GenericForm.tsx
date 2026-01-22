import React, { useState, useRef, useEffect } from 'react';
import { 
  IonList, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, 
  IonModal, IonDatetime, IonButton, IonIcon, IonSpinner
} from '@ionic/react';
import { calendarOutline, cameraOutline, trashOutline } from 'ionicons/icons';
import SignatureCanvas from 'react-signature-canvas';
import { ActTemplateConfig } from '../types';

interface GenericFormProps {
  template: ActTemplateConfig;
  initialData: any;
  onSave: (data: any) => void;
}

export const GenericForm: React.FC<GenericFormProps> = ({ template, initialData, onSave }) => {
  const [formData, setFormData] = useState({
    ...(initialData?.details || {}),
    act_number: initialData?.act_number || '',
    act_date: initialData?.act_date || new Date().toISOString().split('T')[0]
  });

  const signPadRefs = useRef<Record<string, any>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [loadingPhoto, setLoadingPhoto] = useState<string | null>(null); // Чтобы показать спиннер пока жмется фото

  useEffect(() => {
     if (initialData) {
         setFormData(prev => ({
             ...prev,
             ...(initialData.details || {}),
             act_number: initialData.act_number || prev.act_number,
             act_date: initialData.act_date || prev.act_date,
             // Важно сохранить тип, если он был
             type: initialData.type || prev.type
         }));
     }
  }, [initialData]);

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // === ЛОГИКА ФОТО (Сжатие + Base64) ===
  const handleFileChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setLoadingPhoto(key);
      
      const reader = new FileReader();
      reader.onload = (event) => {
          // Здесь можно добавить логику сжатия (через canvas), если фото слишком большие
          // Пока сохраняем как есть Base64
          handleChange(key, event.target?.result);
          setLoadingPhoto(null);
      };
      reader.readAsDataURL(file);
  };

  const triggerFileInput = (key: string) => {
      fileInputRefs.current[key]?.click();
  };

  const clearPhoto = (key: string) => {
      handleChange(key, null);
      if (fileInputRefs.current[key]) fileInputRefs.current[key]!.value = '';
  };

  const handleSave = () => {
    const finalData = { ...formData };
    
    // Собираем подписи
    Object.keys(signPadRefs.current).forEach(key => {
        const ref = signPadRefs.current[key];
        if (ref && typeof ref.isEmpty === 'function' && !ref.isEmpty()) {
            finalData[key] = { dataUrl: ref.toDataURL(), format: 'image/png' };
        }
    });

    // Вытаскиваем корневые поля
    const { act_number, act_date, type, id, ...details } = finalData;
    
    onSave({
        ...initialData,
        act_number,
        act_date,
        type,
        details 
    });
  };

  const displayDate = (isoDate: string) => {
    if (!isoDate) return 'Выберите дату';
    try { return new Date(isoDate).toLocaleDateString('ru-RU'); } catch { return isoDate; }
  };

  return (
    <div style={{paddingBottom: '80px'}}>
      <IonList lines="none">
        {template.fields.map((field) => (
          <React.Fragment key={field.key}>
            {field.section && (
              <div style={{
                  background: '#f4f5f8', padding: '12px 16px', 
                  fontWeight: '800', color: '#555', marginTop: '16px',
                  textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px'
              }}>
                {field.section}
              </div>
            )}

            <IonItem style={{'--background': 'white', '--min-height': '60px', marginBottom: '8px', borderRadius: '12px', border: '1px solid #f0f0f0'}}>
              
              {/* --- TEXT --- */}
              {field.type === 'string' && (
                <>
                    <IonLabel position="stacked" color="medium" style={{fontSize: '12px'}}>{field.label}</IonLabel>
                    <IonInput 
                        value={formData[field.key]} 
                        onIonChange={e => handleChange(field.key, e.detail.value)} 
                        placeholder="..."
                    />
                </>
              )}

              {/* --- DATE --- */}
              {field.type === 'date' && (
                 <>
                   <IonLabel color="medium" style={{fontSize: '14px'}}>{field.label}</IonLabel>
                   <IonButton 
                      fill="outline" color="dark" slot="end" 
                      id={`date-trigger-${field.key}`}
                      style={{'--border-radius': '8px', fontSize: '14px', height: '36px'}}
                   >
                     <IonIcon icon={calendarOutline} slot="start" />
                     {displayDate(formData[field.key])}
                   </IonButton>
                   <IonModal trigger={`date-trigger-${field.key}`} keepContentsMounted={true}>
                     <div style={{padding: 20, background: 'white', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                       <IonDatetime 
                          presentation="date"
                          value={formData[field.key]}
                          onIonChange={e => handleChange(field.key, e.detail.value)}
                          style={{margin: '0 auto'}}
                       />
                       <IonButton expand="block" onClick={() => document.querySelector<any>(`ion-modal#date-modal-${field.key}`)?.dismiss()}>Готово</IonButton>
                     </div>
                   </IonModal>
                 </>
              )}

              {/* --- SELECT --- */}
              {field.type === 'select' && (
                <>
                    <IonLabel position="stacked" color="medium" style={{fontSize: '12px'}}>{field.label}</IonLabel>
                    <IonSelect 
                        value={formData[field.key]} 
                        onIonChange={e => handleChange(field.key, e.detail.value)}
                        interface="action-sheet" placeholder="Выберите..."
                    >
                        {field.options?.map(opt => <IonSelectOption key={opt} value={opt}>{opt}</IonSelectOption>)}
                    </IonSelect>
                </>
              )}

              {/* --- ADDRESS (READONLY) --- */}
              {field.type === 'address' && (
                  <>
                    <IonLabel position="stacked" color="medium" style={{fontSize: '12px'}}>{field.label}</IonLabel>
                    <IonInput value={formData[field.key]} readonly style={{fontWeight: 'bold'}} />
                  </>
              )}

              {/* --- 🔥 PHOTO (НОВОЕ ПОЛЕ) --- */}
              {field.type === 'photo' && (
                  <div style={{width: '100%', padding: '10px 0'}}>
                      <div style={{fontSize: '12px', color: '#666', marginBottom: '8px'}}>{field.label}</div>
                      
                      <input 
                          type="file" 
                          accept="image/*" 
                          capture="environment" // Запрос камеры
                          ref={el => fileInputRefs.current[field.key] = el}
                          style={{display: 'none'}}
                          onChange={(e) => handleFileChange(field.key, e)}
                      />

                      {loadingPhoto === field.key ? (
                          <div style={{height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9', borderRadius: 12}}>
                              <IonSpinner />
                          </div>
                      ) : formData[field.key] ? (
                          <div style={{position: 'relative', width: '100%', height: '200px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #ddd'}}>
                              <img src={formData[field.key]} alt="Preview" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                              <IonButton 
                                  color="danger" size="small" 
                                  onClick={() => clearPhoto(field.key)}
                                  style={{position: 'absolute', top: '10px', right: '10px'}}
                              >
                                  <IonIcon icon={trashOutline} slot="icon-only" />
                              </IonButton>
                          </div>
                      ) : (
                          <div 
                              onClick={() => triggerFileInput(field.key)}
                              style={{
                                  height: '100px', border: '2px dashed #ccc', borderRadius: '12px', 
                                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                  color: '#999', cursor: 'pointer', background: '#f9f9f9'
                              }}
                          >
                              <IonIcon icon={cameraOutline} style={{fontSize: '32px', marginBottom: '4px'}} />
                              <span style={{fontSize: '12px'}}>Сделать фото</span>
                          </div>
                      )}
                  </div>
              )}

              {/* --- SIGNATURE --- */}
              {field.type === 'sign' && (
                  <div style={{width: '100%', padding: '10px 0'}}>
                      <div style={{fontSize: '12px', color: '#666', marginBottom: '8px'}}>{field.label}</div>
                      <div style={{border: '1px solid #e2e8f0', borderRadius: '12px', height: '140px', background: '#f8fafc', overflow: 'hidden'}}>
                          <SignatureCanvas 
                              ref={(ref) => { signPadRefs.current[field.key] = ref; }}
                              canvasProps={{ className: 'sigCanvas', style: {width: '100%', height: '100%'} }} 
                              clearOnResize={false}
                          />
                      </div>
                      <div style={{textAlign: 'right', marginTop: '4px'}}>
                         <IonButton fill="clear" size="small" color="danger" onClick={() => signPadRefs.current[field.key]?.clear()}>
                            Очистить
                         </IonButton>
                      </div>
                  </div>
              )}
            </IonItem>
          </React.Fragment>
        ))}
      </IonList>

      <div style={{padding: '20px'}}>
        <IonButton expand="block" onClick={handleSave} style={{'--border-radius': '12px', height: '50px', fontWeight: '600'}}>
            Сохранить Акт
        </IonButton>
      </div>
    </div>
  );
};