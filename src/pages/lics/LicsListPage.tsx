import React, { useEffect, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, 
  IonSearchbar, IonList, IonItem, IonLabel, IonIcon, IonSpinner, 
  IonButtons, IonButton, IonChip, IonFab, IonFabButton, IonRefresher, IonRefresherContent,
  IonAlert
} from '@ionic/react';
import { 
  walletOutline, locationOutline, homeOutline, 
  businessOutline, arrowBackOutline, navigateOutline, 
  layersOutline, add, trashOutline, checkmarkCircle 
} from 'ionicons/icons';
import { useAuthStore } from '../../store/authStore';
import { useLicsSearchStore } from '../../store/licsSearchStore';
import { useLicsStore } from '../../store/licsStore';
import { formatAddress } from '../../utils/licsFormat';
import './LicsListPage.css';

export const LicsListPage: React.FC = () => {
  const token = useAuthStore(s => s.token);
  const history = useHistory();
  const { list: myLics, loading: myLoading, fetchLics, addLicToUser, deleteLicFromUser } = useLicsStore();
  const searchStore = useLicsSearchStore();

  const [isSearchMode, setIsSearchMode] = useState(false);
  const [query, setQuery] = useState('');
  const [alertInfo, setAlertInfo] = useState<{isOpen: boolean, header: string, msg: string}>({ isOpen: false, header: '', msg: '' });
  
  //  ИЗМЕНЕНИЕ: Вместо true/false храним КОД текущего счета
  // null = ничего не добавляется
  // '12345' = добавляется счет 12345
  const [addingCode, setAddingCode] = useState<string | null>(null);

  useEffect(() => {
    if (token) fetchLics(token);
  }, [token]);

  useEffect(() => { setQuery(''); }, [searchStore.step]);

  const filteredSearchItems = useMemo(() => {
    const q = query.toLowerCase();
    switch (searchStore.step) {
      case 'settlement': return searchStore.settlements.filter(s => s.settlement.toLowerCase().includes(q));
      case 'street': return searchStore.streets.filter(s => s.street.toLowerCase().includes(q));
      case 'house': return searchStore.houses.filter(h => h.house.toLowerCase().includes(q));
      case 'apartment': return searchStore.apartments.filter(a => a.apartment.toLowerCase().includes(q));
      case 'lics': return searchStore.lics;
      default: return [];
    }
  }, [searchStore.step, searchStore.settlements, searchStore.streets, searchStore.houses, searchStore.apartments, searchStore.lics, query]);

  const handleItemClick = (item: any) => {
    if (!token) return;
    if (searchStore.step === 'settlement') searchStore.selectSettlement(token, item);
    else if (searchStore.step === 'street') searchStore.selectStreet(token, item);
    else if (searchStore.step === 'house') searchStore.selectHouse(item);
    else if (searchStore.step === 'apartment') searchStore.selectApartment(item);
  };

  const handleSelectLic = async (lic: any) => {
     // Если что-то уже добавляется - выходим
     if(!token || addingCode !== null) return;
     
     const licCode = lic.code || lic.account || lic.lic;
     if (!licCode) {
         setAlertInfo({ isOpen: true, header: 'Ошибка', msg: 'Некорректные данные' });
         return;
     }

     setAddingCode(licCode); // Блокируем только этот код
     
     // Передаем ВЕСЬ объект
     const result = await addLicToUser(token, lic);
     
     setAddingCode(null); // Разблокируем
     
     if (result.success) {
         setIsSearchMode(false);
         searchStore.resetSearch();
     } else {
         if (result.message !== 'Уже добавлен') {
            setAlertInfo({ isOpen: true, header: 'Ошибка', msg: result.message || 'Ошибка сервера' });
         }
     }
  };

  const handleDelete = async (lic: any) => {
      if(!token) return;
      const code = lic.code || lic.account || lic.lic;
      await deleteLicFromUser(token, code);
  };

  const isAlreadyAdded = (lic: any) => {
      const code = lic.code || lic.account || lic.lic;
      return myLics.some(m => (m.code || m.account) === code);
  };

  // ----------------------------------------------------
  // РЕЖИМ ПОИСКА (ADD MODE)
  // ----------------------------------------------------
  if (isSearchMode) {
      return (
        <IonPage className="lics-page">
          <IonHeader className="ion-no-border">
            <IonToolbar color="light">
              <IonButtons slot="start">
                <IonButton onClick={searchStore.step === 'settlement' ? () => setIsSearchMode(false) : searchStore.goBack}>
                  <IonIcon icon={arrowBackOutline} />
                </IonButton>
              </IonButtons>
              <IonTitle>Поиск счета</IonTitle>
            </IonToolbar>
            
            {searchStore.step !== 'settlement' && (
                <div className="breadcrumbs-container">
                    {searchStore.selectedSettlement && <IonChip>{searchStore.selectedSettlement.settlement}</IonChip>}
                    {searchStore.selectedStreet && <IonChip>{searchStore.selectedStreet.street}</IonChip>}
                    {searchStore.selectedHouse && <IonChip>{searchStore.selectedHouse.house}</IonChip>}
                </div>
            )}
            
            {searchStore.step !== 'lics' && (
                <IonToolbar color="light" style={{paddingBottom: 5}}>
                   <IonSearchbar value={query} onIonInput={e => setQuery(e.detail.value!)} placeholder="Поиск..." />
                </IonToolbar>
            )}
          </IonHeader>

          <IonContent fullscreen>
             {searchStore.loading && <div className="ion-text-center ion-padding"><IonSpinner /></div>}

             <IonList lines="none" style={{background: 'transparent', padding: 16}}>
                {/* СПИСОК НАСЕЛЕННЫХ ПУНКТОВ / УЛИЦ / ДОМОВ */}
                {searchStore.step !== 'lics' && filteredSearchItems.map((item: any, idx) => (
                    <IonItem key={`${item.type}-${idx}`} button onClick={() => handleItemClick(item)} className="result-item" detail={false}>
                        <div className="item-icon-wrapper">
                            <IonIcon icon={searchStore.step === 'settlement' ? locationOutline : searchStore.step === 'street' ? businessOutline : homeOutline} />
                        </div>
                        <IonLabel>
                            <h2>{item.settlement || item.street || item.house || item.apartment}</h2>
                            <p>{item.ulus || 'Выбрать'}</p>
                        </IonLabel>
                        <IonIcon icon={navigateOutline} slot="end" color="medium" style={{opacity: 0.3}} />
                    </IonItem>
                ))}

                {/* СПИСОК ЛИЦЕВЫХ СЧЕТОВ (ФИНАЛ) */}
                {searchStore.step === 'lics' && filteredSearchItems.map((lic: any) => {
                    // Данные счета
                    const code = lic.code || lic.account || lic.lic;
                    const key = lic.id || code || Math.random().toString();
                    const added = isAlreadyAdded(lic);
                    
                    // Проверка: крутится ли ЭТОТ КОНКРЕТНЫЙ счет?
                    const isThisLoading = addingCode === code;
                    
                    return (
                        <div key={key} className="lic-card">
                             <div className="lic-number">{code}</div>
                             <div className="lic-fio">
                                <IonIcon icon={layersOutline} style={{marginRight: 6}}/>
                                {lic.fio || lic.owner || 'ФИО не указано'}
                             </div>
                             
                             {added ? (
                                 <IonButton expand="block" color="success" fill="outline" disabled>
                                     <IonIcon icon={checkmarkCircle} slot="start" />
                                     Уже добавлен
                                 </IonButton>
                             ) : (
                                 <IonButton 
                                    expand="block" 
                                    onClick={() => handleSelectLic(lic)}
                                    // Блокируем, если ЧТО-ТО добавляется (неважно что)
                                    disabled={addingCode !== null} 
                                 >
                                     {isThisLoading ? <IonSpinner name="crescent" /> : 'Добавить этот счет'}
                                 </IonButton>
                             )}
                        </div>
                    );
                })}

                {!searchStore.loading && filteredSearchItems.length === 0 && (
                    <div className="ion-text-center ion-padding" style={{color: '#999'}}>Ничего не найдено</div>
                )}
             </IonList>
             
             <IonAlert 
                isOpen={alertInfo.isOpen} 
                onDidDismiss={() => setAlertInfo({...alertInfo, isOpen: false})}
                header={alertInfo.header}
                message={alertInfo.msg}
                buttons={['OK']}
             />
          </IonContent>
        </IonPage>
      );
  }

  // ----------------------------------------------------
  // ГЛАВНЫЙ СПИСОК
  // ----------------------------------------------------
  return (
    <IonPage className="lics-page">
      <IonHeader className="ion-no-border">
        <IonToolbar color="light"><IonTitle style={{fontWeight: 700}}>Лицевые счета</IonTitle></IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={e => { if(token) fetchLics(token); e.detail.complete(); }}>
            <IonRefresherContent />
        </IonRefresher>

        <div style={{padding: 16}}>
            {myLoading && <div className="ion-text-center"><IonSpinner /></div>}
            
            {!myLoading && myLics.length === 0 && (
                <div style={{textAlign: 'center', marginTop: 100, color: '#666'}}>
                    <IonIcon icon={walletOutline} style={{fontSize: 48, opacity: 0.3}} />
                    <h3>Список пуст</h3>
                    <p>Нажмите + чтобы добавить счет</p>
                </div>
            )}

            {myLics.map((lic) => {
                const uniqueKey = lic.id || lic.code || lic.account || Math.random().toString();
                const code = String(lic.account || lic.lic || lic.code || '').trim();
                const address = formatAddress(lic.address_go ?? lic.address);

                const openDetails = () => {
                    if (!code) return;
                    history.push(`/app/lics/${encodeURIComponent(code)}`);
                };

                return (
                    <div
                        key={uniqueKey}
                        className="lic-card"
                        onClick={openDetails}
                        style={{ cursor: code ? 'pointer' : 'default' }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openDetails(); }}
                    >
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <div>
                                <div className="lic-number">{code || '—'}</div>
                                <div className="lic-fio">{lic.fio || lic.owner || lic.name || 'ФИО не указано'}</div>
                            </div>
                            <IonButton
                                fill="clear"
                                color="danger"
                                onClick={(e) => { e.stopPropagation(); handleDelete(lic); }}
                            >
                                <IonIcon slot="icon-only" icon={trashOutline} />
                            </IonButton>
                        </div>
                        {!!address && <div className="lic-address">{address}</div>}
                    </div>
                );
            })}
        </div>

        <IonFab vertical="bottom" horizontal="end" slot="fixed" style={{ marginBottom: 90, marginRight: 16 }}>
            <IonFabButton onClick={() => { setIsSearchMode(true); if(token) searchStore.loadSettlements(token); }} className="corporate-fab-button">
                <IonIcon icon={add} />
            </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};
