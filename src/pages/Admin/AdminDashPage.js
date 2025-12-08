import AdminOverview from './components/AdminOverview';
import InventoryManager from './components/InventoryManager';
import OrderManager from './components/OrderManager';
import IssueManager from './components/IssuesManager';
import InvoiceManager from './components/InvoiceManager'; 
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
        return <InvoiceManager />;
      case 'qrcodes':
        return <QRCodeGenerator />;
      case 'quotes':                     
        return <QuoteRequestsWidget />;  
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className='page-container'>
      <div className='page-card'>
        <h1 className='page-title'>Admin Dashboard</h1>

      <div>{renderSection()}</div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
