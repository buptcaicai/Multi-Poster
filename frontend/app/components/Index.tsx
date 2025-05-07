import { createContext, useState } from "react";
import MainHeader from "./MainHeader";
import PostList from "./PostList";

export const createNewOpenContext = createContext({open: false, setOpen: (b: boolean) => {}});

export function Index({posts}: {posts: Array<{text:string, name:string}>}) {
     const [showCreateNew, setShowCreateNew] = useState(false);
     return <>
       <MainHeader setShowCreateNew={setShowCreateNew}/>
       <main>
         <createNewOpenContext.Provider value={{open: showCreateNew, setOpen: setShowCreateNew}}>
            <PostList posts={posts}/>
         </createNewOpenContext.Provider>
       </main>
     </>
}