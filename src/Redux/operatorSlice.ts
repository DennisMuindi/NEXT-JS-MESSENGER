import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OperatorState {
  operatorId: string;
  operator : any
  department : any
}

const initialState: OperatorState = {
  operatorId: "",
  operator: null,
  department:null
  
};

const operatorSlice = createSlice({
  name: 'operator',
  initialState,
  reducers: {
    setOperatorId: (state, action: PayloadAction<string>) => {
      state.operatorId = action.payload;
    },
    setOperatorDetails:(state, action:PayloadAction<any> ) =>{
      state.operator =action.payload
    },
    setDepartmentDetails:(state, action:PayloadAction<any> ) =>{
      state.department =action.payload
    }
  
  },
});

export const { setOperatorDetails } = operatorSlice.actions;
export const {setOperatorId } = operatorSlice.actions;

export default operatorSlice.reducer;
