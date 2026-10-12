import { type FC, useState } from 'react';

import { Badge, Button } from 'antd';
import { PlusOutlined, TelegramFilled } from '@ant-design/icons';
import styles from './ChatWorkspace.module.css';
import { ChatConversationSpace } from '../ChatConversationSpace/ChatConversationSpace.tsx';
import { CreateNewChatForm } from '../CreateNewChatForm/CreateNewChatForm.tsx';
import { ChatsList } from '../ChatsList/ChatsList.tsx';
import { useChat } from '../../hooks/useChat.ts';

interface ChatWorkspaceProps {
    onLogout: () => void;
}

export const ChatWorkspace: FC<ChatWorkspaceProps> = ({ onLogout }) => {
    const {
        chats,
        activeId,
        setActiveId,
        createChat,
        send,
        sending,
        sendError,
        pollError,
        stopped,
        restartPolling,
    } = useChat();

    const [showNewChatForm, setShowNewChatForm] = useState(false);

    const chat = chats.find((item) => item.id === activeId);

    return (
        <main className={styles.workspace}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <TelegramFilled className={styles.smallBrand} />
                    <div>
                        <h1>Telegram Chat</h1>
                        <p>GREEN-API</p>
                    </div>
                </div>
                <div className={styles.sidebarTools}>
                    <h2>
                        Сообщения <Badge showZero color="#3390ec" />
                    </h2>
                    <Button
                        type="text"
                        shape="circle"
                        icon={<PlusOutlined />}
                        title="Новый чат"
                        aria-label="Новый чат"
                        onClick={() => setShowNewChatForm((value) => !value)}
                    />
                </div>
                {showNewChatForm && (
                    <CreateNewChatForm
                        createChat={createChat}
                        setShowNewChatForm={setShowNewChatForm}
                    />
                )}
                <ChatsList chats={chats} activeId={activeId} setActiveId={setActiveId} />
                <footer className={styles.sidebarFooter}>
                    <Badge />
                    <Button type="link" className={styles.textButton} onClick={onLogout}>
                        Выйти
                    </Button>
                </footer>
            </aside>
            <ChatConversationSpace
                chat={chat}
                pollError={pollError}
                send={send}
                sendError={sendError}
                sending={sending}
                stopped={stopped}
                restartPolling={restartPolling}
                setShowNewChatForm={setShowNewChatForm}
                setActiveId={setActiveId}
            />
        </main>
    );
};
