import type { FC } from 'react';
import styles from './LoginForm.module.css';
import { Button, Form, Input, Typography } from 'antd';
import { TelegramFilled } from '@ant-design/icons';

export const LoginForm: FC = () => {
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
                    // disabled={isConnecting}
                    initialValues={{ apiUrl: 'https://4100.api.green-api.com' }}
                    // onFinish={handleConnect}
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
                    {/*{error && <ErrorMessage className={styles.errorBlock}>{error}</ErrorMessage>}*/}
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
