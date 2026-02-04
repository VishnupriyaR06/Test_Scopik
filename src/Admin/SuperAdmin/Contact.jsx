import axios from "axios";
import { useEffect, useState } from "react";

function Contact() {
  const [querry, setQuerry] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_CONTACT_LIST)
      .then((res) => {
        setQuerry(res.data);
      })
      .catch(() => {
        console.error("Error in receiving Data");
      });
  }, []);

  const functionalQuerry = querry.filter((item) => {
    const searchText = search.toLowerCase();
    return (
      item.name?.toLowerCase().includes(searchText) ||
      item.email?.toLowerCase().includes(searchText)
    );
  });
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700 dark:text-orange-400">
          Contact Queries
        </h2>
        <div className="flex items-center gap-10">
          <h1 className="text-blue-700 text-xl font-bold dark:text-orange-400">Total Querires: {querry.length}</h1>
          <input
            type="text"
            className="border p-2 w-[300px] rounded-md bg-white focus:outline-none dark:bg-slate-800 dark:text-white"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full text-sm border border-gray-300 dark:border-gray-700">
          <thead className="bg-blue-600 text-white dark:bg-gray-800">
            <tr>
              {["S.No", "Name", "Email", "Phone Number", "Message", "Date"].map(
                (header, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-3 text-center font-semibold tracking-wide text-white dark:text-orange-400"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {functionalQuerry.length > 0 ? (
              functionalQuerry.map((item, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-100 dark:bg-gray-700"
                  } hover:bg-blue-50 dark:hover:bg-gray-600 transition`}
                >
                  <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">
                    {item.id}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">
                    {item.email}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">
                    {item.phone}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200 max-w-xs break-words">
                    {item.message}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">
                    {item.date?.slice(0, 10) || "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Contact;
