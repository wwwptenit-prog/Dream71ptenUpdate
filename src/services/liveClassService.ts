import { LiveClassSession } from '../types';

export function getLiveSessionDynamicStatus(
  session: Partial<LiveClassSession> | null | undefined
): 'scheduled' | 'live_now' | 'completed' | 'cancelled' {
  if (!session || !session.date || !session.time) {
    return 'scheduled';
  }

  try {
    const sessionDateTime = new Date(`${session.date}T${session.time}`);
    if (isNaN(sessionDateTime.getTime())) {
      return 'scheduled';
    }

    const now = new Date();
    const duration = (session.durationMinutes || 90) * 60 * 1000;
    const sessionEndTime = new Date(sessionDateTime.getTime() + duration);

    // If current time is within [start, end]
    if (now >= sessionDateTime && now <= sessionEndTime) {
      return 'live_now';
    } else if (now > sessionEndTime) {
      return 'completed';
    } else {
      return 'scheduled';
    }
  } catch {
    return 'scheduled';
  }
}

export function formatBanglaLiveSchedule(dateStr: string, timeStr: string): string {
  try {
    const d = new Date(`${dateStr}T${timeStr}`);
    if (isNaN(d.getTime())) {
      return `${dateStr} ${timeStr}`;
    }

    const toBnDigits = (num: number | string) => {
      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return String(num).replace(/\d/g, d => bnDigits[parseInt(d, 10)] || d);
    };

    const months = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];

    const day = toBnDigits(d.getDate());
    const month = months[d.getMonth()];
    const year = toBnDigits(d.getFullYear());

    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? (hours >= 18 ? 'রাত' : hours >= 15 ? 'বিকেল' : 'দুপুর') : (hours >= 6 ? 'সকাল' : 'রাত');
    hours = hours % 12 || 12;

    const timeFormatted = `${ampm} ${toBnDigits(hours)}:${minutes < 10 ? '০' : ''}${toBnDigits(minutes)} মি.`;

    return `${day} ${month}, ${year} (${timeFormatted})`;
  } catch {
    return `${dateStr} ${timeStr}`;
  }
}
