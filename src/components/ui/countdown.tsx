import { FC, useEffect, useState } from "react";

interface ICountdownProps {
  targetDate: Date;
}

const Countdown: FC<ICountdownProps> = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const timeDiff = targetDate.getTime() - now.getTime();
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clear the timer on component unmount
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-[4px]">
      <div className="flex w-[48px] items-center justify-center rounded-[6px] bg-[#ffffff14] py-[8px] text-[14px] font-medium leading-[17.85px] md:w-[52px] md:py-[11px]">
        {timeLeft.days}d
      </div>
      <div className="flex w-[48px] items-center justify-center rounded-[6px] bg-[#ffffff14] py-[8px] text-[14px] font-medium leading-[17.85px] md:w-[52px] md:py-[11px]">
        {timeLeft.hours}h
      </div>
      <div className="flex w-[48px] items-center justify-center rounded-[6px] bg-[#ffffff14] py-[8px] text-[14px] font-medium leading-[17.85px] md:w-[52px] md:py-[11px]">
        {timeLeft.minutes}m
      </div>
    </div>
  );
};

export { Countdown };
