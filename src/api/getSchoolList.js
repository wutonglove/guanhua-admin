import axios from 'axios';
import { RESPONSE_OK } from './config';

export default function(data) {
    let url = '/api/xiti/v1/resource/queryallschoolinfo';
    return new Promise((resolve, reject) => {
        axios
            .post(url, data)
            .then(response => {
                if (+response.data.code === RESPONSE_OK)
                    resolve(response.data.data);
                else reject('请求失败！');
            })
            .catch(() => {
                reject('请求失败！');
            });
    });
}
