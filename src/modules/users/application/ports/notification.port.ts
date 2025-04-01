import { User } from "../../domain/entities/user.entity"

/**
 * Interfaz para el servicio de notificaciones.
 * Define los métodos que deben implementarse para enviar notificaciones
 * relacionadas con los usuarios.
 */

export interface NotificationPort {
    /**
     * Envía una notificación al usuario cuando se crea.
     */
    sendUserCreatedNotification(user: User): Promise<void>;

    /**
     * Envía una notificación al usuario cuando se actualiza.
     */
    sendUserUpdatedNotification(user: User): Promise<void>;
}

/**
 * Identificador del servicio de notificaciones.
 */

export const NOTIFICATION_SERVICE = "NOTIFICATION_SERVICE";