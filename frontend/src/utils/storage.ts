export const storage = {
    get<T>(key: string): T | null {
        try {const item = localStorage.getItem(key);
            return item ? JSON.parse(item) as T : null;
        } catch (error) {
            console.error(`[storage] Error de lectura "${key}"`, error);
            return null;
        }
    },

    set<T>(key: string, value: T): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`[storage] Error de escritura "${key}"`, error);
        }
    },
    remove(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`[storage] Error "${key}"`, error);
        }
    }
};