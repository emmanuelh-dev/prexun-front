import Image from "next/image";
import { InvoiceClient } from "./invoice_page";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
// app/invoices/[slug]/page.js
async function getInvoiceData(slug) {
    console.log("API_URL", API_URL);
    const res = await fetch(`${API_URL}/api/invoice/${slug}`, {
        // Next.js 14 cache options
        cache: 'force-cache', // Default, SSG behavior
        // cache: 'no-store', // For dynamic data
        // next: {
        //   revalidate: 60 // ISR behavior, revalidate every 60 seconds
        // }
    });

    if (!res.ok) {
        throw new Error('Failed to fetch invoice');
    }

    return res.json();
}

// Server Component
export default async function InvoicePage({ params }) {
    try {
        const invoice = await getInvoiceData(params.slug);
        console.log(invoice);
        return <InvoiceClient invoice={invoice} />;
    } catch (error) {
        return (
            <div className="flex items-center justify-center h-screen w-screen bg-[#F0F0F0]">
                <div className="text-center">
                    <p className="text-black text-lg text-pretty">No encontramos la factura que estas buscando.</p>
                    <Image src="/dog.png" alt="404" width={400} height={400} />
                </div>
            </div>
        );
    }
}