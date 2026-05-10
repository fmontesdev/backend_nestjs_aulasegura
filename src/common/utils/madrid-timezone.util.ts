export const APPLICATION_TIME_ZONE = 'Europe/Madrid';

const MADRID_DATE_TIME_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  timeZone: APPLICATION_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  fractionalSecondDigits: 3,
  hour12: false,
});

type DateTimeParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
};

function getMadridParts(date: Date): DateTimeParts {
  const parts = MADRID_DATE_TIME_FORMATTER.formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
    millisecond: Number(values.fractionalSecond ?? 0),
  };
}

function getMadridOffsetMs(date: Date): number {
  const parts = getMadridParts(date);
  const madridAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
    parts.millisecond,
  );

  return madridAsUtc - date.getTime();
}

function madridLocalPartsToDate(parts: DateTimeParts): Date {
  const utcGuess = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
    parts.millisecond,
  );
  const firstOffset = getMadridOffsetMs(new Date(utcGuess));
  const firstUtc = utcGuess - firstOffset;
  const finalOffset = getMadridOffsetMs(new Date(firstUtc));

  return new Date(utcGuess - finalOffset);
}

function parseTime(time: string): Pick<DateTimeParts, 'hour' | 'minute' | 'second' | 'millisecond'> {
  const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(time);
  if (!match) {
    throw new Error('Time must use HH:MM or HH:MM:SS format');
  }

  return {
    hour: Number(match[1]),
    minute: Number(match[2]),
    second: Number(match[3] ?? 0),
    millisecond: 0,
  };
}

function getDateParts(date: Date | string): Pick<DateTimeParts, 'year' | 'month' | 'day'> {
  if (typeof date === 'string') {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
    if (!match) {
      throw new Error('Date must start with YYYY-MM-DD format');
    }

    return {
      year: Number(match[1]),
      month: Number(match[2]),
      day: Number(match[3]),
    };
  }

  const madridParts = getMadridParts(date);
  return {
    year: madridParts.year,
    month: madridParts.month,
    day: madridParts.day,
  };
}

export function combineMadridDateAndTime(date: Date | string, time: string): Date {
  return madridLocalPartsToDate({
    ...getDateParts(date),
    ...parseTime(time),
  });
}

export function parseMadridDateTime(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?/.exec(value);
  if (!match) {
    throw new Error('Date time must start with YYYY-MM-DDTHH:MM[:SS[.SSS]] format');
  }

  return madridLocalPartsToDate({
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4]),
    minute: Number(match[5]),
    second: Number(match[6] ?? 0),
    millisecond: Number((match[7] ?? '0').padEnd(3, '0')),
  });
}

export function toMadridIsoString(date: Date): string {
  const parts = getMadridParts(date);
  const offsetMs = getMadridOffsetMs(date);
  const offsetSign = offsetMs >= 0 ? '+' : '-';
  const absoluteOffsetMinutes = Math.abs(offsetMs) / 60000;
  const offsetHours = Math.floor(absoluteOffsetMinutes / 60);
  const offsetMinutes = absoluteOffsetMinutes % 60;
  const pad = (value: number, length = 2): string => value.toString().padStart(length, '0');

  return `${pad(parts.year, 4)}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}:${pad(parts.second)}.${pad(parts.millisecond, 3)}${offsetSign}${pad(offsetHours)}:${pad(offsetMinutes)}`;
}

export function getMadridDayOfWeek(date: Date | string): number {
  const parts = getDateParts(date);
  const day = new Date(Date.UTC(parts.year, parts.month - 1, parts.day)).getUTCDay();

  return day === 0 ? 7 : day;
}

export function getMadridTimeString(date: Date): string {
  const parts = getMadridParts(date);
  const pad = (value: number): string => value.toString().padStart(2, '0');

  return `${pad(parts.hour)}:${pad(parts.minute)}:${pad(parts.second)}`;
}
