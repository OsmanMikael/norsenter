import React, { useState, useEffect } from "react";

// Typer for API-svaret
interface PrayerTimesData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface MonthlyPrayerDay {
  date: {
    readable: string;
  };
  timings: PrayerTimesData;
}

const PrayerTimes: React.FC = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData>(
    {} as PrayerTimesData
  );
  const [monthlyPrayerTimes, setMonthlyPrayerTimes] = useState<
    MonthlyPrayerDay[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<string>("");
  const [showMonthly, setShowMonthly] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [year] = useState<number>(new Date().getFullYear());

  // Nedtelling
  const [nextPrayer, setNextPrayer] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<string>("");

  // Hent dagens bønnetider
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const response = await fetch(
          "https://api.aladhan.com/v1/timingsByCity?city=Oslo&country=Norway&method=2&school=1&timezone=Europe/Oslo"
        );
        const data = await response.json();

        // Fjern (CET) fra tider
        const timings = data.data.timings;
        const cleanedTimings: PrayerTimesData = {} as PrayerTimesData;
        for (const key in timings) {
          if (timings.hasOwnProperty(key)) {
            cleanedTimings[key as keyof PrayerTimesData] = timings[key].replace(
              / \([A-Z]+\)/g,
              ""
            );
          }
        }

        setPrayerTimes(cleanedTimings);
        setDate(data.data.date.readable);
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  // Nedtelling til neste bønn
  useEffect(() => {
    if (!prayerTimes || !prayerTimes.Fajr) return;

    const updateCountdown = () => {
      const now = new Date();
      const prayerOrder: { name: string; time: string }[] = [
        { name: "Fajr", time: prayerTimes.Fajr },
        { name: "Sunrise", time: prayerTimes.Sunrise },
        { name: "Dhuhr", time: prayerTimes.Dhuhr },
        { name: "Asr", time: prayerTimes.Asr },
        { name: "Maghrib", time: prayerTimes.Maghrib },
        { name: "Isha", time: prayerTimes.Isha },
      ];

      // Konverter til dato-objekter for i dag
      const todayPrayers = prayerOrder.map((p) => {
        const [hour, minute] = p.time.split(":").map(Number);
        const d = new Date(now);
        d.setHours(hour, minute, 0, 0);
        return { ...p, date: d };
      });

      // Finn neste bønn
      let next = todayPrayers.find((p) => p.date > now);

      if (!next) {
        // Alle dagens bønner er passert → neste bønn er Fajr neste dag
        const [hour, minute] = prayerTimes.Fajr.split(":").map(Number);
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(hour, minute, 0, 0);
        next = { name: "Fajr", time: prayerTimes.Fajr, date: tomorrow };
      }

      setNextPrayer(next.name);

      // Beregn tid igjen
      const diffMs = next.date.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}t ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [prayerTimes]);

  // Hent månedlige bønnetider
  const fetchMonthlyPrayerTimes = async (month: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/calendarByCity?city=Oslo&country=Norway&method=2&school=1&month=${month}&year=${year}&timezone=Europe/Oslo`
      );
      const data = await response.json();

      const cleanedMonthlyTimings = data.data.map((day: any) => {
        const cleanedDayTimings: PrayerTimesData = {} as PrayerTimesData;
        for (const key in day.timings) {
          if (day.timings.hasOwnProperty(key)) {
            cleanedDayTimings[key as keyof PrayerTimesData] = day.timings[
              key
            ].replace(/ \([A-Z]+\)/g, "");
          }
        }
        return {
          ...day,
          timings: cleanedDayTimings,
        };
      });

      setMonthlyPrayerTimes(cleanedMonthlyTimings);
      setShowMonthly(true);
      setLoading(false);
    } catch (err) {
      console.error("API Error:", err);
      setError((err as Error).message);
      setLoading(false);
    }
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const month = parseInt(event.target.value);
    setSelectedMonth(month);
    fetchMonthlyPrayerTimes(month);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="prayer-times">
      <h2>Bønnetider</h2>
      <p>{date}</p>

      {/* Nedtelling */}
      {nextPrayer && (
        <div className="countdown">
          <h3>Neste bønn: {nextPrayer}</h3>
          <p>Tid igjen: {timeLeft}</p>
        </div>
      )}

      {!showMonthly && (
        <>
          <table>
            <thead>
              <tr>
                <th>Bønn</th>
                <th>Tid</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Fajr</td>
                <td>{prayerTimes.Fajr}</td>
              </tr>
              <tr>
                <td>Soloppgang</td>
                <td>{prayerTimes.Sunrise}</td>
              </tr>
              <tr>
                <td>Dhuhr</td>
                <td>{prayerTimes.Dhuhr}</td>
              </tr>
              <tr>
                <td>Asr</td>
                <td>{prayerTimes.Asr}</td>
              </tr>
              <tr>
                <td>Maghrib</td>
                <td>{prayerTimes.Maghrib}</td>
              </tr>
              <tr>
                <td>Isha</td>
                <td>{prayerTimes.Isha}</td>
              </tr>
            </tbody>
          </table>
          <button onClick={() => fetchMonthlyPrayerTimes(selectedMonth)}>
            Vis tider for hele måneden
          </button>
        </>
      )}

      {showMonthly && (
        <div>
          <h3>Bønnetider for hele måneden</h3>
          <label htmlFor="month">Velg måned:</label>
          <select id="month" value={selectedMonth} onChange={handleMonthChange}>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                {new Date(year, i).toLocaleString("no-NO", { month: "long" })}
              </option>
            ))}
          </select>
          <table>
            <thead>
              <tr>
                <th>Dato</th>
                <th>Fajr</th>
                <th>Soloppgang</th>
                <th>Dhuhr</th>
                <th>Asr</th>
                <th>Maghrib</th>
                <th>Isha</th>
              </tr>
            </thead>
            <tbody>
              {monthlyPrayerTimes.map((day, index) => (
                <tr key={index}>
                  <td>{day.date.readable}</td>
                  <td>{day.timings.Fajr}</td>
                  <td>{day.timings.Sunrise}</td>
                  <td>{day.timings.Dhuhr}</td>
                  <td>{day.timings.Asr}</td>
                  <td>{day.timings.Maghrib}</td>
                  <td>{day.timings.Isha}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setShowMonthly(false)}>
            Skjul månedlige tider
          </button>
        </div>
      )}
    </div>
  );
};

export default PrayerTimes;
