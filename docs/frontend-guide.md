# Frontend Guide

React + TypeScript frontend with MUI design system, TanStack Query for server state, and Zustand for client state.

---

## Architecture Overview

```
src/Frontend/src/
├── app/                    # Application shell
│   ├── App.tsx             # Root component
│   ├── Router.tsx          # Route definitions (lazy-loaded)
│   ├── layouts/            # DashboardLayout, AuthLayout
│   └── providers/          # ThemeProvider, QueryProvider, AuthProvider
├── features/               # Feature modules (one per domain)
│   ├── auth/
│   ├── dashboard/
│   ├── wallets/
│   ├── transactions/
│   └── landing/
├── shared/                 # Cross-cutting concerns
│   ├── api/                # Axios client, interceptors
│   ├── components/         # Reusable UI components
│   ├── constants/          # Error messages, route paths
│   ├── design-system/      # Theme, colors, typography
│   ├── hooks/              # useAuth, usePermissions, useDebounce
│   ├── stores/             # Zustand stores (auth, sidebar)
│   └── types/              # Shared TypeScript types
└── lib/
    └── utils.ts            # cn() utility for classnames
```

---

## Feature Module Pattern

Each feature is self-contained with this structure:

```
features/wallets/
├── api/                    # API functions (Axios calls)
│   └── walletApi.ts
├── hooks/                  # TanStack Query hooks
│   └── useWallets.ts
├── pages/                  # Page components
│   ├── WalletsPage.tsx
│   └── WalletDetailPage.tsx
├── components/             # Feature-specific components
│   ├── WalletCard.tsx
│   └── CreateWalletDialog.tsx
└── types/                  # Feature-specific types
    └── wallet.types.ts
```

### How Data Flows

```
User Action
  → Page Component
    → Custom Hook (useMutation / useQuery)
      → API Function (Axios)
        → Backend API
          → Response
        ← TanStack Query Cache
      ← Hook returns { data, isLoading, error }
    ← Component renders
```

---

## State Management

### Server State — TanStack Query

All backend data flows through TanStack Query hooks. Never store API data in Zustand.

```tsx
// features/wallets/hooks/useWallets.ts
export function useWallets() {
  return useQuery({
    queryKey: ['wallets'],
    queryFn: () => walletApi.getAll(),
  });
}

export function useCreateWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: walletApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });
}
```

**Query key conventions:**
- `['wallets']` — list
- `['wallets', walletId]` — detail
- `['wallets', walletId, 'balance']` — nested resource
- `['transactions', { walletId, type, page }]` — filtered list

### Client State — Zustand

Only for UI state that doesn't come from the server:

```tsx
// shared/stores/authStore.ts — user session, tokens
// shared/stores/sidebarStore.ts — sidebar open/close state
```

### When to Use What

| Data Type | Store | Example |
|-----------|-------|---------|
| API responses | TanStack Query | Wallets, transactions, notifications |
| Auth tokens | Zustand (authStore) | accessToken, refreshToken |
| User profile | Zustand (authStore) | Current user after login |
| UI state | Zustand | Sidebar collapsed, theme mode |
| Form state | React Hook Form | Input values, validation errors |

---

## Forms

### With Zod (String Fields)

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
      <TextField {...register('password')} type="password" error={!!errors.password} helperText={errors.password?.message} />
      <Button type="submit">Login</Button>
    </form>
  );
}
```

### With Native RHF (Numeric Fields)

For forms with numeric inputs, use RHF's built-in validation (Zod coerces numbers awkwardly):

```tsx
const { register, handleSubmit } = useForm({
  defaultValues: { amount: '' },
});

<TextField
  {...register('amount', {
    required: 'Amount is required',
    min: { value: 0.01, message: 'Minimum is $0.01' },
  })}
  type="number"
/>
```

---

## Design System

### Theme

Dark OLED theme defined in `shared/design-system/theme.ts`:

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#020617` | Page background |
| Surface | `#0F172A` | Cards, dialogs |
| Surface variant | `#1E293B` | Elevated surfaces, inputs |
| Primary (CTA) | `#22C55E` | Buttons, active states |
| Error | `#EF4444` | Errors, destructive actions |
| Warning | `#F59E0B` | Warnings, pending states |
| Info | `#3B82F6` | Information badges |
| Text primary | `#F8FAFC` | Headings, body text |
| Text secondary | `#94A3B8` | Labels, captions |
| Font | IBM Plex Sans | All text |

### Using Theme Values

```tsx
import { useTheme } from '@mui/material';

function MyComponent() {
  const theme = useTheme();
  return (
    <Box sx={{
      bgcolor: 'background.paper',     // #0F172A
      color: 'text.primary',           // #F8FAFC
      borderColor: 'divider',          // rgba(148,163,184,0.12)
    }}>
      <Button variant="contained" color="primary">  {/* #22C55E */}
        Action
      </Button>
    </Box>
  );
}
```

### Component Patterns

**Cards:**
```tsx
<Card sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
  <CardContent>...</CardContent>
</Card>
```

**Status chips:**
```tsx
<Chip
  label={status}
  color={status === 'Active' ? 'success' : status === 'Frozen' ? 'warning' : 'error'}
  size="small"
/>
```

**Data tables:**
```tsx
<TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
  <Table>
    <TableHead>
      <TableRow sx={{ '& th': { color: 'text.secondary', fontWeight: 600 } }}>
        ...
      </TableRow>
    </TableHead>
  </Table>
</TableContainer>
```

---

## Routing

### Route Definitions

Routes are defined in `app/Router.tsx` with lazy loading:

```tsx
const WalletsPage = lazy(() => import('../features/wallets/pages/WalletsPage'));

<Route element={<ProtectedRoute />}>
  <Route element={<DashboardLayout />}>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/wallets" element={<WalletsPage />} />
    <Route path="/wallets/:walletId" element={<WalletDetailPage />} />
    <Route path="/transactions" element={<TransactionsPage />} />
  </Route>
</Route>
```

### Auth Guard

`ProtectedRoute` checks the auth store. Redirects to `/login` if no token.

### Adding a New Route

1. Create the page in `features/yourFeature/pages/YourPage.tsx`
2. Add lazy import in `Router.tsx`
3. Add `<Route>` inside the appropriate layout
4. Add sidebar link in `DashboardLayout` sidebar config

---

## Permission System

### Hook

```tsx
const { hasPermission, hasAnyPermission } = usePermissions();

if (hasPermission('wallets:write')) {
  // Show create button
}
```

### Gate Component

```tsx
<PermissionGate permission="audit:read">
  <AuditLogsTable />
</PermissionGate>
```

### Available Permissions

| Permission | Roles |
|------------|-------|
| `users:read` | All |
| `users:write` | Admin |
| `wallets:read` | User, Admin |
| `wallets:write` | User, Admin |
| `transactions:read` | User, Admin |
| `transactions:write` | User, Admin |
| `ledger:read` | User, Admin |
| `notifications:read` | User, Admin |
| `notifications:write` | User, Admin |
| `audit:read` | Auditor, Admin |
| `reports:read` | Admin, Support |
| `reports:export` | Admin |
| `jobs:read` | Admin |
| `jobs:write` | Admin |

---

## API Client

### Configuration

The Axios client in `shared/api/client.ts`:

- Base URL from `VITE_API_URL` env var (defaults to `/api/v1`)
- Auto-attaches `Authorization: Bearer` header from auth store
- Auto-generates `X-Idempotency-Key` for POST/PUT/PATCH
- Auto-refreshes expired tokens (401 → refresh → retry)
- Global error interceptor for toast notifications

### Making API Calls

```tsx
// features/wallets/api/walletApi.ts
import { apiClient } from '@/shared/api/client';

export const walletApi = {
  getAll: () => apiClient.get('/wallets').then(r => r.data),
  getById: (id: string) => apiClient.get(`/wallets/${id}`).then(r => r.data),
  create: (data: CreateWalletRequest) => apiClient.post('/wallets', data).then(r => r.data),
};
```

---

## Error Handling

### API Errors

Errors from the backend follow the standard format. The interceptor maps them to user-friendly messages using `shared/constants/errorMessages.ts`:

```tsx
export const errorMessages: Record<string, string> = {
  VALIDATION_ERROR: 'Please check your input and try again.',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction.',
  WALLET_FROZEN: 'This wallet is currently frozen.',
  WALLET_CLOSED: 'This wallet has been closed.',
  DUPLICATE_TRANSACTION: 'This transaction has already been processed.',
  // ...
};
```

### In Components

```tsx
const { mutate, error, isError } = useCreateWallet();

{isError && (
  <Alert severity="error">
    {error?.response?.data?.detail || 'Something went wrong'}
  </Alert>
)}
```

---

## Adding a New Feature Module

1. **Create folder** `features/yourFeature/`
2. **Types** — `types/yourFeature.types.ts` with request/response interfaces
3. **API** — `api/yourFeatureApi.ts` with Axios calls
4. **Hooks** — `hooks/useYourFeature.ts` with TanStack Query hooks
5. **Pages** — `pages/YourFeaturePage.tsx`
6. **Route** — add lazy import and `<Route>` in `Router.tsx`
7. **Sidebar** — add nav item in `DashboardLayout`

Keep the module self-contained. Import only from `shared/` and `lib/`, never from other features.
