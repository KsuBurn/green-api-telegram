import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Документация по настройке Vite: https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
});
