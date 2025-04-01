import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as sendgrid from "@sendgrid/mail";
import { NotificationPort } from "src/modules/users/application/ports/notification.port";
import { User } from "src/modules/users/domain/entities/user.entity";

/**
 * * Implementación del puerto de notificación utilizando SendGrid.
 * * Proporciona métodos para enviar notificaciones por correo electrónico.
 */
@Injectable()
export class EmailNotificationService implements NotificationPort {
  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('email.apiKey');
    sendgrid.setApiKey(apiKey);
  }

    /**
     * Envía una notificación al usuario cuando se crea.
     * @param user - El usuario al que se enviará la notificación.
     */
  async sendUserCreatedNotification(user: User): Promise<void> {
    const msg = {
      to: user.email,
      from: this.configService.get<string>('email.from'),
      subject: 'Bienvenido a nuestra aplicación',
      text: `Hola ${user.fullName}, ¡gracias por registrarte en nuestra aplicación!`,
      html: `<p>Hola <strong>${user.fullName}</strong>, ¡gracias por registrarte en nuestra aplicación!</p>`,
    };

    /**
     * * * Si ocurre un error durante el envío, se registra en la consola.
     */
    try {
      await sendgrid.send(msg);
    } catch (error) {
      console.error('Error sending user created notification:', error);
      throw new Error('Failed to send user created notification');
    }
  }

  /**
   * Envía una notificación al usuario cuando se actualiza. 
   *
   * * @param user - El usuario al que se enviará la notificación.
   */
  async sendUserUpdatedNotification(user: User): Promise<void> {
    const msg = {
      to: user.email,
      from: this.configService.get<string>('email.from'),
      subject: 'Tu perfil ha sido actualizado',
      text: `Hola ${user.fullName}, tu perfil ha sido actualizado exitosamente.`,
      html: `<p>Hola <strong>${user.fullName}</strong>, tu perfil ha sido actualizado exitosamente.</p>`,
    };

    /**
     * * * Si ocurre un error durante el envío, se captura y se registra en la consola.
     */
    try {
      await sendgrid.send(msg);
    } catch (error) {
      console.error('Error sending user updated notification:', error);
      throw new Error('Failed to send user updated notification');
    }
  }
}

