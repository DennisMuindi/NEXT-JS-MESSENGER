import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DepartmentState {
  departmentId: string ;
  department : any
}

const initialState: DepartmentState = {
  departmentId: "",
  department:null
  
};

const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {
    setDepartmentId: (state, action: PayloadAction<string>) => {
      state.departmentId = action.payload;
    },
    setDepartmentDetails:(state, action:PayloadAction<any> ) =>{
      state.department =action.payload
    }
  
  },
});

export const {setDepartmentDetails } = departmentSlice.actions;
export const { setDepartmentId } = departmentSlice.actions

export default departmentSlice.reducer;
