import PlaceOrderPage from "./PlaceOrderPage";
import CustomerInvoices from "./InvoicesPage";
import CustomerIssueForm from "./SubmitIssuePage";
import CustomerOrdersHistory from "./PlaceOrderPage";

const CustomerDashPage = ({ activeSection }) => {
  const renderSection = () => {
    switch (activeSection) {
      case "orders":
        return <PlaceOrderPage />;

      case "history":
        return <CustomerOrdersHistory />;

      case "issues":
        return <CustomerIssueForm />;

      case "invoices":
        return <CustomerInvoices />;

      default:
        return <PlaceOrderPage />;
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
