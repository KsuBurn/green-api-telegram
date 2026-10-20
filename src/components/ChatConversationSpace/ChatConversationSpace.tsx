import type { FC } from 'react';
import styles from './ChatConversationSpace.module.css';
import { Button, Tag } from 'antd';
import type { Chat } from '../../types.ts';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage.tsx';
import { Conversation } from '../Conversation/Conversation.tsx';
import { Avatar } from '../Avatar/Avatar.tsx';

interface ChatConversationSpaceProps {
    chat: Chat | undefined;
    pollError: string | null;
    setActiveId: (activeId: string | null) => void;
    send: (text: string) => Promise<boolean>;
    sendError: string | null;
    sending: boolean;
    stopped: boolean;
    restartPolling: () => void;
    setShowNewChatForm: (val: boolean) => void;
}

export const ChatConversationSpace: FC<ChatConversationSpaceProps> = ({
    chat,
    pollError,
    setActiveId,
    send,
    sendError,
    sending,
    stopped,
    restartPolling,
    setShowNewChatForm,
}) => {
    return (
        <section className={styles.conversation} aria-label="Диалог">
            <header className={styles.conversationHeader}>
                {chat ? (
                    <>
                        <Button
                            type="text"
                            shape="circle"
                            className={styles.backButton}
                            icon={<ArrowLeftOutlined />}
                            aria-label="К списку чатов"
                            onClick={() => setActiveId(null)}
                        />
                        <Avatar name={chat.name} />
                        <div>
                            <h2>{chat.name}</h2>
                            <p>Telegram · текстовые сообщения</p>
                        </div>
                    </>
                ) : (
                    <div>
                        <h2>Ваши сообщения</h2>
                        <p>Простой интерфейс для общения</p>
                    </div>
                )}
                <Tag color="blue" className={styles.headerPill}>
                    TELEGRAM
                </Tag>
            </header>
            {pollError && (
                <ErrorMessage className={styles.banner}>
                    {pollError}
                    {stopped && (
                        <Button type="link" size="small" onClick={restartPolling}>
                            Повторить получение
                        </Button>
                    )}
                </ErrorMessage>
            )}
            {sendError && <ErrorMessage className={styles.banner}>{sendError}</ErrorMessage>}
            {chat ? (
                <Conversation key={chat.id} chat={chat} sending={sending} onSend={send} />
            ) : (
                <div className={styles.welcome}>
                    <p>Создайте чат по номеру телефона или выберите диалог слева.</p>
                    <Button type="primary" onClick={() => setShowNewChatForm(true)}>
                        Начать разговор
                    </Button>
                </div>
            )}
        </section>
    );
};
