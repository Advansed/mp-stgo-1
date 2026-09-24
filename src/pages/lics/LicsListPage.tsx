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
  businessOutline, arrowBackOutline, navigateOutline, add
} from 'ionicons/icons';
import { useAuthStore } from '../../store/authStore';
import { useLicsSearchStore } from '../../store/licsSearchStore';
import { useLicsStore } from '../../store/licsStore';
import { getLicCode } from '../../utils/licsFormat';
import { LicCard } from './LicCard';
import './LicsListPage.css';

export const LicsListPage: React.FC = () => {
  const token = useAuthStore(s => s.token);
  const history = useHistory();
  const { list: myLics, loading: myLoading, fetchLics, addLicToUser, deleteLicFromUser } = useLicsStore();
  const searchStore = useLicsSearchStore();

  const [isSearchMode, setIsSearchMode] = useState(false);
  const [query, setQuery] = useState('');
  const [alertInfo, setAlertInfo] = useState<{isOpen: boolean, header: string, msg: string}>({ isOpen: false, header: '', msg: '' });
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
     if(!token || addingCode !== null) return;

     const licCode = lic.code || lic.account || lic.lic;
     if (!licCode) {
         setAlertInfo({ isOpen: true, header: 'Ошибка', msg: 'Некорректные данные' });
         return;
     }

     setAddingCode(licCode);

     const result = await addLicToUser(token, lic);

     setAddingCode(null);

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
      const code = getLicCode(lic);
      await deleteLicFromUser(token, code);
  };

  const isAlreadyAdded = (lic: any) => {
      const code = getLicCode(lic);
      return myLics.some(m => getLicCode(m) === code);
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

             <IonList lines="none" className="lics-search-list">
                {searchStore.step !== 'lics' && filteredSearchItems.map((item: any, idx) => (
                    <IonItem key={`${item.type}-${idx}`} button onClick={() => handleItemClick(item)} className="result-item" detail={false}>
                        <div className="item-icon-wrapper">
                            <IonIcon icon={searchStore.step === 'settlement' ? locationOutline : searchStore.step === 'street' ? businessOutline : homeOutline} />
                        </div>
                        <IonLabel>
                            <h2>{item.settlement || item.street || item.house || item.apartment}</h2>
                            <p>{item.ulus || 'Выбрать'}</p>
                        </IonLabel>
                        <IonIcon icon={navigateOutline} slot="end" color="medium" className="result-item-nav" />
                    </IonItem>
                ))}

                {searchStore.step === 'lics' && filteredSearchItems.map((lic: any) => {
                    const code = getLicCode(lic);
                    const key = lic.id || code || Math.random().toString();

                    return (
                        <LicCard
                            key={key}
                            mode="search"
                            lic={lic}
                            added={isAlreadyAdded(lic)}
                            loading={addingCode === code}
                            disabled={addingCode !== null}
                            onAdd={() => handleSelectLic(lic)}
                        />
                    );
                })}

                {!searchStore.loading && filteredSearchItems.length === 0 && (
                    <div className="lics-empty-hint">Ничего не найдено</div>
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
        <IonToolbar color="light"><IonTitle className="lics-page-title">Лицевые счета</IonTitle></IonToolbar>
      </IonHeader>

      <IonContent fullscreen scrollY>
        <IonRefresher slot="fixed" onIonRefresh={e => { if(token) fetchLics(token); e.detail.complete(); }}>
            <IonRefresherContent />
        </IonRefresher>

        <div className="lics-list">
            {myLoading && myLics.length === 0 && (
              <div className="ion-text-center"><IonSpinner /></div>
            )}

            {!myLoading && myLics.length === 0 && (
                <div className="lics-empty">
                    <IonIcon icon={walletOutline} className="lics-empty-icon" />
                    <h3>Список пуст</h3>
                    <p>Нажмите + чтобы добавить счет</p>
                </div>
            )}

            {myLics.map((lic) => {
                const code = getLicCode(lic);
                const uniqueKey = String(lic.id || code);

                return (
                    <LicCard
                        key={uniqueKey}
                        lic={lic}
                        onOpen={() => {
                            if (!code) return;
                            history.push(`/app/lics/${encodeURIComponent(code)}`);
                        }}
                        onDelete={() => handleDelete(lic)}
                    />
                );
            })}
        </div>

        <IonFab vertical="bottom" horizontal="end" slot="fixed" className="lics-fab">
            <IonFabButton onClick={() => { setIsSearchMode(true); if(token) searchStore.loadSettlements(token); }} className="corporate-fab-button">
                <IonIcon icon={add} />
            </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );

};
