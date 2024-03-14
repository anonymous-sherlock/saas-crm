"use client"
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export function Pagination({
    currentPage,
    totalPages,
}: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams()

    function generatePageLink(page: number) {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString())
        const url = `${pathname}?${params}`;
        return url
    }

    return (
        <div className="flex justify-between !mt-10">
            <Link
                href={generatePageLink(currentPage - 1)}
                className={cn(
                    "flex items-center gap-2 font-semibold",
                    currentPage <= 1 && "invisible",
                )}
            >
                <ArrowLeft size={16} />
                Previous page
            </Link>
            <span className="font-semibold">
                Page {currentPage} of {totalPages}
            </span>
            <Link
                href={generatePageLink(currentPage + 1)}
                className={cn(
                    "flex items-center gap-2 font-semibold",
                    currentPage >= totalPages && "invisible",
                )}
            >
                Next page
                <ArrowRight size={16} />
            </Link>
        </div>
    );
}
