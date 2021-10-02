import store from '../store/index';
import router from "../router";

const checkAuth = () => {
    if (store.state.token) {
        let nowDate = new Date();
        if (store.state.expires_in > nowDate.getTime().toString()) {
            router.push({
                name: 'Home'
            });
        } else {
            // TODO: refresh token
            store.commit('clearToken');
            store.commit('clearExpiry');
        }
    }
};

const isAuth = () => {
    if (store.state.token) {
        let nowDate = new Date();
        return store.state.expires_in > nowDate.getTime().toString();
    }

    return false;
};

const authHelpers = {
    checkAuth,
    isAuth
};

export default authHelpers;