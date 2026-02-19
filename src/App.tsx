import { EditorProvider } from './context/EditorContext';
import { AppLayout } from './components/layout/AppLayout';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { UserList } from './components/panels/UserList';
import { ActivitySidebar } from './components/panels/ActivitySidebar';
import { CodeEditor } from './components/editor/CodeEditor';
import { useSimulatedNetwork } from './hooks/useSimulatedNetwork';

const EditorApp = () => {
  // Initialize simulation
  useSimulatedNetwork();

  return (
    <AppLayout
      header={<Header />}
      leftPanel={<UserList />}
      editor={<CodeEditor />}
      rightPanel={<ActivitySidebar />}
      footer={<Footer />}
    />
  );
};

export default function App() {
  return (
    <EditorProvider>
      <EditorApp />
    </EditorProvider>
  );
}
