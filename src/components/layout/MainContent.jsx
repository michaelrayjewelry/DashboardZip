import React from 'react';
import { useApp } from '../../context/AppContext';
import Topbar from './Topbar';
import DashboardView from '../dashboard/DashboardView';
import ProjectsView from '../projects/ProjectsView';
import ProductsView from '../products/ProductsView';
import OrdersView from '../orders/OrdersView';
import UsersView from '../users/UsersView';
import CustomersView from '../customers/CustomersView';
import InventoryView from '../inventory/InventoryView';
import RepairsView from '../repairs/RepairsView';
import AppraisalsView from '../appraisals/AppraisalsView';
import CustomOrdersView from '../custom-orders/CustomOrdersView';
import ReportsView from '../reports/ReportsView';
import SettingsView from '../settings/SettingsView';
import ToolsView from '../tools/ToolsView';

const ROUTE_MAP = {
  dashboard: DashboardView,
  projects: ProjectsView,
  products: ProductsView,
  orders: OrdersView,
  users: UsersView,
  customers: CustomersView,
  inventory: InventoryView,
  repairs: RepairsView,
  appraisals: AppraisalsView,
  'custom-orders': CustomOrdersView,
  reports: ReportsView,
  settings: SettingsView,
  tools: ToolsView,
};

export default function MainContent() {
  const { state } = useApp();
  const ViewComponent = ROUTE_MAP[state.activeRoute] || DashboardView;

  return (
    <div className="main-wrapper">
      <Topbar />
      <main className="main">
        <ViewComponent />
      </main>
    </div>
  );
}
