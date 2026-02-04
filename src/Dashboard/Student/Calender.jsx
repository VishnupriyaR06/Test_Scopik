import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "/src/index.css";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

function Calender() {
  const [date, setDate] = useState(new Date());
  const [accessedDates, setAccessedDates] = useState({});
  const Uemail = localStorage.getItem("userEmail");

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_STUDENT_PROGRESS, {
        params: {
          email: Uemail,
        },
      })
      .then((response) => {
        setAccessedDates(response.data.hours_spent);
      })
      .catch((error) => {
        console.error("Error fetching accessed dates:", error);
      });
  }, [Uemail]);

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const formattedDate = date.toLocaleDateString("en-CA");
      if (accessedDates.hasOwnProperty(formattedDate)) {
        return "highlight-date";
      }
    }
    return null;
  };

  return (
    <div className="w-[400px] h-[480px] p-5 rounded">
      <Calendar
        onChange={setDate}
        value={date}
        className="custom-calendar"
        tileClassName={tileClassName}
      />
    </div>
  );
}

export default Calender;
