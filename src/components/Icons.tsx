import { LucideProps, User } from 'lucide-react'

export const Icons = {
  user: User,
  logo: (props: LucideProps) => (
    <svg {...props} viewBox='0 0 24 24'>
      <path d='m6.94 14.036c-.233.624-.43 1.2-.606 1.783.96-.697 2.101-1.139 3.418-1.304 2.513-.314 4.746-1.973 5.876-4.058l-1.456-1.455 1.413-1.415 1-1.001c.43-.43.915-1.224 1.428-2.368-5.593.867-9.018 4.292-11.074 9.818zm10.06-5.035 1 .999c-1 3-4 6-8 6.5-2.669.334-4.336 2.167-5.002 5.5h-1.998c1-6 3-20 18-20-1 2.997-1.998 4.996-2.997 5.997z' />
    </svg>
  ),
  liveData: (props: LucideProps) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
    </svg>
  ),
  Leads: (props: LucideProps) => (
    <svg
      {...props}
      width="12"
      height="12"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1V18C1 19.66 2.34 21 4 21H21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M4 16L8.59 10.64C9.35 9.76001 10.7 9.7 11.52 10.53L12.47 11.48C13.29 12.3 14.64 12.25 15.4 11.37L20 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  ),
  Sales: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 512.001 512.001"
      width="12"
      height="12"
    >
      <path
        fill="currentColor"
        d="M506.35,80.699c-7.57-7.589-19.834-7.609-27.43-0.052L331.662,227.31l-42.557-42.557c-7.577-7.57-19.846-7.577-27.423,0 L89.076,357.36c-7.577,7.57-7.577,19.853,0,27.423c3.782,3.788,8.747,5.682,13.712,5.682c4.958,0,9.93-1.894,13.711-5.682 l158.895-158.888l42.531,42.524c7.57,7.57,19.808,7.577,27.397,0.032l160.97-160.323 C513.881,100.571,513.907,88.288,506.35,80.699z"
      ></path>
      <path
        fill="currentColor"
        d="M491.96,449.94H38.788V42.667c0-10.712-8.682-19.394-19.394-19.394S0,31.955,0,42.667v426.667 c0,10.712,8.682,19.394,19.394,19.394H491.96c10.712,0,19.394-8.682,19.394-19.394C511.354,458.622,502.672,449.94,491.96,449.94z"
      ></path>
      <path
        fill="currentColor"
        d="M492.606,74.344H347.152c-10.712,0-19.394,8.682-19.394,19.394s8.682,19.394,19.394,19.394h126.061v126.067 c0,10.705,8.682,19.394,19.394,19.394S512,249.904,512,239.192V93.738C512,83.026,503.318,74.344,492.606,74.344z"
      ></path>
    </svg>
  ),
  Customers: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 512.001 512.001"
      width="12"
      height="12"
    >
      <path
        fill="currentColor"
        d="M506.35,80.699c-7.57-7.589-19.834-7.609-27.43-0.052L331.662,227.31l-42.557-42.557c-7.577-7.57-19.846-7.577-27.423,0 L89.076,357.36c-7.577,7.57-7.577,19.853,0,27.423c3.782,3.788,8.747,5.682,13.712,5.682c4.958,0,9.93-1.894,13.711-5.682 l158.895-158.888l42.531,42.524c7.57,7.57,19.808,7.577,27.397,0.032l160.97-160.323 C513.881,100.571,513.907,88.288,506.35,80.699z"
      ></path>
      <path
        fill="currentColor"
        d="M491.96,449.94H38.788V42.667c0-10.712-8.682-19.394-19.394-19.394S0,31.955,0,42.667v426.667 c0,10.712,8.682,19.394,19.394,19.394H491.96c10.712,0,19.394-8.682,19.394-19.394C511.354,458.622,502.672,449.94,491.96,449.94z"
      ></path>
      <path
        fill="currentColor"
        d="M492.606,74.344H347.152c-10.712,0-19.394,8.682-19.394,19.394s8.682,19.394,19.394,19.394h126.061v126.067 c0,10.705,8.682,19.394,19.394,19.394S512,249.904,512,239.192V93.738C512,83.026,503.318,74.344,492.606,74.344z"
      ></path>
    </svg>
  ),
  GrowthChart: (props: LucideProps) => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.37 7.87988H16.62"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M5.38 7.87988L6.13 8.62988L8.38 6.37988"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M11.37 14.8799H16.62"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M5.38 14.8799L6.13 15.6299L8.38 13.3799"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M8 21H14C19 21 21 19 21 14V8C21 3 19 1 14 1H8C3 1 1 3 1 8V14C1 19 3 21 8 21Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  ),
  spinner: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  settings: (props: LucideProps) => (
    <svg className="with-icon_icon__MHUeb" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"></path>
    </svg>
  ),
  warning: (props: LucideProps) => {
    <svg fill="none" height="36" opacity="1" viewBox="0 0 36 36" width="36" xmlns="http://www.w3.org/2000/svg"><rect fill="#FFFBEB" height="35" rx="17.5" width="35" x="0.5" y="0.5"></rect><g clip-path="url(#clip0_798_8667)"><path d="M16.575 11.2167L9.51665 23C9.37113 23.252 9.29413 23.5377 9.29331 23.8288C9.2925 24.1198 9.3679 24.4059 9.51201 24.6588C9.65612 24.9116 9.86392 25.1223 10.1147 25.2699C10.3656 25.4174 10.6507 25.4968 10.9417 25.5H25.0583C25.3493 25.4968 25.6344 25.4174 25.8852 25.2699C26.136 25.1223 26.3439 24.9116 26.488 24.6588C26.6321 24.4059 26.7075 24.1198 26.7067 23.8288C26.7058 23.5377 26.6288 23.252 26.4833 23L19.425 11.2167C19.2764 10.9717 19.0673 10.7693 18.8176 10.6287C18.568 10.4882 18.2864 10.4144 18 10.4144C17.7135 10.4144 17.4319 10.4882 17.1823 10.6287C16.9327 10.7693 16.7235 10.9717 16.575 11.2167V11.2167Z" stroke="#BD5200" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18 22.1667H18.0083" stroke="#BD5200" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18 15.5V18.8333" stroke="#BD5200" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></g><rect height="35" rx="17.5" stroke="#FEF3C7" width="35" x="0.5" y="0.5"></rect><defs><clipPath id="clip0_798_8667"><rect fill="white" height="20" transform="translate(8 8)" width="20"></rect></clipPath></defs></svg>
  }
}

export { Activity, HelpCircle, LifeBuoy, Settings } from "lucide-react";
export { CiCreditCard1 } from "react-icons/ci";
export { HiOutlineUser } from "react-icons/hi";
