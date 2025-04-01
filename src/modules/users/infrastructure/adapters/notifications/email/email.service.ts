import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as sendgrid from "@sendgrid/mail";
import { NotificationPort } from "src/modules/users/application/ports/notification.port";
import { User } from "src/modules/users/domain/entities/user.entity";

//** Simula el envío de notificaciones mostrando la información en la consola.
// */
@Injectable()
export class ConsoleNotificationService implements NotificationPort {
  constructor(private configService: ConfigService) {}

  /**
   * Simula el envío de una notificación al usuario cuando se crea.
   * @param user - El usuario al que se enviaría la notificación.
   */
  async sendUserCreatedNotification(user: User): Promise<void> {
    const from = this.configService.get<string>('email.from') || 'test@example.com';
    
    console.log('---------------------------------------');
    console.log('EMAIL NOTIFICATION - USER CREATED');
    console.log('From:', from);
    console.log('To:', user.email);
    console.log('Subject: Bienvenido a nuestra aplicación');
    console.log('Content: Hola ' + user.fullName + ', ¡gracias por registrarte en nuestra aplicación!');
    console.log('---------------------------------------');
  }

  /**
   * Simula el envío de una notificación al usuario cuando se actualiza.
   * @param user - El usuario al que se enviaría la notificación.
   */
  async sendUserUpdatedNotification(user: User): Promise<void> {
    const from = this.configService.get<string>('email.from') || 'test@example.com';
    
    console.log('---------------------------------------');
    console.log('EMAIL NOTIFICATION - USER UPDATED');
    console.log('From:', from);
    console.log('To:', user.email);
    console.log('Subject: Tu perfil ha sido actualizado');
    console.log('Content: Hola ' + user.fullName + ', tu perfil ha sido actualizado exitosamente.');
    console.log('---------------------------------------');
  }
}