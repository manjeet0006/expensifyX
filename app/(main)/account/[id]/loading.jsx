"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from "lucide-react"


const rows = new Array(6).fill(null); // Number of placeholder rows


export default function Loading() {
  return (
    <div className=" w-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-20 w-1/3 rounded-md" />
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>

      {/*  Graph */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <Skeleton className="h-5 w-[140px]" />
          <Skeleton className="h-8 w-[100px] rounded-md" />
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 justify-around gap-4 mb-6 text-xs">
            <div className="text-center space-y-2">
              <Skeleton className="h-4 w-20 mx-auto" />
              <Skeleton className="h-6 w-24 mx-auto" />
            </div>
            <div className="text-center space-y-2">
              <Skeleton className="h-4 w-20 mx-auto" />
              <Skeleton className="h-6 w-24 mx-auto" />
            </div>
            <div className="text-center space-y-2">
              <Skeleton className="h-4 w-20 mx-auto" />
              <Skeleton className="h-6 w-24 mx-auto" />
            </div>
          </div>

          {/* Graph skeleton */}
          <div className="h-[300px] w-full space-y-3">
            <Skeleton className="h-full w-full rounded-xl" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
      {/* Filter Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-9 w-full sm:w-1/3" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-[120px]" />
          <Skeleton className="h-9 w-[155px]" />
          <Skeleton className="h-9 w-[40px]" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Skeleton className="h-4 w-4 mx-auto" />
              </TableHead>
              <TableHead><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead><Skeleton className="h-4 w-24" /></TableHead>
              <TableHead><Skeleton className="h-4 w-24" /></TableHead>
              <TableHead className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableHead>
              <TableHead><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead><Skeleton className="h-4 w-4 mx-auto" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((_, idx) => (
              <TableRow key={idx}>
                <TableCell><Skeleton className="h-4 w-4 mx-auto" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-4 mx-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
    </div>
  )
}
