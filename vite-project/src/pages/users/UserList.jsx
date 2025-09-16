import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// ✅ Environment-based URL
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/users`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then(data => setUsers(data))
      .catch(err => {
        console.error(err);
        alert("Error fetching users");
      });
  }, []);

  return (
    <div className="p-6">
      {/* Heading + Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Users</h1>
        {/* <Link
          to="/users/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md transition duration-200"
        >
          + Add New User
        </Link> */}
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-red-400 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                Password
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((u, idx) => (
              <tr
                key={u.id}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">{u.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">{u.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">{u.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">{u.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">{u.password}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
