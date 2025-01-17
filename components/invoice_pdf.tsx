import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { FileDown } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';

declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => any;
    }
}
const generateWatermark = (doc, isPaid) => {
    doc.setFontSize(60);
    doc.setTextColor(200, 200, 200);
    doc.setFont(undefined, 'bold');
    doc.text(
        isPaid ? "PAGADO" : "NO PAGADO",
        doc.internal.pageSize.width / 2 + 15,
        doc.internal.pageSize.height / 2 + 20,
        { align: 'center', angle: 45 }
    );
    doc.setTextColor(0, 0, 0);
};

const generateHeader = (doc) => {
    doc.addImage('/logo-horizontal.png', 'png', 15, 20, 40, 23);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text("Comprobante de pago", 195, 30, { align: "right" });
};

const generateCompanyInfo = (doc, campus, leftCol, rightCol, currentY) => {
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text("Prexun Asesorías", leftCol, currentY);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    doc.text(campus?.name, leftCol, currentY + 7);
    doc.text(`${campus?.address}`, leftCol, currentY + 14, {
        maxWidth: rightCol - leftCol - 10
    });
};

const generateInvoiceDetails = (doc, invoice, rightCol, currentY) => {
    doc.setFontSize(11);
    const details = [
        ["Comprobante de Pago:", `N-${invoice.id.toString().padStart(5, '0')}`],
        ["Estudiante:", invoice.student?.firstname],
        ["", invoice.student?.lastname],

        ["Fecha:", new Date(invoice.created_at).toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC'
        })],

        ["Fecha de vencimiento:", invoice.expiration_date ? invoice.expiration_date : 'Sin vencimiento'],

        ["Hora de pago:", invoice.paid === 1 ?
            dayjs(invoice.updated_at).format('HH:mm A') : 'No pagada']
    ];

    details.forEach((row, index) => {
        doc.text(row[0], rightCol, currentY + (index * 7), { align: 'left' });
        doc.text(row[1], rightCol + 90, currentY + (index * 7), { align: 'right' });
    });
};

const generateProductsTable = (doc: jsPDF, invoice: any, currentY: number) => {

    const formatPrice = (amount: number | undefined): string => {
        return typeof amount === 'number'
            ? `$${amount.toLocaleString()}`
            : '$0';
    };


    const formatFrequency = (frequencyStr: string | undefined): string => {
        try {
            return frequencyStr
                ? JSON.parse(frequencyStr).join(', ')
                : 'No especificada';
        } catch {
            return 'No especificada';
        }
    };

    const buildServiceDescription = (invoice: any): string => {
        const grupo = invoice?.student?.grupo ?? {};
        const groupInfo = [
            `${grupo.name ?? 'Sin grupo'} | ${grupo.type ?? 'Sin tipo'}`,
            `${new Date(grupo.start_date).toLocaleDateString('es-MX', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC'
            })} - ${new Date(invoice.end_date).toLocaleDateString('es-MX', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC'
            })}`,
            `Frecuencia clases: ${formatFrequency(grupo.frequency)}`,
            `${grupo.start_time ?? 'N/A'} - ${grupo.end_time ?? 'N/A'}`,
            `${invoice.notes ?? ''}`
        ];

        return groupInfo.join('\n');
    };

    doc.autoTable({
        startY: currentY + 40,
        head: [["PRODUCTOS Y SERVICIOS", "VALOR"]],
        body: [[
            {
                content: buildServiceDescription(invoice),
                styles: {
                    cellWidth: 'auto',
                    cellPadding: 4,
                    fontSize: 11,
                    lineHeight: 1.5
                }
            },
            {
                content: "$" + invoice.amount.toLocaleString(),
                styles: {
                    halign: 'center',
                    fontSize: 11
                }
            }
        ]],
        headStyles: { fillColor: [200, 200, 200] },
        styles: {
            fontSize: 11,
            lineHeight: 1.5,
            fillColor: null,
        },
        columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 40 }
        },
        theme: 'grid'
    });
};

const generateTotals = (doc, finalY, invoice) => {
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');

    doc.text("Subtotal:", 140, finalY + 20);
    doc.text("$" + (invoice.amount * 0.84).toLocaleString(), 200, finalY + 20, { align: "right" });

    doc.text("IVA:", 140, finalY + 28);
    doc.text("$" + (invoice.amount * 0.16).toLocaleString(), 200, finalY + 28, { align: "right" });

    doc.text("Total:", 140, finalY + 36);
    doc.text("$" + invoice.amount.toLocaleString(), 200, finalY + 36, { align: "right" });
};

const generateComments = (doc, finalY, leftCol) => {
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text("Comentarios", leftCol, finalY + 50);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);

    const maxWidth = 140;

    const lines = [
        "Este es un Comprobante de Pago este no es un comprobante fiscal ni una factura",
        "Todas las tarifas se muestran en MXN y están sujetas a impuestos sobre las ventas (según corresponda).",
        "No se hacen devoluciones o compensaciones de ninguna índole.",
        "El valor de promoción solo aplica si se liquida en las fechas convenidas.",
        "El libro de estudios se entregará una semana previa al inicio de clases.",
        "Si usted requiere factura, solicitar al registrarse.",
        "No se emitira en caso de no ser solicitada en la inscripción.",
        "Nuestro material esta protegido por derechos de autor, haces uso con fines diferentes al establecido es perseguido por la ley.",
        "En las sesiones de clase y evaluaciones no se permite usar o tener en las manos teléfonos celulares.",
        "Los padres encargados del alumno deberán solicitar informes del desempeño durante el curso.",
        "Si por alguna situación esporádica el Estado suspende las clases presenciales, las clases seran en línea.",
        "https://asesoriasprexun.com/terminos-y-condiciones/"
    ];

    let currentY = finalY + 60;
    lines.forEach((line, index) => {
        const splitLines = doc.splitTextToSize(index + 1 + '. ' + line, maxWidth);
        doc.text(splitLines, leftCol, currentY);
        currentY += 5 * splitLines.length;
    });
        
    // Add QR code to the right side
    doc.addImage('/qr.png', 'png', 160, finalY + 50, 40, 40);
};

const generatePDF = (invoice) => {
    const doc = new jsPDF();
    const leftCol = 15;
    const rightCol = doc.internal.pageSize.width / 2;
    const currentY = 50;

    generateWatermark(doc, invoice.paid);
    generateHeader(doc);
    generateCompanyInfo(doc, invoice.campus, leftCol, rightCol, currentY);
    generateInvoiceDetails(doc, invoice, rightCol, currentY);
    generateProductsTable(doc, invoice, currentY);

    const finalY = (doc as any).lastAutoTable.finalY || 200;

    generateTotals(doc, finalY, invoice);
    generateComments(doc, finalY, leftCol);

    doc.save(`comprobante-${invoice.id.toString().padStart(5, '0')}.pdf`);
};

const InvoicePDF = ({ icon, invoice }) => {
    if (icon) {
        return (
            <Button variant="ghost" size="icon" onClick={() => generatePDF(invoice)}>
                <FileDown className="w-4 h-4 mr-2" />
            </Button>
        );
    }

    return (
        <button
            onClick={() => generatePDF(invoice)}
            className="bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
            Descargar PDF
        </button>
    );
};

export default InvoicePDF;