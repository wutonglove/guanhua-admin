import axios from 'axios';
import { RESPONSE_OK } from './config';

export default function(data) {
    let url = '/api/xiti/v1/auth/loginuser';
    return new Promise((resolve, reject) => {
        axios
            .post(url, data)
            .then(function(response) {
                if (+response.data.code === RESPONSE_OK) {
                    resolve(response.data);
                } else {
                    reject(response.data.data);
                }
            })
            .catch(function(err) {
                reject('登陆失败！');
            });
    });
}
