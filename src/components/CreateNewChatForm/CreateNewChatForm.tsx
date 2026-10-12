import { type FC, useRef, useState } from 'react';
import styles from './CreateNewChatForm.module.css';
import { Button, Form, Input } from 'antd';
import { errorMessage } from '../../utils/validation.ts';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage.tsx';

interface CreateNewChatFormProps {
    createChat: (value: string) => Promise<void>;
    setShowNewChatForm: (value: boolean) => void;
}

export const CreateNewChatForm: FC<CreateNewChatFormProps> = ({
    createChat,
    setShowNewChatForm,
}) => {
    const creatingLock = useRef(false);
    const [creating, setCreating] = useState(false);
    const [recipient, setRecipient] = useState('');
    const [recipientError, setRecipientError] = useState('');

    const handleCreateChat = async () => {
        if (creatingLock.current) {
            return;
        }
        creatingLock.current = true;
        setCreating(true);
        setRecipientError('');
        try {
            await createChat(recipient);
            setRecipient('');
            setShowNewChatForm(false);
        } catch (err) {
            setRecipientError(errorMessage(err));
        } finally {
            creatingLock.current = false;
            setCreating(false);
        }
    }

    return (
        <Form
            layout="vertical"
            requiredMark={false}
            className={styles.recipientForm}
            onFinish={handleCreateChat}
        >
            <Form.Item label="Новый диалог" extra="Номер с кодом страны или имя в Telegram">
                <Input
                    autoFocus
                    aria-label="Получатель"
                    placeholder="+7 999 123-45-67 или @username"
                    value={recipient}
                    disabled={creating}
                    onChange={(event) => setRecipient(event.target.value)}
                />
            </Form.Item>
            {recipientError && (
                <ErrorMessage className={styles.errorBlock}>{recipientError}</ErrorMessage>
            )}
            <Button
                type="primary"
                htmlType="submit"
                block
                loading={creating}
                disabled={!recipient.trim()}
            >
                Создать чат
            </Button>
        </Form>
    );
};
