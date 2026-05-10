import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { NotificationResponseDto } from '../../presentation/dto/responses/notification.response.dto';

@Injectable()
export class NotificationEventEmitter {
  private readonly notificationSubject = new Subject<NotificationResponseDto>();

  emit(notification: NotificationResponseDto): void {
    this.notificationSubject.next(notification);
  }

  asObservable(): Observable<NotificationResponseDto> {
    return this.notificationSubject.asObservable();
  }
}
