import { FC } from 'react'
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';

type OverviewCountProps = {

  value: number
  label: string
}

export const OverviewCount: FC<OverviewCountProps> = ({ value, label }) => {

  const arrowColor = value > 0 ? "text-green-600" : "text-red-600";
  const arrowIcon = value > 0 ? (
    <>
      <IoMdArrowDropup size={20} /> {" + "}
    </>
  ) : (
    <>
      <IoMdArrowDropdown size={20} /> {" - "}
    </>
  );
  return <div className="flex items-center justify-center text-xs mt-4 ">
    <span className="flex items-center text-slate-700">{label}</span>
    <span className={`flex items-center gap-1 ml-2 ${arrowColor}`}>
      {arrowIcon} {Math.abs(value ? value : 0)}

    </span>
  </div>
}

