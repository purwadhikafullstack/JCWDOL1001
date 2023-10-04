import { useEffect, useState } from "react";

export default function Countdown({ expired }) {
  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());

  useEffect(() => {
    const timer = setInterval(() => {
      const newRemainingTime = calculateRemainingTime();
      setRemainingTime(newRemainingTime);

      if (newRemainingTime <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  function calculateRemainingTime() {
    const expiredTime = new Date(expired).getTime();
    const currentTime = new Date().getTime();
    const differenceInSeconds = Math.floor((expiredTime - currentTime) / 1000);
    return Math.max(0, differenceInSeconds);
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${String(hours).padStart(2, "0")} : ${String(minutes).padStart(2, "0")} : ${String(remainingSeconds).padStart(2, "0")}`;
  };

  return (
    <div>
      {remainingTime > 0 ? (
        <p>{formatTime(remainingTime)}</p>
      ) : (
        <p className="text-danger">Transaksi dibatalkan</p>
      )}
    </div>
  );
}
