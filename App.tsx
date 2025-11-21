import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import VoiceAssistant from './components/VoiceAssistant';

// Scroll to top on route change component
const ScrollToTop = () => {
  const { pathname } = React.useMemo(() => ({ pathname: window.location.hash }), []);
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen font-sans text-gray-900 bg-gray-50">
        <ScrollToTop />
        <Header />
        
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            {/* Add Category or other routes here */}
          </Routes>
        </div>

        <Footer />
        <VoiceAssistant />
      </div>
    </HashRouter>
  );
};

export default App;