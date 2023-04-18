import { Outlet } from 'react-router-dom';

import './styles/grid.css';

import { Menu } from '~/widgets/Menu';
import { useSelectorStore } from '~/shared/store/useSelectorStore';
import Toolbar from '~/widgets/Toolbar';
import Drawer from '~/features/Drawer';
import useAuthService from '~/shared/hooks/useAuthService';
import Loading from '~/shared/ui/Loading';
import { Suspense, useEffect } from 'react';
import { useAuthStore } from '~/shared/store/useAuthStore';
import BackdropLoading from '~/shared/ui/BackdropLoading';

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
