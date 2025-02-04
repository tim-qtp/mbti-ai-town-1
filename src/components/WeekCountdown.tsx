import { useState, useEffect } from 'react';

export function WeekCountdown() {
  const [timeRemaining, setTimeRemaining] = useState<{ days: number; hours: number }>({
    days: 0,
    hours: 0,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const weekEnd = new Date(2025, 1, 11, 14, 0, 0); // Feb 4th, 2025 at 14:00 PM

      // Calculate time difference
      const timeDiff = weekEnd.getTime() - now.getTime();

      // If time has passed, don't show countdown
      if (timeDiff <= 0) {
        setTimeRemaining({ days: 0, hours: 0 });
        return;
      }

      // Calculate days and hours
      const days = Math.floor(timeDiff / (1000 * 3600 * 24));
      const hours = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));

      setTimeRemaining({
        days: Math.max(0, days),
        hours: Math.max(0, hours),
      });
    };

    // Initial calculation
    calculateTimeRemaining();

    // Update every minute for more precision
    const updateInterval = setInterval(calculateTimeRemaining, 60 * 1000);

    return () => clearInterval(updateInterval);
  }, []);

  // If no time remaining, don't render anything
  if (timeRemaining.days <= 0 && timeRemaining.hours <= 0) return null;

  return (
    <div className="bg-green-500 text-white px-2 py-1  text-sm">
      {timeRemaining.days > 0 && (
        <span>
          {timeRemaining.days} day{timeRemaining.days !== 1 ? 's' : ''}{' '}
        </span>
      )}
      {timeRemaining.hours > 0 && (
        <span>
          {timeRemaining.hours} hour{timeRemaining.hours !== 1 ? 's' : ''}
        </span>
      )}
      <span> left</span>
    </div>
  );
}
