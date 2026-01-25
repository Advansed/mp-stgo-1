// src/pages/auth/LoginPage.tsx
import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
  IonToast,
} from '@ionic/react';
import { personOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logInOutline } from 'ionicons/icons';
import { post } from '../../api/http';
import { useAuthStore } from '../../store/authStore';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const history = useHistory();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return login.trim().length > 0 && password.length > 0 && !loading;
  }, [login, password, loading]);

  const handleLogin = async () => {
  if (!canSubmit) return;

  setLoading(true);
  setErrorMsg(null);

  try {
    const res: any = await post('login', { login: login.trim(), password });

    // поддержим оба варианта, чтобы не гадать
    const token = res?.data?.token ?? res?.token;
    const success = res?.success === true || !!token;

    if (success && token) {
      // сохраняем так же, как в проекте принято
      setAuth(token, res?.data ?? res);
      history.replace('/app/invoices');
    } else {
      setErrorMsg(res?.message || 'Неверный логин или пароль');
    }
  } catch (e: any) {
    console.error(e);
    setErrorMsg(e?.message || 'Ошибка соединения с сервером');
  } finally {
    setLoading(false);
  }
};

  const onEnter = (e: any) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <IonPage className="login-page">
      <IonContent fullscreen scrollY={false}>
        <div className="login-screen">
          
          <div className="login-content-wrapper">
            {/* Header */}
            <div className="login-header">
              <div className="logo-container">
                <img
                  src="/logo-login.png"
                  alt="Logo"
                  className="login-logo-img"
                  draggable={false}
                />
              </div>
              <h1 className="login-title">С возвращением!</h1>
              <p className="login-subtitle">Введите данные для входа</p>
            </div>

            {/* Form */}
            <div className="login-form">
              
              {/* Login Field */}
              <div className="input-group">
                <div className="login-field">
                  <IonIcon icon={personOutline} className="field-icon" />
                  <IonInput
                    className="custom-input"
                    value={login}
                    onIonInput={(e) => setLogin(String(e.detail.value || ''))}
                    placeholder="Логин"
                    type="text"
                    inputMode="text"
                    onKeyDown={onEnter}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="input-group">
                <div className="login-field">
                  <IonIcon icon={lockClosedOutline} className="field-icon" />
                  <IonInput
                    className="custom-input"
                    value={password}
                    onIonInput={(e) => setPassword(String(e.detail.value || ''))}
                    placeholder="Пароль"
                    type={showPass ? 'text' : 'password'}
                    onKeyDown={onEnter}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPass(!showPass)}
                  >
                    <IonIcon icon={showPass ? eyeOffOutline : eyeOutline} />
                  </button>
                </div>
              </div>

              <IonButton
                className="submit-btn"
                expand="block"
                disabled={!canSubmit}
                onClick={handleLogin}
              >
                {loading ? <IonSpinner name="crescent" color="light" /> : 'Войти в систему'}
                {!loading && <IonIcon slot="end" icon={logInOutline} style={{marginLeft: 8}} />}
              </IonButton>

              <div className="login-footnote">
                Забыли пароль? Обратитесь к администратору
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="login-footer">
            STNG © {new Date().getFullYear()} v2.0
          </div>

        </div>

        {/* Toasts */}
        <IonToast
          isOpen={!!errorMsg}
          message={errorMsg || ''}
          duration={3000}
          onDidDismiss={() => setErrorMsg(null)}
          color="danger"
          position="top"
          cssClass="custom-toast"
          buttons={[{ icon: 'close', role: 'cancel' }]}
        />
      </IonContent>
    </IonPage>
  );
};