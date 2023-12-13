"use client"
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";
import { usePathname } from 'next/navigation'
import Link from "next/link";
import { SubMenuTypes } from "@/types";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface SubMenuProps {
  data: SubMenuTypes;
}

const SubMenu: React.FC<SubMenuProps> = ({ data }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState<Boolean>(false);

  useEffect(() => {
    const matchLabel = pathname.match(data.label.toLowerCase());
    setSubMenuOpen(!!matchLabel);
  }, [pathname, data.label])
  return (
    <>
      <li
        className={cn("link", pathname.match(data.label.toLowerCase()) && "text-blue-600 bg-slate-100", "hover:bg-gray-100 rounded-lg")}
        onClick={() => setSubMenuOpen(!subMenuOpen)}
      >
        <data.icon size={23} className={cn("min-w-max", !pathname.match(data.label.toLowerCase()) && "text-slate-500")} />
        <p className="flex-1 capitalize">{data.name}</p>
        <IoIosArrowDown
          className={` ${subMenuOpen && "rotate-180"} duration-200 `}
        />
      </li>
      <motion.ul
        animate={
          subMenuOpen || pathname.match(data.label.toLowerCase())
            ? {
              height: subMenuOpen === false ? 0 : "fit-content",
            }
            : {
              height: 0,
            }
        }
        className="flex h-0 flex-col pl-14 text-[0.8rem] font-normal overflow-hidden"
      >
        {
          data.isAdmin
        }
        {data.menus?.map((menu) => {
          return (

            <li key={menu.id} className={cn("hover:text-blue-600 hover:font-medium", pathname.endsWith(menu.url) && "text-blue-600 bg-slate-100 rounded-md")}>

              <Link
                href={menu.url}
                className="link !bg-transparent capitalize"
              >
                {menu.label}
              </Link>
            </li>
          )
        })}
      </motion.ul>
    </>
  );
};

export default SubMenu;