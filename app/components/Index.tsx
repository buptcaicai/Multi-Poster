import { createContext, useState } from "react";
import MainHeader from "./MainHeader";
import PostList from "./PostList";

export const createNewOpenContext = createContext({open: false, setOpen: (b: boolean) => {}});

export function Index() {
     const [showCreateNew, setShowCreateNew] = useState(false);
     return <>
       <MainHeader setShowCreateNew={setShowCreateNew}/>
       <main>
         <createNewOpenContext.Provider value={{open: showCreateNew, setOpen: setShowCreateNew}}>
            <PostList/>
         </createNewOpenContext.Provider>
       </main>
     </>
}