import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useReducer,
} from "react";
// utils
import jwtDecode from "jwt-decode";
import { LOCAL_STORAGE_KEYS } from "../constants/local";
import authService from "../services/auth/auth.service";
import LocalUtils from "../utils/local";
import Utils from "../utils/utils";
import {
    ActionMapType,
    AuthStateType,
    AuthUserType,
    JWTContextType,
    UserType,
} from "./types";

// ----------------------------------------------------------------------

enum Types {
  INITIAL = "INITIAL",
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  LOGOUT = "LOGOUT",
}

type Payload = {
  [Types.INITIAL]: {
    isAuthenticated: boolean;
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const storageAvailable = Utils.localStorageAvailable();

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable
        ? LocalUtils.get(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
        : "";

      if (accessToken) {
        LocalUtils.set(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        const user = jwtDecode<UserType>(accessToken);
        const { Avatar, EmployeeId, Roles, Email, RefreshToken } = user;

        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: true,
            user: {
              refreshToken: RefreshToken,
              avatar: Avatar,
              employeeId: EmployeeId,
              email: Email,
              roles: Roles,
            },
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: Types.INITIAL,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.loginAsync({
      userName: "test",
      password: "test",
      isRemember: true,
    });

    const { token, RefreshToken } = response.data;
    const decodeToken = jwtDecode<UserType>(token);
    const { Avatar, EmployeeId, Roles, Email } = decodeToken;

    if (token) {
      LocalUtils.set(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, token);
      dispatch({
        type: Types.LOGIN,
        payload: {
          user: {
            refreshToken: RefreshToken,
            avatar: Avatar,
            employeeId: EmployeeId,
            email: Email,
            roles: Roles,
          },
        },
      });
    } else {
      //   SnakeBar.error(response.data.message);
    }
  }, []);

  // REGISTER
  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string
    ) => {
    //   const response = await authService.loginAsync({
    //     userName: "test",
    //     password: "test",
    //     isRemember: true,
    //   });
    //   const { accessToken, user } = response.data;

    //   localStorage.setItem("accessToken", accessToken);

    //   dispatch({
    //     type: Types.REGISTER,
    //     payload: {
    //       user,
    //     },
    //   });
    },
    []
  );

  // LOGOUT
  const logout = useCallback(() => {
    LocalUtils.clear();
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: "jwt",
      login,
      register,
      logout,
    }),
    [
      state.isAuthenticated,
      state.isInitialized,
      state.user,
      login,
      logout,
      register,
    ]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
