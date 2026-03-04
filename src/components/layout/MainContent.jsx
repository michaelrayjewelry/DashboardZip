import React from 'react';
import { useApp } from '../../context/AppContext';
import ProjectsView from '../projects/ProjectsView';
import ProductsView from '../products/ProductsView';
import OrdersView from '../orders/OrdersView';
import UsersView from '../users/UsersView';

const ROUTE_MAP = {
  projects: ProjectsView,
  products: ProductsView,
  orders: OrdersView,
  users: UsersView,
};

export default function MainContent() {
  const { state } = useApp();
  const ViewComponent = ROUTE_MAP[state.activeRoute] || ProjectsView;

  return (
    <main className="main">
      <ViewComponent />
    </main>
  );
}
