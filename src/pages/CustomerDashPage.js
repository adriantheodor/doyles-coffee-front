import PlaceOrderPage from "./components/PlaceOrderPage";
import CustomerInvoices from "./components/CustomerInvoices";
import CustomerIssueForm from "./components/CustomerIssueForm";
import CustomerOrdersHistory from "./components/CustomerOrdersHistory";
import CustomerOverview from "./components/CustomerOverview";

const CustomerDashPage = ({ activeSection }) => {
  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <CustomerOverview />;

      case "orders":
        return <PlaceOrderPage />;

      case "history":
        return <CustomerOrdersHistory />;

      case "issues":
        return <CustomerIssueForm />;

      case "invoices":
        return <CustomerInvoices />;

      default:
        return <CustomerOverview />;
    }
  };

  return (
    <div className="page-container">
      <div className="page-card">
        <h1 className="page-title">Customer Dashboard</h1>

        <div>{renderSection()}</div>
      </div>
    </div>
  );
};

export default CustomerDashPage;
