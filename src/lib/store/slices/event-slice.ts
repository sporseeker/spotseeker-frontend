// store/slices/eventSlice.ts
import { ICommonEventState, IEvent } from "@/types/event/event";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface ITicketPackages extends ICommonEventState {
  freeSeating?: boolean;
}
interface EventState {
  event: IEvent | null;
  ticketPackages: ITicketPackages[];
  additions: ICommonEventState[];
}

const initialState: EventState = {
  event: null,
  ticketPackages: [],
  additions: [],
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setEvent: (state, action: PayloadAction<IEvent>) => {
      state.event = action.payload;
      state.ticketPackages = action.payload.ticket_packages.map((pkg) => ({
        id: pkg.id,
        count: 0,
        price: pkg.price,
        name: pkg.name,
        freeSeating: pkg.free_seating,
      }));
      state.additions = [];
    },
    updateTicketPackageCount: (
      state,
      action: PayloadAction<{ id: number; count: number }>,
    ) => {
      const { id, count } = action.payload;
      const packageToUpdate = state.ticketPackages.find((pkg) => pkg.id === id);
      if (packageToUpdate) {
        packageToUpdate.count = count;
      }
    },
    incrementTicketPackageCount: (state, action: PayloadAction<number>) => {
      const packageToIncrement = state.ticketPackages.find(
        (pkg) => pkg.id === action.payload,
      );
      if (packageToIncrement) {
        packageToIncrement.count += 1;
      }
    },
    decrementTicketPackageCount: (state, action: PayloadAction<number>) => {
      const packageToDecrement = state.ticketPackages.find(
        (pkg) => pkg.id === action.payload,
      );
      if (packageToDecrement && packageToDecrement.count > 0) {
        packageToDecrement.count -= 1;
      }
    },

    addAdditionItem: (
      state,
      action: PayloadAction<{
        id: number;
        count: number;
        price: string;
        name: string;
      }>,
    ) => {
      state.additions.push(action.payload);
    },

    updateAdditionCount: (
      state,
      action: PayloadAction<{ id: number; count: number }>,
    ) => {
      const { id, count } = action.payload;
      const additionToUpdate = state.additions.find((pkg) => pkg.id === id);
      if (additionToUpdate) {
        additionToUpdate.count = count;
      }
    },
    incrementAdditionCount: (state, action: PayloadAction<number>) => {
      const additionToIncrement = state.additions.find(
        (pkg) => pkg.id === action.payload,
      );
      if (additionToIncrement) {
        additionToIncrement.count += 1;
      }
    },
    decrementAdditionCount: (state, action: PayloadAction<number>) => {
      const additionToDecrement = state.additions.find(
        (pkg) => pkg.id === action.payload,
      );
      if (additionToDecrement && additionToDecrement.count > 0) {
        additionToDecrement.count -= 1;
      }
    },
    clearEvent: (state) => {
      state.event = null;
      state.ticketPackages = [];
      state.additions = [];
    },
  },
});

export const {
  setEvent,
  updateTicketPackageCount,
  incrementTicketPackageCount,
  decrementTicketPackageCount,
  addAdditionItem,
  updateAdditionCount,
  incrementAdditionCount,
  decrementAdditionCount,
  clearEvent,
} = eventSlice.actions;
export const eventReducer = eventSlice.reducer;
