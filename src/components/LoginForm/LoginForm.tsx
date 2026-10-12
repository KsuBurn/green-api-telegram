import { type FC, useRef, useState } from 'react';
import styles from './LoginForm.module.css';
import { Button, Form, Input, Typography } from 'antd';
import { TelegramFilled } from '@ant-design/icons';
import type { Credentials } from '../../types.ts';
import { greenApi } from '../../api/greenApi.ts';
import { errorMessage } from '../../utils/validation.ts';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage.tsx';

interface LoginFormProps {
    onConnect: () => void;
}

export const LoginForm: FC<LoginFormProps> = ({ onConnect }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState('');
    const connectionLock = useRef(false);

    const handleConnect = async (values: Credentials) => {
        if (connectionLock.current) {
            return;
        }
        connectionLock.current = true;
        setIsConnecting(true);
        setError('');
        try {
            greenApi.configure({
                idInstance: values.idInstance.trim(),
                apiTokenInstance: values.apiTokenInstance.trim(),
                apiUrl: values.apiUrl.trim(),
            });
            await greenApi.connect(new AbortController().signal);
            onConnect();
        } catch (err) {
            greenApi.clearSession();
            setError(errorMessage(err));
        } finally {
            connectionLock.current = false;
            setIsConnecting(false);
        }
    }

    return (
        <main className={styles.loginPage}>
            <section className={styles.loginCard}>
                <TelegramFilled className={styles.telegram} />
                <Typography.Title level={3} className={styles.eyebrow}>
                    TELEGRAM & GREEN-API
                </Typography.Title>
                <Typography.Paragraph type="secondary" className={styles.intro}>
                    Простой чат для отправки и получения сообщений из вашего Telegram.
                </Typography.Paragraph>
                <Form
                    layout="vertical"
                    requiredMark={false}
                    size="large"
                    disabled={isConnecting}
                    initialValues={{ apiUrl: 'https://4100.api.green-api.com' }}
                    onFinish={handleConnect}
                >
                    <Form.Item
                        name="idInstance"
                        label="ID инстанса"
                        rules={[
                            { required: true, whitespace: true, message: 'Введите ID инстанса' },
                        ]}
                    >
                        <Input autoComplete="off" inputMode="numeric" placeholder="4100…" />
                    </Form.Item>
                    <Form.Item
                        name="apiTokenInstance"
                        label="API токен"
                        rules={[{ required: true, whitespace: true, message: 'Введите API токен' }]}
                    >
                        <Input.Password autoComplete="off" placeholder="apiTokenInstance" />
                    </Form.Item>
                    <Form.Item
                        name="apiUrl"
                        label="Адрес API"
                        rules={[
                            { required: true, message: 'Введите адрес API' },
                            { type: 'url', message: 'Введите корректный URL' },
                        ]}
                    >
                        <Input autoComplete="off" />
                    </Form.Item>
                    <Typography.Paragraph type="secondary" className={styles.fieldHelp}>
                        Скопируйте idInstance, apiTokenInstance и apiUrl из кабинета GREEN-API для
                        Telegram.
                    </Typography.Paragraph>
                    {error && <ErrorMessage className={styles.errorBlock}>{error}</ErrorMessage>}
                    <Button type="primary" htmlType="submit" block>
                        Подключить Telegram
                    </Button>
                </Form>
                <p className={styles.securityNote}>
                    Токен используется только в этой сессии и не сохраняется в браузере.
                </p>
            </section>
        </main>
    );
};
