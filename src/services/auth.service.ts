import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { API_CONFIG } from "../config/api.config";

@Injectable()
export class AuthService {
    
    constructor(public http: HttpClient) {    
    }

    authenticate(cred : CredenciaisDTO) {
        return this.http.post(
          `${API_CONFIG.baseUrl}/login`,
          cred,
          {
            observe: 'response',
            responseType: 'text'
          });
    }
}