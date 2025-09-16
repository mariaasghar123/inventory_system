import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ProductList from "./pages/products/ProductList";
import ProductForm from "./pages/products/ProductForm";
import UserList from "./pages/users/UserList";
import SaleList from "./pages/sales/SalesList";
import StockBatchList from "./pages/stockbatches/StockBatchList";
import UserForm from "./pages/users/UserForm";
import SaleForm from "./pages/sales/SalesForm";
import StockBatchForm from "./pages/stockbatches/StockBatchForm";
import SaleItemList from "./pages/saleitem/SaleItemList";
import SaleItemForm from "./pages/saleitem/SaleItemForm";
import EditProduct from "./pages/products/ProductEdit";
import EditSale from "./pages/sales/SaleEdit";
import EditStockBatch from "./pages/stockbatches/StockBatchEdit";
import ExpenseList from "./pages/expenses/ExpenseList";
import ExpenseForm from "./pages/expenses/ExpensesForm";
import PurchaseList from "./pages/purchase/PurchaseList";
import PurchaseEditForm from "./pages/purchase/PurchaseEditForm";
import PurchaseItemList from "./pages/purchaseItem/PurchaseItemList";
import PurchaseItemForm from "./pages/purchaseItem/PurchaseItemForm";
import ExpenseEditForm from "./pages/expenses/ExpensesForm";
import ExpenseNewForm from "./pages/expenses/ExpenseNew";
import PurchaseForm from "./pages/purchase/PurchaseNewForm";
import PurchaseItemNewForm from "./pages/purchaseItem/PurchaseItemNewform";
import ReturnList from "./pages/returns/ReturnsList";
import ReturnEditForm from "./pages/returns/ReturnsEditForm";
import ReturnNewForm from "./pages/returns/ReturnsNewForm";
import Signup from "./pages/register/Signup";
import Login from "./pages/register/Login";
import EditSaleItemForm from "./pages/saleitem/SaleItemEdit";


export default function App() {
  return (
    <Router>
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
       
        <Route element={<DashboardLayout />}>
        
          <Route path="/" element={<DashboardHome />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/new" element={<UserForm />} />
          <Route path="/sales" element={<SaleList />} />
          <Route path="/sales/new" element={<SaleForm />} />
          <Route path="/sales/edit/:id" element={<EditSale />} />
          <Route path="/salesitem" element={<SaleItemList />} />
          <Route path="/salesitem/new" element={<SaleItemForm />} />
          <Route path="/saleitems/edit/:id" element={<EditSaleItemForm />} />

          <Route path="/stockbatches" element={<StockBatchList />} />
          <Route path="/stockbatches/new" element={<StockBatchForm />} />
          <Route path="/stockbatches/edit/:id" element={<EditStockBatch />} />
          <Route path="/expenses" element={<ExpenseList />} />
          <Route path="/expenses/:id/edit" element={<ExpenseEditForm />} />
          <Route path="/expenses/new" element={<ExpenseNewForm />} />
          <Route path="/purchases" element={<PurchaseList />} />
          <Route path="/purchases/edit/:id" element={<PurchaseEditForm />} />
          <Route path="/purchases/new" element={<PurchaseForm />} />
          <Route path="/purchaseitems" element={<PurchaseItemList />} />
          <Route path="/purchaseitems/edit/:id" element={<PurchaseItemForm />}/>
          <Route path="/purchaseitems/new" element={<PurchaseItemNewForm />} />
          <Route path="/returns" element={<ReturnList />} />{" "}
          <Route path="/returns/new" element={<ReturnNewForm />} />{" "}
          <Route path="/returns/edit/:id" element={<ReturnEditForm />} />

          
         

        </Route>
        <Route path="/signup" element={<Signup />} />
         <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
