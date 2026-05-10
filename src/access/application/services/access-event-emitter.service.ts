import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { AccessLogEntity } from '../../domain/entities/access-log.entity';

@Injectable()
export class AccessEventEmitter {
  private readonly accessLogSubject = new Subject<AccessLogEntity>();

  emit(accessLog: AccessLogEntity): void {
    this.accessLogSubject.next(accessLog);
  }

  asObservable(): Observable<AccessLogEntity> {
    return this.accessLogSubject.asObservable();
  }
}
