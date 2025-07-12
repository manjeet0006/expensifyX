# ExpensifyX 💸

<p align="center">
    <img src="./public/logof.png" alt="ExpensifyX Logo" width="120">
</p>

<p align="center">
  A modern, full-stack expense tracking application designed to help you take control of your finances with a clean, intuitive, and powerful interface.
</p>

<p align="center">
  <!-- Badges -->
  <img src="https://img.shields.io/github/last-commit/your-username/expensifyx?style=for-the-badge&logo=github&logoColor=white&color=black" alt="Last Commit">
  <img src="https://img.shields.io/github/languages/top/your-username/expensifyx?style=for-the-badge&color=blue" alt="Top Language">
  <img src="https://img.shields.io/badge/coverage-97.7%25-brightgreen?style=for-the-badge" alt="Code Coverage">
  <img src="https://img.shields.io/github/license/your-username/expensifyx?style=for-the-badge&color=lightgrey" alt="License">
</p>

<p align="center">
  <a href="https://expensifyx.site" target="_blank">
    <img src="https://img.shields.io/badge/Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo"/>
  </a>
</p>

<p align="center">
  <a href="#-key-features">Key Features</a> •
  <a href="#-tech-stack--tools">Tech Stack</a> •
  <a href="#️-project-structure">Project Structure</a> •
  <a href="#-quick-start-running-locally">Quick Start</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

## ✨ Key Features

- **🔐 Secure Authentication**: Robust user sign-in and sign-up with Clerk, supporting both Email OTP and Google OAuth.
- **📊 Interactive Dashboard**: A central hub to view and filter transactions by account, providing a clear financial overview.
- **💸 Full Transaction Management**: Seamlessly add, edit, and delete income and expense records.
- **🔁 Recurring Transactions**: Set up recurring payments, and the app automatically calculates and displays the next occurrence date.
- **📄 Data Export**: Download your transaction history as a PDF or Excel file, with flexible date range filtering.
- **📱 Responsive & Modern UI**: Built with Tailwind CSS and shadcn/ui for a beautiful, consistent experience on any device.
- **🔒 Protected Routes**: Server-side middleware ensures that your financial data is always secure and private.
- **🚀 Optimized Performance**: Custom loading states, spinners, and optimized builds for a fast, smooth user experience.

## 📸 Screenshots

<details>
<summary>Click to view application screenshots</summary>
  

  ### Landing Page
<img src="./public/landingPage.png" alt="Landing Page" width="100%">

### Dashboard Page
<img src="./public/dashboard.png" alt="Dashboard View" width="100%">

  ### Accounts & Transaction
<img src="./public/transaction-chart.png" alt="Account Chart" width="100%">
<img src="./public/transaction-table.png" alt="Account Table" width="100%">

  ### Account Add view
<img src="./public/addAccount.png" alt="Account Add View" width="100%">

  ### Create Transaction
<img src="./public/add-transaction.png" alt="Transaction Create" width="100%">



<br/><br/>
<br/>
<br/>
<br/>

# Mail ✉️

  ### Welcome Mail
<img src="./public/welcome-mail.jpeg" alt="Welcome Mail" width="50%">

  ### Recurring Transaction
<img src="./public/recurring-tran.png" alt="Recurring Transaction Mail" width="100%">

  ### Budget Alert
<img src="./public/budget-alert-mail.png" alt="Budget Alert Mail" width="100%">

  ### Monthly report
<img src="./public/monthly-1.png" alt="Monthly report  Mail" width="100%">
<img src="./public/monthly-2.png" alt="Monthly report  Mail" width="100%">

<!-- Add your screenshots here -->
<!-- Example: -->
<!-- <img src="https/path/to/dashboard.png" alt="Dashboard View" width="100%"> -->
<!-- <img src="https/path/to/transactions.png" alt="Transactions View" width="100%"> -->

</details>

---

## 🔧 Tech Stack & Tools

A curated list of modern technologies powering ExpensifyX:

<p align="left">
  <!-- Tech Badges -->
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk">
  <img src="https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white" alt="Resend">
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod">
  <img src="https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white" alt="React Hook Form">
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
</p>

*   **Framework**: Next.js (App Router)
*   **ORM**: Prisma
*   **Database**: PostgreSQL
*   **Authentication**: Clerk
*   **Styling**: Tailwind CSS & shadcn/ui
*   **Form Management**: React Hook Form & Zod
*   **Email**: Resend
*   **File Export**: ExcelJS & PDFKit
*   **Date Handling**: date-fns
*   **Deployment**: Vercel

---

## 🏗️ Project Structure

The project follows a standard Next.js App Router structure, keeping code organized and scalable based on features.

```
expensifyx/
├── app/                # Next.js App Router: pages, layouts, and components
│   ├── (auth)/         # Authentication routes (sign-in, sign-up)
│   └── (main)/         # Protected routes for authenticated users
├── actions/            # Server Actions for data mutation (`use server`)
├── components/         # Shared/reusable UI components (shadcn/ui)
├── lib/                # Helper functions, utils, and library instances
└── prisma/             # Prisma schema and database migrations
```

---

## 🚀 Quick Start: Running Locally

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/expensifyx.git
cd expensifyx
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root of the project by copying the example file:
```bash
cp .env.example .env
```
Then, fill in the required credentials for Clerk, Resend, and your PostgreSQL database.

```env
# .env

# Clerk Authentication (https://clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="**********"
CLERK_SECRET_KEY="**********"
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

## Database (e.g., Vercel Postgres or Neon)
DATABASE_URL="*********************************"

## Resend (https://resend.com)
RESEND_API_KEY="***************"
```

### 4. Run Database Migrations
Apply the database schema to your PostgreSQL instance:
```bash
npx prisma migrate dev
```

### 5. Start the Development Server
```bash
npm run dev
```

Your application should now be running at `http://localhost:3000`.

---

## 📤 Deployment

This application is optimized for deployment on **Vercel**. Simply connect your GitHub repository to a new Vercel project.

1.  **Push to GitHub**: Ensure your code is pushed to a GitHub repository.
2.  **Import Project on Vercel**: Select your repository and let Vercel configure the build settings.
3.  **Add Environment Variables**: Add the same environment variables from your `.env` file to the Vercel project settings.
4.  **Deploy**: Vercel will automatically build and deploy your application. Future pushes to the `main` branch will trigger automatic redeployments.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📜 License

This project is licensed under the **MIT License**. See the LICENSE file for more details.
