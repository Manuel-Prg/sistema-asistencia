import { Skeleton } from "@/components/ui/skeleton"

export default function StudentLoading() {
    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in-50">
            {/* Header Section Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48 sm:w-64" />
                    <Skeleton className="h-4 w-64 sm:w-80" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
            </div>

            {/* Cards Grid Skeleton */}
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                {/* Progress Card Skeleton */}
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                        <div className="pt-4">
                            <Skeleton className="h-20 w-full" />
                        </div>
                    </div>
                </div>

                {/* Check In/Out Card Skeleton */}
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                        <div className="flex justify-center py-4">
                            <Skeleton className="h-32 w-32 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendance History Skeleton */}
            <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="p-6">
                    <div className="mb-4">
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                                <Skeleton className="h-6 w-20" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
