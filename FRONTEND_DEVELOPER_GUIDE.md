# Shopizer Frontend Developer Guide

## 1. Project Structure

The project follows a three-tier component hierarchy: Pages → Wrappers → Components. Pages are route-level views that map to URLs. Wrappers are section-level blocks that compose multiple components into a meaningful page section (e.g., a product grid with tabs). Components are the smallest reusable UI pieces (e.g., a single product card, a nav menu item).

- `pages/` — route-level page components: home, category listing, product details, CMS content, search results, cart, checkout, account, login, orders, and error pages.
- `wrappers/` — section-level layout components: header (health check + nav + categories), footer, product grids/tabs, hero slider, breadcrumb bar, promos, newsletter.
- `components/` — reusable UI components: logo, nav menu, icon group, mobile menu, product modal, product description info, footer columns, contact form, loader, cookie consent.
- `redux/actions/` and `redux/reducers/` — state management: async thunks for API calls and reducers for each state slice.
- `util/` — shared utilities: `webService.js` (Axios wrapper), `constant.js` (API endpoint paths), `helper.js` (localStorage utils, validation).
- `helpers/product.js` — domain-specific logic for product filtering, sorting, discount calculation, and cart quantity checks.
- `translations/` — i18n JSON files for English and French.
- `data/` — static JSON content for hero sliders and feature icons.
- `assets/` — CSS, SCSS stylesheets, and fonts.
- `layouts/Layout.js` — shared shell component that renders Header + children + Footer on every page.

## 2. Application Bootstrap

The app starts in `index.js`, which creates the Redux store with three middleware layers: `redux-thunk` for async action creators, `redux-localstorage-simple` for persisting selected state slices to the browser's localStorage, and Redux DevTools for debugging. The store is passed to a `<Provider>` that wraps the entire app.

`App.js` is the root component. On mount, it reads the cart cookie (named `{merchant}_shopizer_cart`) and restores the cart ID into Redux. It also loads the i18n translation files (English and French) into the `redux-multilanguage` system. The component renders a `<Router>` with a `<Switch>` containing all route definitions — each route lazy-loads its page component using `React.lazy()` and `<Suspense>` for code splitting.

The `Header.js` wrapper runs on every page because it's part of the `Layout` shell. On mount, it performs a health check against the backend (`/actuator/health/ping`). If the backend responds with `{"status": "UP"}`, it triggers three parallel data fetches: the merchant store info (dispatched to Redux), the category hierarchy, and the CMS content pages (both stored in local state). If the health check fails, the user is redirected to `/not-found`. This is why the app shows a 404 when the backend is unreachable.

## 3. Component Composition

Every page follows a consistent structure. The page component wraps its content in `<Fragment>` → `<MetaTags>` (for SEO) → `<BreadcrumbsItem>` (for breadcrumb navigation) → `<Layout>` (the shared header/footer shell) → `<Breadcrumb>` (the rendered breadcrumb bar) → page-specific content.

The `Layout` component is minimal — it renders the `Header`, then `{children}` (whatever the page passes in), then the `Footer`. This ensures every page has a consistent site shell without duplicating header/footer code.

Wrappers like `TabProduct` handle section-level logic. `TabProduct` fetches featured/new/best-seller product groups from the API, renders Bootstrap tabs, and passes each group's products down to a `ProductGrid` component. `ProductGrid` then maps over the products and renders individual product cards.

Components like `ProductDescriptionInfo` are purely presentational — they receive product data, cart state, and action callbacks as props and render the UI. They don't fetch data or manage state themselves.

## 4. Data Flow & State Management

The app uses a split state strategy. Global, cross-cutting concerns live in Redux, while page-specific data lives in local component state.

### Redux State Slices

- `merchantData` — holds the store configuration object (name, logo, currency, etc.) and the `defaultStore` code string. Fetched once on app load by `Header.js` and used by almost every component to scope API calls to the correct store.
- `cartData` — the shopping cart. Contains `cartItems` (the full cart object from the API), `cartID` (persisted to a cookie and localStorage for session continuity), `cartCount` (number of items), and `orderID` (set after checkout). Cart operations (`addToCart`, `deleteFromCart`) are async thunks that call the backend API, then update Redux state.
- `userData` — user authentication data, plus reference data for forms: `country` (billing countries), `shipCountry` (shipping-eligible countries), `state`/`shipState` (zones for a selected country), and `currentAddress` (reverse-geocoded from browser geolocation via Google Maps API).
- `productData` — a lightweight slice holding a `products` array (used for featured product sections), plus `productid` and `categoryid` for tracking the currently selected product/category.
- `loading` — a single `isLoading` boolean toggled by cart operations to show/hide a global loading overlay.
- `multilanguage` — managed by the `redux-multilanguage` library. Holds `currentLanguageCode` (defaults to "en") and the loaded translation strings. Components access translated text via a `strings` prop injected by the `multilanguage()` HOC.
- `content` — tracks the active CMS content page ID.

### Local State

Page-specific data (product details, category product listings, search results) is fetched inside `useEffect` hooks and stored in `useState`. This data doesn't need to be shared across pages, so keeping it local avoids unnecessary Redux complexity.

### Component-Redux Connection

Components connect to Redux using the `connect()` HOC pattern (not `useSelector`/`useDispatch` hooks). A typical export looks like:

```js
connect(mapStateToProps, mapDispatchToProps)(multilanguage(Component))
```

This gives the component access to Redux state via props, dispatch functions via props, and i18n strings via the `strings` prop.

## 5. API Communication

All HTTP calls go through `WebService`, a static class wrapping Axios with static methods for GET, POST, PUT, DELETE, and PATCH. The base URL is built from environment config:

```
BASE_URL = window._env_.APP_BASE_URL + window._env_.APP_API_VERSION
         = http://localhost:8080    + /api/v1/
```

An Axios request interceptor automatically attaches the JWT token from localStorage as a `Bearer` authorization header on every request. A response interceptor handles 401 (unauthorized) and 404 errors.

API endpoint paths are centralized in `constant.js` as an `ACTION` map (e.g., `STORE: 'store/'`, `PRODUCTS: 'products/'`, `CART: 'cart/'`, `CATEGORY: 'category/'`, `CUSTOMER: 'customer/'`, etc.). Components build full API URLs by concatenating these constants with query parameters like `lang` and `store`.

## 6. Routing

`App.js` defines all routes using React Router's `<Switch>`:

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Home | Homepage with slider, promos, featured products |
| `/category/:id` | Category | Product listing filtered by category |
| `/product/:id` | ProductDetail | Single product page |
| `/content/:id` | Content | CMS content page |
| `/search/:id` | SearchProduct | Search results |
| `/contact` | Contact | Contact form |
| `/my-account` | MyAccount | Customer dashboard (orders, addresses, profile) |
| `/register` | LoginRegister | Registration form |
| `/login` | LoginRegister | Login form (same component as register) |
| `/forgot-password` | ForgotPassword | Password reset request |
| `/customer/:code/reset/:id` | ResetPassword | Password reset with token |
| `/cart` | Cart | Shopping cart |
| `/checkout` | Checkout | Checkout flow |
| `/order-confirm` | OrderConfirm | Order confirmation |
| `/recent-order` | RecentOrder | Recent order list |
| `/order-details/:id` | OrderDetails | Single order details |
| `/not-found` | NotFound | 404 page |
| `*` (catch-all) | NotFound | Any unmatched route |

All page components are lazy-loaded via `React.lazy()` and wrapped in `<Suspense>` with a loading spinner fallback. This means each page's JavaScript is only downloaded when the user navigates to that route, reducing the initial bundle size.

## 7. Internationalization (i18n)

The app supports English and French via `redux-multilanguage`:

- Translation files live in `src/translations/english.json` and `french.json`.
- They're loaded into Redux on app mount in `App.js`.
- Components wrapped with the `multilanguage()` HOC receive a `strings` prop.
- UI text is accessed as `strings["key_name"]` instead of hardcoded strings.
- The current language code (`currentLanguageCode`) is passed to API calls so the backend returns localized product/category descriptions.

## 8. Cart Persistence

The cart uses a multi-layer persistence strategy to survive page refreshes and browser restarts:

1. **Cookie** — named `{merchant}_shopizer_cart` with a 6-month expiry. Read on app startup in `App.js` to restore the cart ID.
2. **localStorage** — the cart ID is also stored via `setLocalData()`. Used as a fallback and for quick access by components.
3. **Redux** — `cartData.cartID` holds the active cart ID in memory. Cart contents are fetched from the backend API using this ID.
4. **Backend** — the cart is stored server-side. The frontend only keeps the cart ID locally; the actual cart contents are always fetched fresh from the API.

When a customer adds an item to cart, the flow is: API call → backend returns cart ID → ID saved to cookie + localStorage + Redux → cart contents fetched from API → Redux `cartItems` updated → UI re-renders.
