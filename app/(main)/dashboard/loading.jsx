"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-3/4 rounded-md" />
        <Loader2 className="h-5 w-5  animate-spin text-muted-foreground" />
      </div>

      {/* Budget */}
      <Skeleton className="h-50 w-full rounded-xl" />

      {/* Recent Transactions Skeleton */}
      <div className="flex space-x-6">
        <div className="flex-1 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-80 w-full rounded-md flex justify-end" >
            <Skeleton className="h-10 w-28 m-5 bg-gray-200 rounded-sm " ></Skeleton>
          </Skeleton>
        </div>
        <div className="flex-1 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-80 w-full rounded-md" />
        </div>
      </div>


      {/* Amount & Account */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>

      </div>



    </div>
  )
}
