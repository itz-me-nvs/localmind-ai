"use client";

import { AppStore, makeStore } from "@/lib/state/store";
import { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";

interface Props {
  readonly children: React.ReactNode;
}

export const StoreProvider = ({ children }: Props) => {
  const storeRef = useRef<AppStore | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(()=> {
    setMounted(true);

    const storedTheme = localStorage.getItem('theme');

    if(storedTheme){
      if(storedTheme == 'dark'){
        document.documentElement.classList.add("dark");
      }
      else {
        document.documentElement.classList.remove("dark");
      }
    }
    else if(window.matchMedia('(prefers-color-scheme: dark)').matches){
      document.documentElement.classList.add("dark");

    }
  }, [])

  useEffect(() => {
    if (!storeRef.current) {
      storeRef.current = makeStore();
    }
  }, []);

  if (!mounted || !storeRef.current)  return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin h-10 w-10 border-4 border-gray-300 rounded-full border-t-blue-500"></div>
      </div>
    );

  return <Provider store={storeRef.current}>{children}</Provider>;
};
