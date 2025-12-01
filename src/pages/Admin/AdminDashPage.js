import AdminOverview from './components/AdminOverview';
import InventoryManager from './components/InventoryManager';
import OrderManager from './components/OrderManager';
import IssueManager from './components/IssueManager';
import InvoiceUploader from './components/InvoiceUploader';
import QRCodeGenerator from './components/QRCodeGenerator';
import QuoteRequestsWidget from "./QuoteRequestsWidget";


const AdminDashboardPage = ({ activeSection }) => {
  


  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <AdminOverview />;
      case 'inventory':
        return <InventoryManager />;
      case 'orders':
        return <OrderManager />;
      case 'issues':
        return <IssueManager />;
      case 'invoices':
        return <InvoiceUploader />;
      case 'qrcodes':
        return <QRCodeGenerator />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <QuoteRequestsWidget />
      <div>{renderSection()}</div>
    </div>
  );
};

export default AdminDashboardPage;