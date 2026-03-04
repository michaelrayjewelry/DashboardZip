import React from 'react';
import { useApp } from '../../context/AppContext';
import DashboardView from '../dashboard/DashboardView';
import InventoryView from '../inventory/InventoryView';
import OrdersView from '../orders/OrdersView';
import CustomersView from '../customers/CustomersView';
import AppraisalsView from '../appraisals/AppraisalsView';
import RepairsView from '../repairs/RepairsView';
import CustomOrdersView from '../custom-orders/CustomOrdersView';
import ReportsView from '../reports/ReportsView';
import ToolsView from '../tools/ToolsView';
import SettingsView from '../settings/SettingsView';

const ROUTE_MAP = {
  dashboard: DashboardView,
  inventory: InventoryView,
  orders: OrdersView,
  customers: CustomersView,
  appraisals: AppraisalsView,
  repairs: RepairsView,
  'custom-orders': CustomOrdersView,
  reports: ReportsView,
  tools: ToolsView,
  settings: SettingsView,
};

export default function MainContent() {
  const { state } = useApp();
  const ViewComponent = ROUTE_MAP[state.activeRoute] || DashboardView;

  return (
    <main className="main">
      <ViewComponent />
    </main>
  );
}
