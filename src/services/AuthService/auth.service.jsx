//axios
import axiosConfig from "../../util/axios";
import { StoreUserData } from "../../util/commonfunctions";
//store
// import { store } from '../../store/index'
// import * as action from '../../store/actions'


export default class AuthService {

    static getGetIP(
        onSuccess,
        onError,
    ) {
        return axiosConfig().get('AppCore/GetIP')
            .then(async response => {
                sessionStorage.setItem('ip', response.data);
                onSuccess()
            })
            .catch((error) => {
                sessionStorage.setItem('ip', " 127.0.0.1");
                onError(error)
            })
    }


    static loginWithCredentials(
        auth,
        onSuccess,
        onError,
        onFinal,
    ) {
        let TOKEN = sessionStorage.getItem('token');
        return axiosConfig().post('AuthenticateUser',
            {
                token: TOKEN ? TOKEN : '',
                forcelogout: auth.isLogout
            },
            {
                auth: {
                    username: auth.username,
                    password: auth.password
                }
            })
            .then(response => {
                sessionStorage.setItem('token', response.data.authToken);
                if (auth.isRemember) {
                    StoreUserData(auth.username, auth.password, true)
                }
                onSuccess(response)
            })
            .catch((error) => {
                if (auth.isRemember === false) {
                    localStorage.clear();
                    sessionStorage.clear();
                }
                onError(error)
            })
            .finally(onFinal);
    }


    static logout(
        onSuccess,
        onError,
    ) {
        return axiosConfig().post('/logout', null)
            .then(async response => {
                //await store.dispatch(action.logoutUser())
                localStorage.clear();
                sessionStorage.clear();
                onSuccess()
            })
            .catch((error) => {
                onError(error)
            })


    }


}