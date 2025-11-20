import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { KioskLayout } from './components/layout/KioskLayout';
import { AttractScreen } from './pages/AttractScreen';
import { LoginScreen } from './pages/LoginScreen';
import { ScanScreen } from './pages/ScanScreen';
import { ReceiptScreen } from './pages/ReceiptScreen';
import { CameraProvider } from './contexts/CameraContext';

import { ClassifierProvider } from './contexts/ClassifierContext';

const App = () => {
  return (
    <Router>
      <CameraProvider>
        <ClassifierProvider>
          <KioskLayout>
            <Routes>
              <Route path="/" element={<AttractScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/scan" element={<ScanScreen />} />
              <Route path="/receipt" element={<ReceiptScreen />} />
            </Routes>
          </KioskLayout>
        </ClassifierProvider>
      </CameraProvider>
    </Router>
  );
};

export default App;
