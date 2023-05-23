import './styles/grid.css';

import { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import Drawer from '~/features/Drawer';
import useAuthService from '~/shared/hooks/useAuthService';
import { useAuthStore } from '~/shared/store/useAuthStore';
import { useSelectorStore } from '~/shared/store/useSelectorStore';
import BackdropLoading from '~/shared/ui/BackdropLoading';
import Loading from '~/shared/ui/Loading';
import { Menu } from '~/widgets/Menu';
import Toolbar from '~/widgets/Toolbar';

function App() {
  const { check, loading } = useAuthService();
  const isDrawerOpen = useSelectorStore((store) => store.isDrawerOpen);
  const ready = useAuthStore((store) => store.ready);

  useEffect(() => {
    check();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className={`app${isDrawerOpen ? ' open' : ''}`}>
      <Drawer>
        <Menu />
      </Drawer>
      <Toolbar />
      <main className='container'>
        {ready && (
          <Suspense fallback={<BackdropLoading open={true} />}>
            <Outlet />
          </Suspense>
        )}
      </main>
    </div>
  );
}

export default App;
