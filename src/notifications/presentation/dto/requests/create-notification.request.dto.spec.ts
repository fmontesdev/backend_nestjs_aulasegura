import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RoleName } from '../../../../users/domain/enums/rolename.enum';
import { NotificationTargetMode } from '../../../application/dto/create-manual-notification.dto';
import { NotificationType } from '../../../domain/entities/notification.entity';
import { CreateNotificationRequest } from './create-notification.request.dto';

describe('CreateNotificationRequest', () => {
  it('trims title and body', async () => {
    const dto = plainToInstance(CreateNotificationRequest, {
      type: NotificationType.WARNING,
      title: '  Mantenimiento programado  ',
      body: '  El sistema no estará disponible.  ',
      target: { mode: NotificationTargetMode.ALL },
    });

    await expect(validate(dto)).resolves.toHaveLength(0);
    expect(dto.title).toBe('Mantenimiento programado');
    expect(dto.body).toBe('El sistema no estará disponible.');
  });

  it('rejects invalid notification types', async () => {
    const dto = plainToInstance(CreateNotificationRequest, {
      type: 'invalid',
      title: 'Aviso',
      body: 'Contenido',
      target: { mode: NotificationTargetMode.ALL },
    });

    const errors = await validate(dto);

    expect(errors).toEqual(expect.arrayContaining([expect.objectContaining({ property: 'type' })]));
  });

  it('rejects invalid target modes', async () => {
    const dto = plainToInstance(CreateNotificationRequest, {
      type: NotificationType.WARNING,
      title: 'Aviso',
      body: 'Contenido',
      target: { mode: 'invalid' },
    });

    const errors = await validate(dto);

    expect(errors[0].children).toEqual(expect.arrayContaining([expect.objectContaining({ property: 'mode' })]));
  });

  it('requires userId for user targets', async () => {
    const dto = plainToInstance(CreateNotificationRequest, {
      type: NotificationType.WARNING,
      title: 'Aviso',
      body: 'Contenido',
      target: { mode: NotificationTargetMode.USER },
    });

    const errors = await validate(dto);

    expect(errors[0].children).toEqual(expect.arrayContaining([expect.objectContaining({ property: 'userId' })]));
  });

  it('requires and normalizes roleName for role targets', async () => {
    const dto = plainToInstance(CreateNotificationRequest, {
      type: NotificationType.WARNING,
      title: 'Aviso',
      body: 'Contenido',
      target: { mode: NotificationTargetMode.ROLE, roleName: 'TEACHER' },
    });

    await expect(validate(dto)).resolves.toHaveLength(0);
    expect(dto.target.roleName).toBe(RoleName.TEACHER);
  });

  it('respects title and body length limits', async () => {
    const dto = plainToInstance(CreateNotificationRequest, {
      type: NotificationType.WARNING,
      title: 'a'.repeat(101),
      body: 'b'.repeat(256),
      target: { mode: NotificationTargetMode.ALL },
    });

    const errors = await validate(dto);

    expect(errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ property: 'title' }), expect.objectContaining({ property: 'body' })]),
    );
  });
});
