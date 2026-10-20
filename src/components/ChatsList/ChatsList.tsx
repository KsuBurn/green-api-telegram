import type { FC } from 'react';
import styles from './ChatsList.module.css';
import { Button, Empty } from 'antd';
import type { Chat } from '../../types.ts';
import { Avatar } from '../Avatar/Avatar.tsx';

interface ChatsListProps {
    chats: Chat[];
    activeId: string | null;
    setActiveId: (activeId: string) => void;
}

export const ChatsList: FC<ChatsListProps> = ({ chats, activeId, setActiveId }) => {
    return (
        <div className={styles.chatList}>
            {chats.length === 0 ? (
                <Empty
                    className={styles.noChats}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Здесь появятся ваши диалоги"
                />
            ) : (
                chats.map((item) => (
                    <Button
                        type="text"
                        key={item.id}
                        className={`${styles.chatItem} ${item.id === activeId ? styles.active : ''}`}
                        onClick={() => setActiveId(item.id)}
                    >
                        <Avatar name={item.name} />
                        <span className={styles.chatSummary}>
                            <span className={styles.chatName}>{item.name}</span>
                            <span className={styles.chatPreview}>
                                {item.messages.at(-1)?.text ?? 'Пока нет сообщений'}
                            </span>
                        </span>
                    </Button>
                ))
            )}
        </div>
    );
};
