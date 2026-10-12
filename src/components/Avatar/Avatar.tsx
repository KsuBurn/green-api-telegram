import type { FC } from 'react'
import { Avatar as AntAvatar } from 'antd';
import styles from './Avatar.module.css';

interface AvatarProps {
    name: string;
}

export const Avatar: FC<AvatarProps> = ({ name }) => {
    const initials = name.replace(/^[+@]/, '').slice(0, 2).toUpperCase();

    return (
        <AntAvatar size={48} className={styles.avatar} aria-hidden="true">
            {initials}
        </AntAvatar>
    )
}
