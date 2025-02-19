/** @format */
import { User } from "./interfaces";
import { createContext } from "react";

export const SessionContext = createContext<{
  user: User;
  setuser: React.Dispatch<React.SetStateAction<User>>;
}>({
  user: {
    name: "",
    pass: "",
    token: "",
    email: "",
  },
  setuser: () => {},
});

export const URL = "https://vote-app-gq2h.onrender.com";
