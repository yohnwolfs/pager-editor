import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Editor from './Editor';
import { useState } from 'react';
import { Spin } from 'antd';
import { uploadService } from '@phoenixs/fileupload';

uploadService.basePath = 'https://file.home.com';
uploadService.clientId = 'pager-editor';

function App() {
  const [isLoggin, setIsLoggin] = useState(true);

  return isLoggin ? (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/pager-editor" element={<Editor />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  ) : (
    <div
      style={{
        width: '100%',
        height: '500px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spin />
    </div>
  );
}

export default App;
