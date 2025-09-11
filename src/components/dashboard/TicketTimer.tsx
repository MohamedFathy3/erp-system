import { useEffect, useState } from 'react';

const TicketTimer = ({ status, ticketId }: { status: string; ticketId: string }) => {
  const [seconds, setSeconds] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  // عند تحميل المكون، نحاول قراءة startTime من localStorage
  useEffect(() => {
    const savedStart = localStorage.getItem(`ticketTimerStart_${ticketId}`);

    if (savedStart) {
      setStartTime(Number(savedStart));
    } else if (status === 'open') {
      const now = Date.now();
      localStorage.setItem(`ticketTimerStart_${ticketId}`, now.toString());
      setStartTime(now);
    }
  }, [status, ticketId]);

  // نحسب الوقت الذي مضى من وقت البداية
  useEffect(() => {
    if (!startTime) return;

    const updateTime = () => {
      const now = Date.now();
      const diffSeconds = Math.floor((now - startTime) / 1000);
      setSeconds(diffSeconds);
    };

    updateTime(); // احسب مرة مباشرة

    const interval = setInterval(() => {
      if (status === 'open') {
        updateTime();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, status]);

  const format = (n: number) => n.toString().padStart(2, '0');
  const hrs = format(Math.floor(seconds / 3600));
  const mins = format(Math.floor((seconds % 3600) / 60));
  const secs = format(seconds % 60);

  return (
    <div className="text-sm text-gray-600 dark:text-gray-400">
      ⏱️ {hrs}:{mins}:{secs}
    </div>
  );
};

export default TicketTimer;
