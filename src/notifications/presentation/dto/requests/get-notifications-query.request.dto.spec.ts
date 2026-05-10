import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { GetNotificationsQueryRequest } from './get-notifications-query.request.dto';

describe('GetNotificationsQueryRequest', () => {
  it('parses read=false query param as boolean false', async () => {
    const dto = plainToInstance(
      GetNotificationsQueryRequest,
      { read: 'false' },
      { enableImplicitConversion: true },
    );

    await expect(validate(dto)).resolves.toHaveLength(0);
    expect(dto.read).toBe(false);
  });

  it('parses read=true query param as boolean true', async () => {
    const dto = plainToInstance(
      GetNotificationsQueryRequest,
      { read: 'true' },
      { enableImplicitConversion: true },
    );

    await expect(validate(dto)).resolves.toHaveLength(0);
    expect(dto.read).toBe(true);
  });
});
