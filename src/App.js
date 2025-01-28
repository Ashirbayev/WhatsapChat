import React, { useState } from "react";
import AuthPage from "./components/AuthPage";
import WhatsAppChat from "./components/ WhatsAppChat";


function App() {
    const [credentials, setCredentials] = useState(null);

    return (
        <div className="App">
            {!credentials ? (
                <AuthPage onLogin={setCredentials} />
            ) : (
                <WhatsAppChat credentials={credentials} />
            )}
        </div>
    );
}

export default App;
