"use client"
import { bulkDeleteTransactions } from '@/actions/accounts';
import { downloadTransactions } from '@/actions/download';
import formatINR from '@/app/lib/currency'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { categoryColors } from '@/data/catogories'
import useFetch from '@/hooks/use-fetch'
import { cn } from '@/lib/utils';
import { format } from 'date-fns'
import { CalendarIcon, ChevronDown, ChevronUp, Clock, DownloadIcon, Loader, MoreHorizontal, RefreshCcw, Search, TrashIcon, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { BarLoader } from 'react-spinners'
import { toast } from 'sonner'



const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

const TransactionTable = ({ transactions, accountData }) => {

  const [isExporting, setIsExporting] = useState(false);
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState([])
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc"
  })

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState(new Date())


  const handleExport = async (format) => {
    if (!startDate || !endDate) {
      toast.error('Please select a valid start and end date.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Start date cannot be after end date.");
      return;
    }

    setIsExporting(true);
    try {
      const accountId = accountData.id
      const result = await downloadTransactions(accountId, format, startDate, endDate);
      // Convert base64 string back to a Blob
      const blob = await (await fetch(`data:${result.mimeType};base64,${result.buffer}`)).blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Your download has started.");
    } catch (err) {
      console.error('Export failed', err);
      toast.error(err.message || 'Something went wrong while downloading the file.');
    } finally {
      setIsExporting(false);
    }
  };


  // Handle Select All
  const handleSort = (field) => {

    setSortConfig(current => ({
      field,
      direction:
        current.field == field && current.direction === "asc" ? "desc" : "asc"
    }))
  }


  const handleClearFilter = () => {
    setSearchTerm("")
    setTypeFilter("")
    setRecurringFilter("")
    setSelectedIds([])
    setSearchInput("")
  }

  const handleSelect = (id) => {
    setSelectedIds(current => current.includes(id)
      ? current.filter((items) => items != id)
      : [...current, id])

  }


  const handleSelectAll = () => {
    setSelectedIds(current => current.length === filteredAndSortedTransaction.length
      ? []
      : filteredAndSortedTransaction.map((t) => t.id)
    )
  }


  // delete bulk transactions
  const handleBulkDelete = async () => {
    await deleteFn(selectedIds.map(String));
    setSelectedIds([]);
  }

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleteData,

  } = useFetch(bulkDeleteTransactions)

  useEffect(() => {
    if (deleteData && !deleteLoading) {
      toast.error("Transaction deleted successfully");
    }
  }, [deleteLoading, deleteData])

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("")
  const [recurringFilter, setRecurringFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")

  //debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 200);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Filter and Search States
  const filteredAndSortedTransaction = useMemo(() => {

    let result = [...transactions]

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((transaction) =>
        transaction.description?.toLowerCase().includes(searchLower) ||
        transaction.category?.toLowerCase().includes(searchLower)
      )
    }

    if (recurringFilter) {
      result = result.filter((transaction) => {
        if (recurringFilter === "recurring") return transaction.isRecurring
        return !transaction.isRecurring
      })
    }

    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter)
    }

    result.sort((a, b) => {
      let comparison = 0

      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break;
        case "amount":
          comparison = a.amount - b.amount
          break;
        case "category":
          comparison = a.category.localeCompare(b.category)
          break;
        default:
          comparison = 0
      }

      return sortConfig.direction === "asc" ? comparison : -comparison

    })


    return result


  }, [
    transactions,
    searchTerm,
    typeFilter,
    recurringFilter,
    sortConfig
  ]);


  // const [itemsPerPage, setItemsPerPage] = useState(10); // Default fallback
  // const [currentPage, setCurrentPage] = useState(1);

  // const paginatedTransactions = useMemo(() => {
  //   const startIndex = (currentPage - 1) * itemsPerPage;
  //   const endIndex = startIndex + itemsPerPage;
  //   return filteredAndSortedTransaction.slice(startIndex, endIndex);
  // }, [filteredAndSortedTransaction, currentPage]);



  // Calculate how many items fit per screen height
  // const calculateItemsPerPage = () => {
  //   const rowHeight = 60; // Approximate height of one row in px (adjust to your UI)
  //   const headerHeight = 250; // Reserved space for filters/search/headers
  //   const availableHeight = window.innerHeight - headerHeight;
  //   const items = Math.floor(availableHeight / rowHeight);
  //   return Math.max(items, 5); // minimum 5 items per page
  // };

  // useEffect(() => {
  //   const updateItems = () => setItemsPerPage(calculateItemsPerPage());
  //   updateItems();
  //   window.addEventListener("resize", updateItems);
  //   return () => window.removeEventListener("resize", updateItems);
  // }, []);

  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const paginatedData = transactions.slice(startIndex, startIndex + itemsPerPage);
  // const totalPages = Math.ceil(transactions.length / itemsPerPage);


  return (
    <div className=' space-y-4 ' >
      {deleteLoading &&
        <BarLoader className='mt-4' width={"100%"} color='#9333ea' />
      }

      {/* Filter */}

      <div className='flex flex-col sm:flex-row gap-4' >
        <div className='relative flex-1 items-center ' >
          <Search className='absolute top-1/2 -translate-y-1/2 left-2 right-2.5 h-4 w-4 text-muted-foreground ' />
          <Input
            className='pl-8'
            placeholder='Search transactions...'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className='flex gap-2' >
          <Select value={typeFilter} onValueChange={setTypeFilter} >
            <SelectTrigger className={"cursor-pointer"} >
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className={"cursor-pointer"} >
              <SelectItem className={"cursor-pointer"} value="INCOME">Income</SelectItem>
              <SelectItem className={"cursor-pointer"} value="EXPENSE">Expense</SelectItem>

            </SelectContent>
          </Select>

          <Select value={recurringFilter} onValueChange={(value) => setRecurringFilter(value)} >
            <SelectTrigger className='w-[155px] cursor-pointer '>
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent className={"cursor-pointer"}>
              <SelectItem className={"cursor-pointer"} value="recurring">Recurring Only</SelectItem>
              <SelectItem className={"cursor-pointer"} value="non-recurring">Non-Recurring Only</SelectItem>
            </SelectContent>
          </Select>

          {/* <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="cursor-pointer">
                <DownloadIcon className="w-4 h-4" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[280px] p-4 space-y-4">
              <div className="flex flex-col gap-3">
                <label className="text-sm text-gray-600 font-medium">Select Date Range</label>
                <div className="flex flex-col gap-2">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  disabled={isExporting}
                  onClick={() => handleExport('pdf')}
                  className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 text-white rounded text-sm"
                >
                  {isExporting ? <Loader className="w-4 h-4 animate-spin" /> : "Download PDF"}
                </Button>
                <Button
                  disabled={isExporting}
                  onClick={() => handleExport('excel')}
                  className="bg-green-600 hover:bg-green-700 transition px-4 py-2 text-white rounded text-sm"
                >
                  {isExporting ? <Loader className="w-4 h-4 animate-spin" /> : "Download Excel"}
                </Button>
              </div>
            </PopoverContent>
          </Popover> */}

          {/* Export */}

          {transactions.length > 0 &&
            (
              <Popover>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="cursor-pointer">
                        <DownloadIcon className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top"  >
                    <p>Export Transactions</p>
                  </TooltipContent>
                </Tooltip>

                <PopoverContent className="w-[300px] p-4 space-y-4">
                  <div className="flex flex-col gap-3">
                    <label className="text-sm text-muted-foreground font-medium">Select Date Range</label>

                    {/* Start Date */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Start Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    {/* End Date */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "End Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate || new Date()}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      disabled={isExporting || !startDate || !endDate}
                      onClick={() => handleExport('pdf')}
                      className="bg-blue-600 hover:bg-blue-700 transition text-white rounded text-sm"
                    >
                      {isExporting ? <Loader className="w-4 h-4 animate-spin" /> : "Download PDF"}
                    </Button>
                    <Button
                      disabled={isExporting || !startDate || !endDate}
                      onClick={() => handleExport('excel')}
                      className="bg-green-600 hover:bg-green-700 transition text-white rounded text-sm"
                    >
                      {isExporting ? <Loader className="w-4 h-4 animate-spin" /> : "Download Excel"}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

            )}


          {selectedIds.length > 0 && <div className='flex items-center gap-2'>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={'destructive'} className={"cursor-pointer"} size="sm" >
                  <TrashIcon className='w-4 h-4 mr-1 cursor-pointer' />
                  Delete Selected ({selectedIds.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure want to delete {selectedIds.length} transactions?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className={"cursor-pointer"} onClick={() => setSelectedIds([])} >Cancel</AlertDialogCancel>
                  <AlertDialogAction className={"cursor-pointer"} onClick={handleBulkDelete} >Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>}

          {(searchTerm || typeFilter || recurringFilter)
            &&
            (
              <Button
                variant={'default'}
                size={'icon'}
                onClick={handleClearFilter}
                title='Clear Filter'
                className={"cursor-pointer"}
              >
                <X className='h-4 w-4 cursor-pointer' />
              </Button>
            )}

        </div>
      </div>




      {/* Transactions */}
      <div className="rounded-md border overflow-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
        <Table className="min-w-full" >
          <TableHeader >
            <TableRow className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800">
              <TableHead className="w-[50px] bg-gray-50 dark:bg-gray-800  " >
                <Checkbox onCheckedChange={handleSelectAll}
                  className={"cursor-pointer"}
                  checked={
                    selectedIds.length ===
                    filteredAndSortedTransaction.length &&
                    filteredAndSortedTransaction.length > 0
                  }
                />
              </TableHead>
              <TableHead
                className="bg-gray-50 dark:bg-gray-800 cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className='flex items-center'>Date{" "}
                  {sortConfig.field === "date" &&
                    (sortConfig.direction === "asc"
                      ?
                      <ChevronUp className='h-4 w-4 ml-1' />
                      :
                      <ChevronDown className='h-4 w-4 ml-1' />
                    )
                  }
                </div>
              </TableHead>
              <TableHead className="bg-gray-50 dark:bg-gray-800"   >Description</TableHead>

              <TableHead

                className="bg-gray-50 dark:bg-gray-800 cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className='flex items-center'>Category{" "}
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "asc"
                      ?
                      <ChevronUp className='h-4 w-4 ml-1' />
                      :
                      <ChevronDown className='h-4 w-4 ml-1' />
                    )
                  }

                </div>
              </TableHead>
              <TableHead
                className="bg-gray-50 dark:bg-gray-800 cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                <div className='flex items-center justify-end'>Amount{" "}
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc"
                      ?
                      <ChevronUp className='h-4 w-4 ml-1' />
                      :
                      <ChevronDown className='h-4 w-4 ml-1' />
                    )
                  }

                </div>
              </TableHead>

              <TableHead className="bg-gray-50 dark:bg-gray-800" >
                Recurring
              </TableHead>
              <TableHead className='w-[50px] bg-gray-50 dark:bg-gray-800 ' ></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransaction.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className='text-center text-muted-foreground ' >
                  No Transactions Found
                </TableCell>
              </TableRow>
            ) : (

              filteredAndSortedTransaction.map((transaction) => (
                <TableRow key={transaction.id}>

                  {/* CheckBox */}
                  <TableCell className={"cursor-pointer"} >
                    <Checkbox className={"cursor-pointer"} onCheckedChange={() => handleSelect(transaction.id)}
                      checked={selectedIds.includes(transaction.id)}
                    />
                  </TableCell>

                  {/* Transaction Date */}
                  <TableCell>
                    {format(new Date(transaction.date), "PP")}
                  </TableCell>

                  {/* Transaction description */}
                  <TableCell className="break-words whitespace-normal">
                    {transaction.description}
                  </TableCell>

                  {/* Transaction Category */}
                  <TableCell className='capitalize ' >
                    <span
                      style={{
                        color: categoryColors[transaction.category]
                      }}
                      className='text-sm'
                    >

                      {transaction.category}
                    </span>
                  </TableCell>

                  {/* Transaction Amount */}
                  <TableCell
                    className={(`text-right font-medium ${transaction.type === "EXPENSE" ? "text-red-500" : "text-green-600"} `)}

                  >
                    {transaction.type === 'EXPENSE' ? "- " : "+ "}
                    {formatINR(transaction.amount)}
                  </TableCell>


                  {/* Transaction isRecurring or not */}
                  <TableCell>
                    {transaction.isRecurring
                      ? (
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant={'default'} className='gap-1 cursor-pointer bg-purple-100 text-purple-700 hover:bg-purple-200' >
                              <RefreshCcw className='h-3 w-3' />
                              {transaction.recurringInterval ? RECURRING_INTERVALS[transaction.recurringInterval] : "Unknown"}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className='text-sm'>
                              <div className='font-medium' >Next occurrence:</div>
                              {transaction.nextRecurringDate
                                ? (
                                  <div>{format(new Date(transaction.nextRecurringDate), "PP")}</div>)
                                : <div>N/A</div>}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ) : <Badge variant={'outline'} className='gap-1' >
                        <Clock className='h-3 w-3' />
                        One-time
                      </Badge>
                    }
                  </TableCell>


                  {/* Extra option in dropdown */}
                  <TableCell>
                    <DropdownMenu >
                      <DropdownMenuTrigger asChild >
                        <Button variant='ghost' className='h-8 w-8 p-0 cursor-pointer ' >
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className={"cursor-pointer"} >

                        <DropdownMenuItem className={"cursor-pointer"}
                          onClick={() =>
                            router.push(
                              `/transaction/create?edit=${transaction.id}`
                            )
                          }
                        >Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className='text-destructive'
                          onClick={() => deleteFn([String(transaction.id)])}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))

            )}
          </TableBody>
        </Table>



      </div>
      {/* <div> */}

      {/* Pagination
      <div className="flex items-center justify-center gap-4 py-4 text-sm text-muted-foreground">
      {/* Previous Button 
      <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="w-8 h-8 flex items-center justify-center border rounded disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
        <span className="text-lg"><ArrowLeft className='w-4 h-4 text-mut ' /></span>
        </button>
        
        Page Info 
        <span className="select-none">
        Page {currentPage} of {Math.ceil(filteredAndSortedTransaction.length / totalPages)}
        </span>
        
        {/* Next Button 
        <button
        onClick={() =>
          setCurrentPage((prev) =>
            Math.min(prev + 1, Math.ceil(filteredAndSortedTransaction.length / totalPages))
        )
        }
        disabled={
          currentPage === Math.ceil(filteredAndSortedTransaction.length / totalPages)
          }
          className="w-8 h-8 flex items-center justify-center border rounded disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
          <span className="text-lg"><ArrowRight className='h-4 w-4 text-muted-foreground' /></span>
          </button>
          </div> */}

          
      {/* </div> */}

    </div>
  )
}

export default TransactionTable