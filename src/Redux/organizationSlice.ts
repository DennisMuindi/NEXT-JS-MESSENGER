import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrganizationState {
  id: string | {} | undefined | null |string[];
}

const initialState: OrganizationState = {
  id: null,
 
};

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setOrganizationId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
  },
});

export const { setOrganizationId } = organizationSlice.actions;


export default organizationSlice.reducer;
