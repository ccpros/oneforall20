import { Separator } from "@/components/ui/separator";

import Link from "next/link";



export default function Header() {
  return (
    <header className="fixed top-16 left-0 right-0 z-50 bg-gradient-to-r from-red-900/40 to-red">
      <div className="container lg:max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">           
              <span className="flex text-lg font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
              Welcome to the Library
              </span>            
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
      
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div className="hover:text-gray-400"><Link href="/library">Public Library</Link></div>
        <Separator orientation="vertical" />
        <div className="hover:text-gray-400"><Link href="/library/lawlib">Law Library</Link></div>
        <Separator orientation="vertical" />
        <div className="hover:text-gray-400">Course Resources</div>
      </div>
    </div>  
        </div>

            

          </div>
          </header>
  );
}
