export const ROUTE_PATHS = {
  COUNTRY: 'country',
  SUMMARIZER: 'summarizer',
} as const;

type RouteKey = keyof typeof ROUTE_PATHS;

type AppRoute = `/${(typeof ROUTE_PATHS)[RouteKey]}`;

export const APP_LINKS: Record<RouteKey, AppRoute> = {
  COUNTRY: `/${ROUTE_PATHS.COUNTRY}`,
  SUMMARIZER: `/${ROUTE_PATHS.SUMMARIZER}`,
};
