'use client'

import { selectStatus, selectTheme, toggleThemeAsync } from "@/lib/state/features/theme/themeSlice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

export default function Counter(){

    const theme = useAppSelector(selectTheme);
    const status = useAppSelector(selectStatus);
    const dispatch = useAppDispatch();

    return (
        <div className={`min-h-screen ${theme == 'light' ? 'bg-red-600' : 'bg-blue-600'}`}>
            {
                status == 'pending' ? <div>Loading...</div> : (
                    <div className="flex gap-2">
                    <button
                      aria-label="Increment value"
                    //   onClick={() => dispatch(toggleTheme(theme == 'light' ? 'dark' : 'light'))}
                      onClick={() => dispatch(toggleThemeAsync(theme == 'light' ? 'dark' : 'light'))}
                    >
                      Toggle theme
                    </button>
                    <span>{theme}</span>
                    {/* <button
                      aria-label="Decrement value"
                      onClick={() => dispatch(decrement())}
                    >
                      Decrement
                    </button>


                    <button onClick={()=> dispatch(incrementAsync(20))}>
                        Async Increment
                    </button> */}
                  </div>
                )
            }

    </div>
    )
}