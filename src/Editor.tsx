import 'antd/dist/antd.min.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/material.css';
import { useState } from 'react';
import 'react-contexify/dist/ReactContexify.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './global.less';
import { EditorControlPanel } from './modules/ControlPanel';
import { AttributePanel } from './modules/EditorAttribute';
import { EditorHeader } from './modules/Header';
import { EditorViewPort } from './modules/ViewPort';
import EditorPreview from './preview';
import Container from './state';

const Editor = () => {
  const [preview, setPreview] = useState(false);

  return (
    <Container.Provider>
      <DndProvider backend={HTML5Backend}>
        <div style={{ fontSize: 12 }}>
          <div style={{}}>
            <EditorHeader onPreview={() => setPreview(true)} />
          </div>
          <div
            style={{
              display: 'flex',
              height: 'calc(100vh - 60px)',
            }}
          >
            <EditorControlPanel />
            <EditorViewPort />
            <AttributePanel />
          </div>
          {preview ? (
            <div
              style={{
                position: 'fixed',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                zIndex: 999,
              }}
            >
              <EditorPreview onClose={() => setPreview(false)} />
            </div>
          ) : null}
        </div>
      </DndProvider>
    </Container.Provider>
  );
};

export default Editor;
