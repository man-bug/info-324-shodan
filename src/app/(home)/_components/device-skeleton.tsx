import { Skeleton } from "@/components/ui/skeleton";

export default function DeviceSkeleton() {
    return (
        <li className="border-b p-4 px-6">
            <div className="grid lg:grid-cols-2 lg:grid-rows-1 gap-4">
                <div className="flex flex-col space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <div className="mt-auto">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
                <div className="flex flex-col space-y-2">
                    {Array(7)
                        .fill(0)
                        .map((_, index) => (
                            <div key={index} className="flex justify-between items-end">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ))}
                </div>
            </div>
        </li>
    );
}
