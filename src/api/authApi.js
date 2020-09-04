import axios from 'axios';
import {base_api_url, base_new_api_url} from '../config/config';

class AuthApi {

  static signIn(user) {
    return axios.post(`${base_new_api_url}/admin/signin`, user);
  }

  static forget(user) {
    return axios.post(`${base_api_url}/admin/forgot_password`, user);
  }

  static password_reset(user) {
    return axios.post(`${base_api_url}/admin/update_password_via_email`, user);
  }

  static checkCode(code) {
    return axios.get(`${base_api_url}/admin/reset/${code}`);
  }
  
}

export default AuthApi;