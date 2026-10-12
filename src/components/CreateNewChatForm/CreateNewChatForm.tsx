import type { FC } from 'react'
import styles from './CreateNewChatForm.module.css'
import { Button, Form, Input } from 'antd'

export const CreateNewChatForm: FC = () => {
    return (
        <Form
            layout="vertical"
            requiredMark={false}
            className={styles.recipientForm}
        >
            <Form.Item label="Новый диалог" extra="Номер с кодом страны или имя в Telegram">
                <Input
                    autoFocus
                    aria-label="Получатель"
                    placeholder="+7 999 123-45-67 или @username"
                />
            </Form.Item>
            <Button
                type="primary"
                htmlType="submit"
                block
            >
                Создать чат
            </Button>
        </Form>
    )
}
