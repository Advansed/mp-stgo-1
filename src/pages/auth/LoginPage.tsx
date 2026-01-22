// src/pages/auth/LoginPage.tsx
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonPage, IonContent, IonSpinner, IonToast } from '@ionic/react';
import { post } from '../../api/http';
import { useAuthStore } from '../../store/authStore';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const setAuth = useAuthStore((s) => s.setAuth);
  const history = useHistory();

  const handleLogin = async () => {
    if (!login || !password) return;
    setLoading(true);
    setErrorMsg(null);

    const res = await post('login', { login, password });
    console.log('Login res:', res);

    setLoading(false);
    if (res.success && res.data?.token) {
      setAuth(res.data.token, res.data);
      history.replace('/app/invoices'); 
    } else {
      setErrorMsg(res.message || 'Ошибка входа');
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-bg">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h1>🚀 Мобильный инспектор</h1>
              <p>Сахатранснефтегаз</p>
            </div>
            
            <div className="login-form">
              <input 
                className="mobile-input"
                placeholder="Логин"
                value={login}
                onChange={e => setLogin(e.target.value)}
              />
              <input 
                className="mobile-input"
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              
              <button 
                className="mobile-login-btn"
                disabled={loading}
                onClick={handleLogin}
              >
                {loading ? <IonSpinner name="dots" /> : 'Войти'}
              </button>
            </div>
            
            <IonToast 
              isOpen={!!errorMsg} 
              message={errorMsg!} 
              duration={2000} 
              onDidDismiss={() => setErrorMsg(null)}
              color="danger"
            />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};