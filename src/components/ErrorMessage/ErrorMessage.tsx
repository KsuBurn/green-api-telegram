import type { FC, ReactNode } from 'react';
import { Alert } from 'antd';

interface ErrorMessageProps {
    children: ReactNode;
    className?: string;
}
export const ErrorMessage: FC<ErrorMessageProps> = ({ children, className }) => {
    return <Alert type="error" showIcon title={children} className={className} role="alert" />;
};
