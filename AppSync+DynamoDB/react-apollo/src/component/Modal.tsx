import { type ReactElement } from "react";

export default function Modal({children, width, height, isVisible, setVisible} : 
   {children: ReactElement, width: string, height: string, isVisible: boolean, setVisible: (visible:boolean) => void}) {

   if (isVisible) {
      return <div className="absolute top-0 left-0 w-[100%] h-[100%] bg-gray-800/90 z-10 flex items-center justify-center"
                  onClick={() => {setVisible(false)}}>
               <div className={`relative ${width} ${height}`} onClick={(e) => e.stopPropagation()}>{children}</div>
             </div>
   } else {
      return null;
   }
}
