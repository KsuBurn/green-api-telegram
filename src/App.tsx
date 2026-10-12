import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';

// import { LoginForm } from './components/LoginForm/LoginForm.tsx';
import { ChatWorkspace } from './components/ChatWorkspace/ChatWorkspace.tsx';

function App() {
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
            <ChatWorkspace />
        </ConfigProvider>
    );
}

export default App;
