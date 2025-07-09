import formatINR from "@/app/lib/currency";
import { Body, Container, Head, Heading, Hr, Html, Img, Preview, Section, Text } from "@react-email/components";

import * as React from "react";



export default function EmailTemplate(props) {
    const { userName = "" } = props;

    if (props.type === "monthly-report") {
        const { data } = props;
        return (
            <Html>
                <Head />
                <Preview>Your Monthly Financial Report</Preview>
                <Body style={styles.body}>
                    <Container style={styles.container}>
                        <Heading style={styles.title}>📊 Monthly Financial Report</Heading>

                        <Text style={styles.text}>Hello {userName || "there"},</Text>
                        <Text style={styles.text}>
                            Here's your financial summary for <strong>{data.month}</strong>:
                        </Text>

                        {/* Main Stats */}
                        <Section style={styles.statsContainer}>
                            <div style={styles.stat}>
                                <Text style={styles.text}>Total Income</Text>
                                <Text style={styles.heading}>₹{data.stats.totalIncome.toFixed(2)}</Text>
                            </div>
                            <div style={styles.stat}>
                                <Text style={styles.text}>Total Expenses</Text>
                                <Text style={styles.heading}>₹{data.stats.totalExpenses.toFixed(2)}</Text>
                            </div>
                            <div style={styles.stat}>
                                <Text style={styles.text}>Net Balance</Text>
                                <Text
                                    style={{
                                        ...styles.heading,
                                        color: data.stats.totalIncome - data.stats.totalExpenses >= 0 ? "green" : "red",
                                    }}
                                >
                                    ₹{(data.stats.totalIncome - data.stats.totalExpenses).toFixed(2)}
                                </Text>
                            </div>
                        </Section>

                        {/* Category Breakdown */}
                        {data.stats.byCategory && Object.keys(data.stats.byCategory).length > 0 && (
                            <Section style={styles.section}>
                                <Heading style={styles.heading}>💼 Expenses by Category</Heading>
                                {Object.entries(data.stats.byCategory).map(([category, amount]) => (
                                    <div key={category} style={styles.row}>
                                        <Text style={styles.text}>{category}</Text>
                                        <Text style={styles.text}>{" "}₹{Number(amount).toFixed(2)}</Text>
                                    </div>
                                ))}
                            </Section>
                        )}

                        {/* AI Insights */}
                        {data.insights && data.insights.length > 0 && (
                            <Section style={styles.section}>
                                <Heading style={styles.heading}>🤖 ExpensifyX Insights</Heading>
                                {data.insights.map((insight, index) => (
                                    <Text key={index} style={styles.text}>
                                        • {insight}
                                    </Text>
                                ))}
                            </Section>
                        )}

                        <Text style={styles.footer}>
                            Thank you for using <strong>ExpensifyX</strong>. Stay consistent with tracking to improve
                            your financial well-being!
                        </Text>
                    </Container>
                </Body>
            </Html>
        );


    }

    if (props.type === "budget-alert") {
        const { data } = props;
        return (
            <Html>
                <Head />
                <Preview>Budget Alert</Preview>
                <Body style={styles.body} >
                    <Container style={styles.container} >
                        <Heading style={styles.headingAlert} >Budget Alert</Heading>
                        <Text style={styles.text} >Hello {userName},</Text>
                        <Text style={styles.text} >
                            You&rsquo;ve used {data.percentageUsed.toFixed(2)}% of Your monthly budget.
                        </Text>
                        <Section style={styles.statsContainer} >
                            <div style={styles.stat} >
                                <Text style={styles.text} >
                                    Budget Amount
                                </Text>
                                <Text style={styles.heading} >
                                    {formatINR(data.budgetAmount)}
                                </Text>
                            </div>
                            <div style={styles.stat} >
                                <Text style={styles.text} >
                                    Spent So Far
                                </Text>
                                <Text style={styles.heading} >
                                    {formatINR(data.totalExpenses)}
                                </Text>
                            </div>
                            <div style={styles.stat} >
                                <Text style={styles.text} >Remaining</Text>
                                <Text style={styles.heading} >
                                    {formatINR(data.budgetAmount - data.totalExpenses)}
                                </Text>
                            </div>
                        </Section>
                    </Container>
                </Body>

            </Html>
        );

    }

    return null;
}


export const WelcomeTemplate = ({ name }) => (
    <div
        style={{
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f4f4f5',
            padding: '40px 16px',
            color: '#111827',
        }}
    >
        <div
            style={{
                maxWidth: '700px',
                margin: '0 auto',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
        >
            <h1 style={{ color: '#4f46e5', fontSize: '28px', marginBottom: '10px' }}>
                🎉 Welcome to ExpensifyX, {name}!
            </h1>

            <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
                We’re thrilled to have you on board. ExpensifyX is your all-in-one solution for tracking expenses, setting budgets, and gaining control over your finances.
            </p>

            <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
                You can now:
            </p>

            <ul style={{ fontSize: '16px', lineHeight: '1.8', paddingLeft: '20px', marginBottom: '20px' }}>
                <li>💳 Add and manage your accounts</li>
                <li>📊 Visualize your spending trends</li>
                <li>🔔 Get real-time budget alerts</li>
                <li>🧠 Use smart recommendations to save more</li>
            </ul>

            <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
                Need help getting started? Visit our <a href="https://expensifyx.site/help" style={{ color: '#4f46e5', textDecoration: 'none' }}>Help Center</a>.
            </p>

            <div style={{ textAlign: 'center' }}>
                <a
                    href="https://expensifyx.site/dashboard"
                    style={{
                        backgroundColor: '#4f46e5',
                        color: '#ffffff',
                        padding: '12px 24px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        display: 'inline-block',
                    }}
                >
                    🚀 Launch Dashboard
                </a>
            </div>

            <p style={{ fontSize: '14px', marginTop: '40px', color: '#6b7280' }}>
                — The ExpensifyX Team
            </p>
        </div>
    </div>
);


export const EmailForRecurring = ({ transaction }) => {
    const formattedDate = transaction.date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const nextDate = transaction.nextRecurringDate?.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <Html>
            <Body style={{ backgroundColor: "#f9fafb", fontFamily: "Arial, sans-serif", color: "#111827", padding: "20px" }}>
                <Container style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    padding: "24px",
                    maxWidth: "600px",
                    margin: "auto",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}>
                    <Img
                        src={transaction.user.imageUrl ?? ""}
                        width="48"
                        height="48"
                        alt="User Image"
                        style={{ borderRadius: "9999px", marginBottom: "20px" }}
                    />

                    <Heading as="h2" style={{ color: "#1f2937", marginBottom: "16px" }}>
                        Hello {transaction.user.name ?? "User"},
                    </Heading>

                    <Text style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "20px" }}>
                        This is a reminder that a <strong>recurring {transaction.type === "EXPENSE" ? "expense" : "income"}</strong> of
                        <span style={{ color: transaction.type === "EXPENSE" ? "#d9534f" : "#28a745", fontWeight: "bold" }}>
                            {" "} ₹{transaction.amount}
                        </span> for Category: <strong>{transaction.category}</strong> Description:  <strong>{transaction.description}</strong> was processed successfully from your account &quot;<strong>{transaction.account.name}</strong>&quot; on <strong>{formattedDate}</strong>.
                    </Text>

                    <Section style={{ backgroundColor: "#f3f4f6", padding: "16px", borderRadius: "8px", marginBottom: "20px" }}>
                        <Text><strong>💸 Amount:</strong> ₹{transaction.amount}</Text>
                        <Text><strong>📝 Description:</strong> {transaction.description}</Text>
                        <Text><strong>📂 Category:</strong> {transaction.category}</Text>
                        <Text><strong>🔁 Interval:</strong> {transaction.recurringInterval}</Text>
                        <Text><strong>📅 Next Date:</strong> {nextDate}</Text>
                        <Text><strong>🏦 Account Balance:</strong> ₹{transaction.account.balance.toFixed(2)}</Text>
                    </Section>

                    <Text style={{ fontSize: "14px", color: "#6b7280" }}>
                        This recurring transaction is scheduled monthly. You can manage or cancel it from your <a href="https://expensifyx.site/dashboard" style={{ color: "#3b82f6" }}>dashboard</a>.
                    </Text>

                    <Hr style={{ marginTop: "24px", marginBottom: "12px" }} />

                    <Text style={{ fontSize: "12px", color: "#9ca3af" }}>
                        If you didn&apos;t set this up, please <a href="https://expensifyx.site/support" style={{ color: "#3b82f6" }}>contact support</a> immediately.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}


const styles = {
    body: {
        backgroundColor: "#f6f9fc",
        fontFamily: "-apple-system, sans-serif",
    },
    container: {
        backgroundColor: "#ffffff",
        margin: "0 auto",
        padding: "20px",
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    title: {
        color: "#1f2937",
        fontSize: "32px",
        fontWeight: "bold",
        textAlign: "center" ,
        margin: "0 0 20px",
    },
    headingAlert: {
        color: "#ef4444",
        fontSize: "20px",
        fontWeight: "600",
        margin: "0 0 16px",
    },
    heading: {
        color: "#1f2937",
        fontSize: "20px",
        fontWeight: "600",
        margin: "0 0 16px",
    },
    text: {
        color: "#4b5563",
        fontSize: "16px",
        margin: "0 0 16px",
    },
    section: {
        marginTop: "32px",
        padding: "20px",
        backgroundColor: "#f9fafb",
        borderRadius: "5px",
        border: "1px solid #e5e7eb",
    },
    statsContainer: {
        margin: "32px 0",
        padding: "20px",
        backgroundColor: "#f9fafb",
        borderRadius: "5px",
    },
    stat: {
        marginBottom: "16px",
        padding: "12px",
        backgroundColor: "#fff",
        borderRadius: "4px",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    },
    row: {
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: "1px solid #e5e7eb",
    },
    footer: {
        color: "#6b7280",
        fontSize: "14px",
        textAlign: "center" , 
        marginTop: "32px",
        paddingTop: "16px",
        borderTop: "1px solid #e5e7eb",
    },
};