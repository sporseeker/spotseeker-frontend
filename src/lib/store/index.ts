import { configureStore } from "@reduxjs/toolkit";
import { filterReducer } from "./slices/filter-slice";
import { eventReducer } from "./slices/event-slice";
import { authReducer } from "./slices/auth-slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      filter: filterReducer,
      event: eventReducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["filter/setDate"],
          ignoredPaths: ["filter.date.from", "filter.date.to"],
        },
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
