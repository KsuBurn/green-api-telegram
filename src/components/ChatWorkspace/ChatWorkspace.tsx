import { type FC, useState } from 'react';

import { Badge, Button } from 'antd';
import {
    PlusOutlined,
    TelegramFilled,
} from '@ant-design/icons';
import styles from './ChatWorkspace.module.css';
import { ChatConversationSpace } from '../ChatConversationSpace/ChatConversationSpace.tsx'
import { CreateNewChatForm } from '../CreateNewChatForm/CreateNewChatForm.tsx'
import { ChatsList } from '../ChatsList/ChatsList.tsx'

export const ChatWorkspace: FC = () => {
    const [showNewChatForm, setSowNewChatForm] = useState(false);
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
                        onClick={() => setSowNewChatForm((value) => !value)}
                    />
                </div>
                {showNewChatForm &&
                    <CreateNewChatForm />
                }
                <ChatsList/>
                <footer className={styles.sidebarFooter}>
                    <Badge />
                    <Button type="link" className={styles.textButton}>
                        Выйти
                    </Button>
                </footer>
            </aside>
            <ChatConversationSpace />
        </main>
    );
};
