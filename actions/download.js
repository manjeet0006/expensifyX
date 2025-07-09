"use server";

import path from 'path';
import { createWriteStream } from 'fs';
import { readFile, unlink } from 'fs/promises';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit-table';
import { db } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';


const FORMATS = {
    EXCEL: 'excel',
    PDF: 'pdf',
};

const MIME_TYPES = {
    [FORMATS.EXCEL]: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    [FORMATS.PDF]: 'application/pdf',
};

const RECURRING_INTERVALS = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
};

// /**
//  * Generates a table in a PDF document from transaction data.


export const generatePdfTable = async (doc, transactions) => {
  if (!doc.table) {
    throw new Error("pdfkit-table is not working. Make sure it's installed and imported.");
  }

  const table = {
    title: "Transaction Report",
    subtitle: `Total Transactions: ${transactions.length}`,
    headers: [
      "Description", "Amount", "Date", "Type", "Account", "Category", "Recurring", "Interval", "Next Date", "Created", "Updated"
    ],
    rows: transactions.map(tx => ([
      tx.description,
      `₹${tx.amount.toNumber().toFixed(2)}`,
      tx.date.toISOString().split('T')[0],
      tx.type,
      tx.account?.name || 'N/A',
      tx.category || 'N/A',
      tx.isRecurring ? 'Yes' : 'No',
      tx.recurringInterval ? RECURRING_INTERVALS[tx.recurringInterval] : 'N/A',
      tx.nextRecurringDate ? new Date(tx.nextRecurringDate).toISOString().split('T')[0] : 'N/A',
      new Date(tx.createdAt).toISOString().split('T')[0],
      new Date(tx.updatedAt).toISOString().split('T')[0],
    ]))
  };

  await doc.table(table, {
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(9),
    prepareRow: (row, i) => doc.font("Helvetica").fontSize(8)
  });
};

/**
 * Fetches transactions and generates a downloadable file (Excel or PDF).

 */
export async function downloadTransactions(accountId, format, startDate, endDate) {

    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
        where: { clerkUserId: userId }
    })

    if (!user) {
        throw new Error("User not Found")
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    // Ensure the entire end day is included in the query
    end.setUTCHours(23, 59, 59, 999);

    const transactions = await db.transaction.findMany({
        where: {
            userId: user.id,
            accountId,
            date: {
                gte: start,
                lte: end,
            },
        },
        include: { account: true },
        orderBy: { date: 'desc' },
    });



    if (!transactions.length) {
        throw new Error('No transactions found in the selected date range.');
    }

    const formattedStartDate = start.toISOString().split('T')[0];
    const formattedEndDate = end.toISOString().split('T')[0];
    const filename = `transactions_${formattedStartDate}_to_${formattedEndDate}.${format === FORMATS.EXCEL ? 'xlsx' : 'pdf'}`;
    const filepath = path.join('/tmp', filename);

    if (format === FORMATS.EXCEL) {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Transactions');

        sheet.columns = [
            { header: 'Description', key: 'description', width: 30 },
            { header: 'Amount', key: 'amount', width: 15, style: { numFmt: '"₹"#,##0.00' } },
            { header: 'Date', key: 'date', width: 20 },
            { header: 'Type', key: 'type', width: 15 },
            { header: 'Account', key: 'account', width: 25 },
            { header: 'Category', key: 'category', width: 20 },
            { header: 'Is Recurring', key: 'isRecurring', width: 15 },
            { header: 'Recurring Interval', key: 'recurringInterval', width: 20 },
            { header: 'Next Recurring Date', key: 'nextRecurringDate', width: 20 },
            { header: 'Created At', key: 'createdAt', width: 20 },
            { header: 'Updated At', key: 'updatedAt', width: 20 },
        ];

        transactions.forEach(tx => {
            sheet.addRow({
                description: tx.description,
                amount: tx.amount.toNumber(),
                date: tx.date,
                type: tx.type,
                account: tx.account?.name || 'N/A',
                category: tx.category,
                isRecurring: tx.isRecurring ? 'Yes' : 'No',
                recurringInterval: tx.recurringInterval ? RECURRING_INTERVALS[tx.recurringInterval] : 'N/A',
                nextRecurringDate: tx.nextRecurringDate ? new Date(tx.nextRecurringDate) : 'N/A',
                createdAt: tx.createdAt,
                updatedAt: tx.updatedAt,
            });
        });

        await workbook.xlsx.writeFile(filepath);
    } else if (format === FORMATS.PDF) {
        const doc = new PDFDocument({ margin: 50, layout: 'landscape' });
        const stream = createWriteStream(filepath);
        doc.pipe(stream);

        // Title and Date Range
        doc.fontSize(18).text('Transactions Report', { align: 'center' }).moveDown(0.5);
        doc.fontSize(12).text(`From: ${formattedStartDate} To: ${formattedEndDate}`, { align: 'center' }).moveDown(1.5);

        // Await the async table generation
        await generatePdfTable(doc, transactions); // <- now returns a Promise

        doc.end();

        // Wait until PDF file is fully written
        await new Promise((resolve, reject) => {
            stream.on('finish', resolve);
            stream.on('error', reject);
        });
    } else {
        throw new Error('Invalid format specified.');
    }

    const fileBuffer = await readFile(filepath);
    await unlink(filepath); // Clean up the temp file

    return {
        buffer: fileBuffer.toString('base64'),
        filename,
        mimeType: MIME_TYPES[format],
    };
}