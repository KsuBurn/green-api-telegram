import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';

import { LoginForm } from './components/LoginForm/LoginForm.tsx';
import { useState } from 'react';
import { ChatWorkspace } from './components/ChatWorkspace/ChatWorkspace.tsx';
import { greenApi } from './api/greenApi.ts';

function App() {
    const [isConnected, setIsConnected] = useState(false);

    const handleLogout = () => {
        greenApi.clearSession();
        setIsConnected(false);
    };

    return (
        <ConfigProvider
            locale={ruRU}
            theme={{
                token: {
                    colorPrimary: '#3390ec',
                    borderRadius: 12,
                    fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                },
            }}
        >
            {isConnected ? (
                <ChatWorkspace onLogout={handleLogout} />
            ) : (
                <LoginForm onConnect={() => setIsConnected(true)} />
            )}
        </ConfigProvider>
    );
}

export default App;
