import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { API_CONFIG } from "../config/api.config";
import { StorageService } from "./storage.service";
import { LocalUser } from "../models/local_user";

@Injectable()
export class AuthService {
    
    constructor(public http: HttpClient, public storage: StorageService) {    
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

    successfulLogin(authorizationValue : string) {
        let tok = authorizationValue.substring(7);
        let user : LocalUser = {
          token: tok
        };

        this.storage.setLocalUser(user);
    }

    logout() {
        this.storage.setLocalUser(null);
    }
}