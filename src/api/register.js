import axios from 'axios';
import { RESPONSE_OK } from './config';

export default function(data, url) {
    return new Promise((resolve, reject) => {
        axios
            .post(url, data)
            .then(function(response) {
                let code = response.data.code;
                if (code === RESPONSE_OK) {
                    resolve(data);
                } else if (code === '-1'){
                    reject('用户名已经存在');
                }
            })
            .catch(function(err) {
                reject(err);
            });
    });
}
