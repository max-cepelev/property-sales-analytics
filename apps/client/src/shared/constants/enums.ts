export const Roles = {
  USER: 'Пользователь',
  ADMIN: 'Администратор',
  EDITOR: 'Редактор',
};

export type UserRole = keyof typeof Roles;

export const PropertyTypes = {
  LIVING: 'Жилая',
  COMMERCIAL: 'Коммерция',
  PARKING: 'Паркинг',
};

export type PropertyType = keyof typeof PropertyTypes;

export const PropertyClasses = {
  TYPICAL: 'Типовой',
  ECONOMY: 'Эконом',
  COMFORT: 'Комфорт',
  BUSINESS: 'Бизнес',
  PREMIUM: 'Премиум',
};

export type PropertyClass = keyof typeof PropertyClasses;

export const DecorTypes = {
  WITHOUT: 'Без отделки',
  UNDER_FINISHING: 'Под чистовую',
  FINISHING: 'Чистовая',
  FULL: 'Под ключ',
  OPTIONALLY: 'По выбору',
};

export type DecorType = keyof typeof DecorTypes;

export const WallMaterials = {
  MONOLITH_BRICK: 'Монолит-кирпич',
  BLOCKS: 'Блоки',
  BRICK: 'Кирпич',
  PANEL: 'Панель',
  MONOLITH: 'Монолит',
};

export type WallMaterial = keyof typeof WallMaterials;

export const AppColors = [
  '#b4a7d6',
  '#b6d7a8',
  '#9fc5e8',
  '#d5a6bd',
  '#ffe599',
  '#89cdf0',
  '#a0db8e',
  '#ffc3a0',
];

export enum Months {
  Январь = 1,
  Февраль,
  Март,
  Апрель,
  Май,
  Июнь,
  Июль,
  Август,
  Сентябрь,
  Октябрь,
  Ноябрь,
  Декабрь,
}
