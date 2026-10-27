import { useEffect, useState } from 'react';
import { api } from '../../api';

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api('/admin/users').then((data) => setUsers(data));
  }, []);

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>№</th>
            <th>Имя</th>
            <th>Email</th>
            <th>Роль</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.is_admin ? 'Администратор' : 'Покупатель'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;
