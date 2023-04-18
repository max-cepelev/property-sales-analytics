import { UserRole } from './enums';

interface Section {
  title: string;
  icon: string;
  key: string;
  roles: UserRole[];
  route: string;
}

const SECTIONS: Section[] = [
  {
    title: 'DASHBOARD',
    key: '',
    icon: '/icons/monitoring.svg',
    roles: ['ADMIN', 'EDITOR', 'USER'],
    route: '/',
  },
  {
    title: 'Регионы',
    key: 'regions',
    icon: '/icons/region.svg',
    roles: ['ADMIN', 'EDITOR'],
    route: '/regions',
  },
  {
    title: 'Города',
    key: 'cities',
    icon: '/icons/city.svg',
    roles: ['ADMIN', 'EDITOR'],
    route: '/cities',
  },
  {
    title: 'Районы',
    key: 'districts',
    icon: '/icons/area.svg',
    roles: ['ADMIN', 'EDITOR'],
    route: '/districts',
  },
  {
    title: 'Группы компаний',
    key: 'groups',
    icon: '/icons/group.svg',
    roles: ['ADMIN', 'EDITOR'],
    route: '/groups',
  },
  {
    title: 'Застройщики',
    key: 'developers',
    icon: '/icons/developer.svg',
    roles: ['ADMIN', 'EDITOR'],
    route: '/developers',
  },
  {
    title: 'ЖК',
    key: 'complexes',
    icon: '/icons/complex.svg',
    roles: ['ADMIN', 'EDITOR'],
    route: '/complexes',
  },
  {
    title: 'Дома',
    key: 'buildings',
    icon: '/icons/building.svg',
    roles: ['USER', 'ADMIN', 'EDITOR'],
    route: '/buildings',
  },
  {
    title: 'Объекты',
    key: 'properties',
    icon: '/icons/object.svg',
    roles: ['ADMIN', 'EDITOR'],
    route: '/properties',
  },
  {
    title: 'Продажи',
    key: 'sales',
    icon: '/icons/sale.svg',
    roles: ['ADMIN', 'EDITOR'],
    route: '/sales',
  },
  {
    title: 'Пользователи',
    key: 'users',
    icon: '/icons/users.svg',
    roles: ['ADMIN'],
    route: '/users',
  },
];

export default SECTIONS;
