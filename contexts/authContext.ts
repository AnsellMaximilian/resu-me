import { UserObject } from "@/hooks/useAuth";
import { createContext, useContext } from "react";

interface AuthContext {
  currentAccount: UserObject | null;
}

export const AuthContext = createContext<AuthContext>({ currentAccount: null });
