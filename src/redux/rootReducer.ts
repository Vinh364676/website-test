import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import productReducer from "./slices/product"
import categoryReducer from "./slices/category"
import brandReducer from "./slices/brand"
import addressReducer from "./slices/address"
import reviewReducer from "./slices/review"
import customerReducer from "./slices/customer"
import userReducer from "./slices/user"
import voucherReducer from "./slices/voucher"
import billReducer from "./slices/bill"
// ----------------------------------------------------------------------

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

export const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const rootReducer = combineReducers({
  product: productReducer,
  category:categoryReducer,
  brand:brandReducer,
  address:addressReducer,
  review:reviewReducer,
  customer:customerReducer,
  user:userReducer,
  voucher:voucherReducer,
  bill:billReducer,
});

export default rootReducer;
