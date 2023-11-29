import { Routes, Route } from 'react-router-dom';
import Background from '../routes/Background';
import Home from '../routes/Home';

const EchoChamber = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Background />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </div>
  );
};

export default EchoChamber;
