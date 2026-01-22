// src/pages/invoices/InvoiceAddressPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { 
  IonPage, IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, 
  IonTitle, IonSearchbar, IonList, IonItem, IonLabel, IonIcon, IonSpinner, IonNote, IonButton 
} from '@ionic/react';
import { locationOutline, navigateOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { useInvoiceStore } from '../../store/invoiceStore';
import { useAuthStore } from '../../store/authStore';
import { dadataApi, DaDataSuggestion } from '../../api/dadataApi';
import { Geolocation } from '@capacitor/geolocation';

export const InvoiceAddressPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  
  const token = useAuthStore(s => s.token);
  const { list, updateInvoiceAddress } = useInvoiceStore();
  const invoice = list.find(i => i.id === id);

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<DaDataSuggestion[]>([]);
  const [searching, setSearching] = useState(false);

  // Инициализация текущим адресом
  useEffect(() => {
    if (invoice?.addressText) {
      setQuery(invoice.addressText);
    }
  }, [invoice]);

  // Поиск через DaData (Debounce внутри логики ввода)
  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length > 2) {
      setSearching(true);
      const res = await dadataApi.getSuggestions(text);
      setSuggestions(res);
      setSearching(false);
    } else {
      setSuggestions([]);
    }
  };

  // Выбор адреса
  const handleSelect = async (addr: string) => {
    if (token && id) {
      await updateInvoiceAddress(token, id, addr);
      history.goBack(); // Возвращаемся назад автоматически
    }
  };

  // Геолокация (GPS)
  const handleGeo = async () => {
    setSearching(true);
    try {
      // 1. Получаем координаты
      const coordinates = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = coordinates.coords;
      
      // 2. Ищем адрес по координатам
      const suggestion = await dadataApi.geolocate(latitude, longitude);
      
      if (suggestion) {
        setQuery(suggestion.value);
        setSuggestions([suggestion]); // Показываем как единственный результат
      }
    } catch (e) {
      console.warn("User denied geo or error", e);
      // Не ломаем UI, просто перестаем крутить спиннер
    } finally {
      setSearching(false);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={`/app/invoices/${id}`} text="Назад" />
          </IonButtons>
          <IonTitle>Изменение адреса</IonTitle>
        </IonToolbar>
        <IonToolbar>
            <IonSearchbar 
                value={query} 
                onIonInput={e => handleSearch(e.detail.value!)}
                placeholder="Введите адрес..."
                debounce={500}
            />
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* Кнопка "Определить местоположение" */}
        <div style={{ padding: '0 16px 16px' }}>
            <IonButton expand="block" fill="outline" onClick={handleGeo} disabled={searching}>
                <IonIcon slot="start" icon={navigateOutline} />
                Определить моё местоположение
            </IonButton>
        </div>

        {searching && <div className="ion-text-center ion-padding"><IonSpinner /></div>}

        <IonList lines="full">
          {suggestions.map((s) => (
            <IonItem key={s.value} button onClick={() => handleSelect(s.value)}>
              <IonIcon icon={locationOutline} slot="start" color="medium" />
              <IonLabel className="ion-text-wrap">
                <h2>{s.value}</h2>
                <p>{s.data.city || 'Населенный пункт'}</p>
              </IonLabel>
              {s.value === invoice?.addressText && (
                  <IonIcon icon={checkmarkCircleOutline} slot="end" color="success" />
              )}
            </IonItem>
          ))}

          {/* Если ничего не найдено, но введен текст - можно сохранить как есть */}
          {suggestions.length === 0 && query.length > 5 && !searching && (
            <IonItem button onClick={() => handleSelect(query)}>
               <IonIcon icon={checkmarkCircleOutline} slot="start" color="primary" />
               <IonLabel>
                 <h3>Использовать: "{query}"</h3>
                 <p>Сохранить адрес как введен</p>
               </IonLabel>
            </IonItem>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};