import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Subject from './Subject';
import Add from './Add';

function App() {
    return (
        <BrowserRouter className="App">
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/subject" element={<Subject />}></Route>
                <Route path="/add" element={<Add />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
