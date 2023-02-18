import { useState, useEffect } from "react";

export default function useDateTime() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return dateTime;
}
