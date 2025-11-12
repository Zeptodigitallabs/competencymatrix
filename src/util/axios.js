import axios from 'axios';

export default function axiosConfig() {
    const instance = axios.create({ baseURL: window.BASE_URL });

    const IP = sessionStorage.getItem('ip');
    const platform = sessionStorage.getItem('platform');
    const AppCode = "LMS";
    const AppVersion = "1";
    const isRemember = localStorage.getItem('remember')

    instance.defaults.headers.common['AppCode'] = AppCode;
    instance.defaults.headers.common['DeviceCode'] = IP;
    instance.defaults.headers.common['AppVersion'] = AppVersion;

    (function () {
        let token = sessionStorage.getItem('token');
        if (token) {
            instance.defaults.headers.common['Token'] = token;
            instance.interceptors.response.use(response => response, error => {
                const status = error.response ? error.response.status : null
                if (status === 401) {
                    let config = {
                        headers: {
                            'AppCode': AppCode,
                            'DeviceCode': IP
                        },
                        auth: {
                            username: localStorage.getItem('userName'),
                            password: localStorage.getItem('password'),
                        }
                    }
                    axios.post(`${window.BASE_URL}AuthenticateUser`, {}, config).then(async response => {
                        error.config.headers['Token'] = response.headers.token;
                        sessionStorage.setItem('token', response.headers.token);
                        // sessionStorage.setItem('token', response.headers.token)
                        return axios.request(error.config);
                    }).catch(error => {
                       // if (isRemember === false || isRemember === null) {
                            localStorage.clear();
                            sessionStorage.clear();
                            if (platform === 'null')
                                window.location = `/?platform=${platform}`;
                            else
                                window.location = '/'
                     //   }
                    })
                }
                return Promise.reject(error);
            });

        } else {
            delete instance.defaults.headers.common['Token'];
            //delete instance.interceptors;
            instance.interceptors.response.use(response => response, error => {
                const status = error.response ? error.response.status : null
                if (status === 401 && error.response.config.url !== 'AuthenticateUser') {
                    if (isRemember === false || isRemember === null) {
                        localStorage.clear();
                        sessionStorage.clear();
                        if (platform === 'null')
                            window.location = `/?platform=${platform}`;
                        else
                            window.location = '/'
                    }
                }
                return Promise.reject(error);
            })
        }
    })();


    return instance;
}

