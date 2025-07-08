"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-44 rounded-md" />
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>

      {/* Receipt Scanner */}
      <Skeleton className="h-24 w-full rounded-xl" />

      {/* Type Selector */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Amount & Account */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Date Picker */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Recurring toggle */}
      <div className="flex justify-between items-center border rounded-md p-4">
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-6 w-10 rounded-full" />
      </div>

      {/* Recurring interval (conditionally shown, but mimic it) */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  )
}
