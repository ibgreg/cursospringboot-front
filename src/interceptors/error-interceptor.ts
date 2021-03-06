import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { StorageService } from "../services/storage.service";
import { AlertController } from "ionic-angular";
import { FieldMessage } from "../models/fieldmessage";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(public storage: StorageService, public alertCtrl: AlertController){
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {   
        return next.handle(req)
        .catch((error, caught) => {
            let errorObj = error;
            if (errorObj.error) {
                errorObj = errorObj.error;
            }

            if (!errorObj.status) {
                errorObj = JSON.parse(errorObj);
            }

            console.log("Erro detectado pelo interceptor");
            console.log(errorObj);

            switch (errorObj.status) {
                case 401:
                    this.handleUnauthorized();
                    break;
                case 403:
                    this.handleForbidden();
                    break;
                case 422:
                    this.handleUnprocessableEntity(errorObj);
                    break;
                default:
                    this.handleDefaultError(errorObj);
            }
            
            return Observable.throw(errorObj);
        }) as any;
    }

    handleForbidden() {
        this.storage.setLocalUser(null);
    }

    handleUnauthorized() {
        let alert = this.alertCtrl.create({
            title: 'Falha de autenticação',
            message: 'Email ou senha incorretos!',
            enableBackdropDismiss: false,
            buttons: [
                { text: 'OK' }
            ]
        });
        alert.present();
    }

    handleUnprocessableEntity(errorObj) {
        let alert = this.alertCtrl.create({
            title: 'Erro ao cadastrar',
            message: this.listErrors(errorObj.errors),
            enableBackdropDismiss: false,
            buttons: [
                { text: 'OK' }
            ]
        });

        alert.present();
    }

    handleDefaultError(errorObj) {
        let alert = this.alertCtrl.create({
            title: `Erro ${errorObj.status}: ${errorObj.error}`,
            message: errorObj.message,
            enableBackdropDismiss: false,
            buttons: [
                { text: 'OK' }
            ]
        });
        alert.present();
    }

    private listErrors(messages : FieldMessage[]) : string {
        let str : string = '';

        for (let i = 0; i < messages.length; i++) {
            str = str + '<p><strong>' + messages[i].fieldName + '</strong>: ' + messages[i].message + '</p>';
            
        }

        return str;
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
};