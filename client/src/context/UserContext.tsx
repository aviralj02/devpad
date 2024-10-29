"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type Props = {
  children: ReactNode;
};

type UserContextType = {
  userName: string;
  setUserName: (name: string) => void;
};

const UserContext = createContext<UserContextType>({
  userName: "",
  setUserName: () => {},
});

export const UserProvider = ({ children }: Props) => {
  const [userName, setUserName] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userName") || "";
    }
    return "";
  });

  useEffect(() => {
    localStorage.setItem("userName", userName);
  }, [userName]);

  return (
    <UserContext.Provider value={{ userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
