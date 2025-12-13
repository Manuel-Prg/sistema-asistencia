import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center p-4">
            <div className="space-y-4 w-full max-w-md">
                <div className="flex flex-col space-y-3">
                    <Skeleton className="h-[200px] w-full rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[80%]" />
                    </div>
                </div>
            </div>
        </div>
    )
}
