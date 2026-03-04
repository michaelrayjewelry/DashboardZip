import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';

export default function UsersView() {
  const { state } = useApp();

  return (
    <div className="users-view">
      <div className="view-header">
        <h1 className="page-title">USERS</h1>
        <div className="view-header__actions">
          <button className="btn btn--primary">+ INVITE USER</button>
        </div>
      </div>

      <div className="users-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>STATUS</th>
              <th>LAST ACTIVE</th>
            </tr>
          </thead>
          <tbody>
            {state.users.map(user => (
              <tr key={user.id} className="orders-table__row">
                <td>
                  <div className="user-name-cell">
                    <div className="user-avatar">{user.name.split(' ').map(n => n[0]).join('')}</div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td><span className="badge badge--default">{user.role}</span></td>
                <td><span className="badge badge--success">{user.status}</span></td>
                <td>{formatDate(user.lastActive)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
