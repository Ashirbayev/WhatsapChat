import React, { useState } from "react";
import './AuthPage.css';

const AuthPage = ({ onLogin }) => {
    const [idInstance, setIdInstance] = useState("");
    const [apiTokenInstance, setApiTokenInstance] = useState("");

    const handleLogin = () => {
        if (idInstance && apiTokenInstance) {
            // Сохраняем данные в Local Storage
            localStorage.setItem("idInstance", idInstance);
            localStorage.setItem("apiTokenInstance", apiTokenInstance);

            // Передаем данные дальше через onLogin
            onLogin({ idInstance, apiTokenInstance });
        } else {
            alert("Пожалуйста, заполните все поля.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1>Авторизация</h1>
                <input
                    type="text"
                    placeholder="idInstance"
                    value={idInstance}
                    onChange={(e) => setIdInstance(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="apiTokenInstance"
                    value={apiTokenInstance}
                    onChange={(e) => setApiTokenInstance(e.target.value)}
                />
                <button onClick={handleLogin}>Войти</button>
            </div>
        </div>
    );
};

export default AuthPage;
