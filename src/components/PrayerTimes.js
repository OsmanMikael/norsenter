import React, { useState, useEffect } from 'react';

const PrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState({});
  const [monthlyPrayerTimes, setMonthlyPrayerTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [date, setDate] = useState('');
  const [showMonthly, setShowMonthly] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [year] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const response = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Oslo&country=Norway&method=2&school=1&timezone=Europe/Oslo');
        const data = await response.json();
        console.log('API Response:', data); // Log the entire response for debugging

        // Remove (CET) from timings using regex
        const timings = data.data.timings;
        const cleanedTimings = {};
        for (const key in timings) {
          if (timings.hasOwnProperty(key)) {
            cleanedTimings[key] = timings[key].replace(/ \([A-Z]+\)/g, '');
          }
        }

        setPrayerTimes(cleanedTimings);
        setDate(data.data.date.readable); // Set the date from the API response
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err); // Log the error for debugging
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  const fetchMonthlyPrayerTimes = async (month) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.aladhan.com/v1/calendarByCity?city=Oslo&country=Norway&method=2&school=1&month=${month}&year=${year}&timezone=Europe/Oslo`);
      const data = await response.json();
      console.log('Monthly API Response:', data); // Log the entire response for debugging

      // Remove (CET) from monthly timings using regex
      const cleanedMonthlyTimings = data.data.map(day => {
        const cleanedDayTimings = {};
        for (const key in day.timings) {
          if (day.timings.hasOwnProperty(key)) {
            cleanedDayTimings[key] = day.timings[key].replace(/ \([A-Z]+\)/g, '');
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
      console.error('API Error:', err); // Log the error for debugging
      setError(err.message);
      setLoading(false);
    }
  };

  const handleMonthChange = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);
    fetchMonthlyPrayerTimes(month);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="prayer-times">
      <h2>Bønnetider</h2>
      <p>{date}</p> {/* Display the date here */}
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
          <button onClick={() => fetchMonthlyPrayerTimes(selectedMonth)}>Vis tider for hele måneden</button>
        </>
      )}

      {showMonthly && (
        <div>
          <h3>Bønnetider for hele måneden</h3>
          <label htmlFor="month">Velg måned:</label>
          <select id="month" value={selectedMonth} onChange={handleMonthChange}>
            <option value="1">Januar</option>
            <option value="2">Februar</option>
            <option value="3">Mars</option>
            <option value="4">April</option>
            <option value="5">Mai</option>
            <option value="6">Juni</option>
            <option value="7">Juli</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Desember</option>
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
          <button onClick={() => setShowMonthly(false)}>Skjul månedlige tider</button>
        </div>
      )}
    </div>
  );
};

export default PrayerTimes;