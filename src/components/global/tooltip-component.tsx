import React from 'react';
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import {
	Tooltip,
	TooltipArrow,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip';
interface TooltipComponentProps extends TooltipPrimitive.TooltipProps {
	children: React.ReactNode;
	message: string | React.ReactNode;
	side?: "top" | "right" | "bottom" | "left"
}

const TooltipComponent: React.FC<TooltipComponentProps> = ({ children, side, message, ...props }) => {
	return (
		<TooltipProvider  >
			<Tooltip {...props}>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent side={side}>{message}
					<TooltipArrow className='bg-white border-white text-white' />
				</TooltipContent >
			</Tooltip>
		</TooltipProvider>
	);
};

export default TooltipComponent;