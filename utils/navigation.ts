import { router } from 'expo-router';

// Map old route names to new expo-router paths
const routeMap: Record<string, string> = {
  Search: '/search',
  Explore: '/',
  BucketList: '/bucket-list',
  Profile: '/profile',
  Detail: '/detail',
};

// Define the type for route parameters
type RouteParams = Record<string, string | number | boolean | undefined>;

export const navigate = (routeName: string, params?: RouteParams) => {
  const path = routeMap[routeName] || `/${routeName.toLowerCase()}`;

  router.push({ pathname: path, params });
};
export const goBack = () => router.back();
