import React from 'react';
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from './ui/tooltip';
interface TooltipComponentProps extends TooltipPrimitive.TooltipProps {
	children: React.ReactNode;
	message: string | React.ReactNode;
}

const TooltipComponent: React.FC<TooltipComponentProps> = ({ children, message, ...props }) => {
	return (
		<TooltipProvider >
			<Tooltip {...props}>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent>{message}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default TooltipComponent;