import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import Books from './pages/Books';
import Dashboard from './pages/Dashboard';
import Loans from './pages/Loans';
import Members from './pages/Members';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="books" element={<Books />} />
        <Route path="members" element={<Members />} />
        <Route path="loans" element={<Loans />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
