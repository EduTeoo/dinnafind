import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Import store and persistor
import { persistor, store } from '@/store';

// Get types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Create typed hooks for this React Native app
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Re-export the store and persistor
export { persistor, store };
