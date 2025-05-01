import { useState, type ReactElement } from "react";

export default function Modal({children, width, height, isVisible} : 
   {children: ReactElement, width: string, height: string, isVisible: boolean}) {
   
   let [open, setOpen] = useState(isVisible);
   if (open) {
      return <div className="absolute top-0 left-0 w-[100%] h-[100%] bg-gray-800 z-10 opacity-90 flex items-center justify-center"
                  onClick={(e) => setOpen(false)}>
               <div className={`relative bg-transparent ${width} ${height}`} onClick={(e) => e.stopPropagation()}>{children}</div>
             </div>
   } else {
      return null;
   }
}
