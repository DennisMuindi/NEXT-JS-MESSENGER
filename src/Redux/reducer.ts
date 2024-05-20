import { combineReducers } from 'redux';
import organizationReducer from './organizationSlice';
import operatorReducer from './operatorSlice'
import departmentReducer from './departmentSlice';

const rootReducer = combineReducers({
  organization: organizationReducer,
  operator: operatorReducer,
  department: departmentReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
