import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle,
  IonButtons, IonSpinner, IonBackButton
} from '@ionic/react';
import { useActsStore } from '../../store/actsStore';
import { useAuthStore } from '../../store/authStore';
import { actsApi } from '../../api/actsApi';
import { ACT_TEMPLATES } from '../../features/acts/configs/registry';
import { loadActHtmlTemplate } from '../../features/acts/configs/loadActHtmlTemplate';

export const ActPdfViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string; actId: string }>();
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
      const actType = String(currentAct.type || '');
      const templateConfig = ACT_TEMPLATES[actType];
      if (!templateConfig) {
        setError('Неизвестный шаблон');
        setLoading(false);
        return;
      }

      try {
        const [{ fillActTemplate }, htmlTemplate] = await Promise.all([
          import('../../features/acts/utils/templateEngine'),
          loadActHtmlTemplate(actType),
        ]);
        const filledHtml = await fillActTemplate(htmlTemplate, currentAct);

        const res = await actsApi.getPdf(token, filledHtml);
        if (res.success && res.data) {
          // Сервер возвращает base64 без префикса (обычно)
          // Проверяем, есть ли префикс
          const src = res.data.startsWith('data:') ? res.data : `data:application/pdf;base64,${res.data}`;
          setPdfData(src);
        } else {
          setError(res.description || res.message || 'Ошибка генерации PDF');
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
                style={{
                  width: '95%',
                  height: '80vh',
                  border: 'none',
                  display: 'block',
                  margin: '0 auto',
                }}
                title="PDF Preview"
            />
        )}
      </IonContent>
    </IonPage>
  );
};