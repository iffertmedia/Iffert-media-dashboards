
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Campaigns from './pages/Campaigns';
import Products from './pages/Products';
import Creators from './pages/Creators';

export default function App() {
  return (
    <Router>
      <div className="font-roboto bg-white text-gray-900 min-h-screen">
        <header className="flex justify-between items-center py-4 px-4 border-b">
          <h1 className="text-xl font-bold">Iffert Media</h1>
          <nav className="space-x-4">
            <Link to="/" className="text-blue-600 underline">Home</Link>
            <Link to="/campaigns" className="text-blue-600 underline">Campaigns</Link>
            <Link to="/products" className="text-blue-600 underline">Products</Link>
            <Link to="/creators" className="text-blue-600 underline">Creators</Link>
          </nav>
        </header>
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/products" element={<Products />} />
            <Route path="/creators" element={<Creators />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
