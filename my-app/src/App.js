import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Form from './Form';

function App() {
  return (
    <BrowserRouter>  
      <div className="App">
        <Routes>
          <Route path="/" element={<Form />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
