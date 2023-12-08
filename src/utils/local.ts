export const LocalUtils = {
    get(key: string) {
        return localStorage.getItem(key);
    },

    set(key: string, value: string | any) {
        localStorage.setItem(key, value);
    },

    remove(key: string) {
        return localStorage.removeItem(key);
    },

    clear() {
        localStorage.clear();
        sessionStorage.clear();
    },
};

export default LocalUtils;
