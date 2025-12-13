import { Skeleton } from "@/components/ui/skeleton"

export default function SupervisorLoading() {
    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8 animate-in fade-in-50">
            {/* Header Skeleton */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-800 rounded-2xl opacity-20"></div>
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>

            {/* Table Skeleton */}
            <div className="rounded-md border bg-card">
                <div className="p-4">
                    <div className="flex items-center gap-4 mb-4">
                        <Skeleton className="h-10 w-full max-w-sm" />
                        <Skeleton className="h-10 w-24 ml-auto" />
                    </div>
                    <div className="space-y-4">
                        {/* Table Header */}
                        <div className="flex gap-4 border-b pb-4">
                            <Skeleton className="h-4 w-[20%]" />
                            <Skeleton className="h-4 w-[20%]" />
                            <Skeleton className="h-4 w-[20%]" />
                            <Skeleton className="h-4 w-[20%]" />
                            <Skeleton className="h-4 w-[20%]" />
                        </div>

                        {/* Table Rows */}
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="flex gap-4 py-2">
                                <Skeleton className="h-12 w-[20%]" />
                                <Skeleton className="h-12 w-[20%]" />
                                <Skeleton className="h-12 w-[20%]" />
                                <Skeleton className="h-12 w-[20%]" />
                                <Skeleton className="h-12 w-[20%]" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
