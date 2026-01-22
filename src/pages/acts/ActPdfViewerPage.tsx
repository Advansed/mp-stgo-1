import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { 
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, 
  IonButtons, IonButton, IonIcon, IonSpinner, IonBackButton 
} from '@ionic/react';
import { closeOutline, shareOutline, downloadOutline } from 'ionicons/icons';
import { useActsStore } from '../../store/actsStore';
import { useAuthStore } from '../../store/authStore';
import { actsApi } from '../../api/actsApi';
import { ACT_TEMPLATES } from '../../features/acts/configs/registry';
import { fillActTemplate } from '../../features/acts/utils/templateEngine';

export const ActPdfViewerPage: React.FC = () => {
  const { id, actId } = useParams<{ id: string, actId: string }>();
  const token = useAuthStore(s => s.token);
  const { currentAct } = useActsStore();
  
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPdf = async () => {
      if (!token || !currentAct) {
        setError('Нет данных акта');
        setLoading(false);
        return;
      }

      // 1. Берем шаблон
      const templateConfig = ACT_TEMPLATES[currentAct.type];
      if (!templateConfig) {
        setError('Неизвестный шаблон');
        return;
      }

      // 2. Заполняем HTML данными
      const filledHtml = fillActTemplate(templateConfig.htmlTemplate, currentAct);

      // 3. Отправляем на сервер (mp_get_pdf)
      try {
        const res = await actsApi.getPdf(token, filledHtml);
        if (res.success && res.data) {
          // Сервер возвращает base64 без префикса (обычно)
          // Проверяем, есть ли префикс
          const src = res.data.startsWith('data:') ? res.data : `data:application/pdf;base64,${res.data}`;
          setPdfData(src);
        } else {
          setError(res.message || 'Ошибка генерации PDF');
        }
      } catch (e) {
        setError('Ошибка сети');
      } finally {
        setLoading(false);
      }
    };

    loadPdf();
  }, [currentAct, token]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
             <IonBackButton defaultHref={`/app/invoices/${id}/acts`} />
          </IonButtons>
          <IonTitle>Предпросмотр</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {loading && (
            <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <IonSpinner />
            </div>
        )}
        
        {error && (
            <div style={{padding: 20, textAlign: 'center', color: 'red'}}>
                {error}
            </div>
        )}

        {!loading && !error && pdfData && (
            <iframe 
                src={pdfData} 
                style={{width: '100%', height: '100%', border: 'none'}} 
                title="PDF Preview"
            />
        )}
      </IonContent>
    </IonPage>
  );
};