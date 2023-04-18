import React from 'react';
import {
  mdiAccountGroup,
  mdiCity,
  mdiCrane,
  mdiDomain,
  mdiHome,
  mdiHomeAnalytics,
  mdiHomeAssistant,
  mdiHubspot,
  mdiMapLegend,
  mdiMapMarkerMultiple,
  mdiViewDashboard,
} from '@mdi/js';
import { RouteObject } from 'react-router-dom';

import App from '../App';
import ProtectedRoute from '~/shared/components/ProtectedRoute';
import Dashboard from '~/pages/Dashboard';
import ErrorPage from '~/pages/ErrorPage';
import LoginPage from '~/pages/LoginPage';
import NoAccess from '~/pages/NoAccess';
import NoActivate from '~/pages/NoActivate';

const CitiesPage = React.lazy(() => import('~/pages/CitiesPage'));
const BuildingsPage = React.lazy(() => import('~/pages/BuildingsPage'));
const ComplexesPage = React.lazy(() => import('~/pages/ComplexesPage'));
const DevelopersPage = React.lazy(() => import('~/pages/DevelopersPage'));
const DistrictsPage = React.lazy(() => import('~/pages/DistrictsPage'));
const GroupsPage = React.lazy(() => import('~/pages/GroupsPage'));
const PropertiesPage = React.lazy(() => import('~/pages/PropertiesPage'));
const RegionsPage = React.lazy(() => import('~/pages/RegionsPage'));
const SalesPage = React.lazy(() => import('~/pages/SalesPage'));
const UsersPage = React.lazy(() => import('~/pages/UsersPage'));
const BuildingPage = React.lazy(() => import('~/pages/BuildingPage'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Dashboard />,
        index: true,
        path: '',
        handle: {
          title: 'Dashboard',
          icon: mdiViewDashboard,
          roles: ['ADMIN', 'EDITOR', 'USER'],
        },
      },
      {
        path: 'regions',
        element: <RegionsPage />,
        handle: {
          title: 'Регионы',
          icon: mdiMapLegend,
          roles: ['ADMIN', 'EDITOR'],
        },
      },
      {
        path: 'cities',
        element: <CitiesPage />,
        handle: {
          title: 'Города',
          icon: mdiCity,
          roles: ['ADMIN', 'EDITOR', 'USER'],
        },
      },
      {
        path: 'districts',
        element: <DistrictsPage />,
        handle: {
          title: 'Районы',
          icon: mdiMapMarkerMultiple,
          roles: ['ADMIN', 'EDITOR', 'USER'],
        },
      },
      {
        path: 'groups',
        element: (
          <ProtectedRoute accessRoles={['ADMIN', 'EDITOR']}>
            <GroupsPage />
          </ProtectedRoute>
        ),
        handle: {
          title: 'Группы',
          icon: mdiHubspot,
          roles: ['ADMIN', 'EDITOR'],
        },
      },
      {
        path: 'developers',
        element: (
          <ProtectedRoute accessRoles={['ADMIN', 'EDITOR']}>
            <DevelopersPage />
          </ProtectedRoute>
        ),
        handle: {
          title: 'Застройщики',
          icon: mdiCrane,
          roles: ['ADMIN', 'EDITOR'],
        },
      },
      {
        path: 'complexes',
        element: (
          <ProtectedRoute accessRoles={['ADMIN', 'EDITOR']}>
            <ComplexesPage />
          </ProtectedRoute>
        ),
        handle: {
          title: 'ЖК',
          icon: mdiDomain,
          roles: ['ADMIN', 'EDITOR'],
        },
      },
      {
        path: 'buildings',
        element: (
          <ProtectedRoute accessRoles={['ADMIN', 'EDITOR', 'USER']}>
            <BuildingsPage />
          </ProtectedRoute>
        ),
        handle: {
          title: 'Дома',
          icon: mdiHome,
          roles: ['ADMIN', 'EDITOR', 'USER'],
        },
      },
      {
        path: 'buildings/:id',
        element: (
          <ProtectedRoute accessRoles={['ADMIN', 'EDITOR', 'USER']}>
            <BuildingPage />
          </ProtectedRoute>
        ),
      },

      {
        path: 'properties',
        element: (
          <ProtectedRoute accessRoles={['ADMIN', 'EDITOR']}>
            <PropertiesPage />
          </ProtectedRoute>
        ),
        handle: {
          title: 'Объекты',
          icon: mdiHomeAssistant,
          roles: ['ADMIN', 'EDITOR'],
        },
      },
      {
        path: 'sales',
        element: (
          <ProtectedRoute accessRoles={['ADMIN', 'EDITOR']}>
            <SalesPage />
          </ProtectedRoute>
        ),
        handle: {
          title: 'Продажи',
          icon: mdiHomeAnalytics,
          roles: ['ADMIN', 'EDITOR'],
        },
      },

      {
        path: 'users',
        element: (
          <ProtectedRoute accessRoles={['ADMIN']}>
            <UsersPage />
          </ProtectedRoute>
        ),
        handle: {
          title: 'Пользователи',
          icon: mdiAccountGroup,
          roles: ['ADMIN'],
        },
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'no-activate',
        element: <NoActivate />,
      },
      {
        path: 'no-access',
        element: <NoAccess />,
      },
    ],
  },
];
