import { cn } from "@/lib/utils";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface FormErrorProps {
	message?: string;
	classname?: string
};

export const FormError = ({
	message,
	classname
}: FormErrorProps) => {
	if (!message) return null;

	return (
		<div className={cn("bg-red-300/30 text-base p-3 rounded-md flex items-center gap-x-2 text-destructive-foreground w-full", classname)}>
			<ExclamationTriangleIcon className="h-4 w-4" />
			<p>{message}</p>
		</div>
	);
};
