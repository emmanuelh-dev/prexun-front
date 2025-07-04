'use client'
import "jspdf-autotable";
import Image from "next/image";
import InvoicePDF from '@/components/invoice_pdf';
import { PaymentMethod } from '@/lib/types';

export function InvoiceClient({ invoice }) {

    const invoiceNumber = ({ folio }) => {
        if (!folio) return 'No pagado';
        const campusInitial = invoice?.campus?.name?.charAt(0) || 'X';
        if (folio < 10) {
            return `${campusInitial}I-0000${folio}`;
        } if (folio < 100) {
            return `${campusInitial}I-000${folio}`;
        }
        if (folio < 1000) {
            return `${campusInitial}I-00${folio}`;
        }
        if (folio < 10000) {
            return `${campusInitial}I-0${folio}`;
        }
        return `${campusInitial}I-${folio}`;
    };

    return (
        <div className='flex flex-col justify-center items-center mx-auto bg-white w-full min-h-screen text-black text-xs md:text-sm'>
            {/* Watermark */}
            <div
                className="fixed inset-0 flex items-center justify-center pointer-events-none"
                style={{
                    transform: 'rotate(45deg)',
                    opacity: 0.2,
                    zIndex: 10
                }}
            >
                <span className="text-gray-400 text-4xl md:text-6xl lg:text-8xl font-bold">
                    {invoice.paid ? "PAGADO" : "NO PAGADO"}
                </span>
            </div>
            
            {/* Invoice Container */}
            <div className="px-4 py-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-white w-full max-w-4xl border border-gray-400 my-4 lg:my-8">
                <div className="w-full mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 lg:mb-8 gap-2">
                        <div className="flex items-center">
                            <Image src="/logo-horizontal.png" alt="Prexun" width={120} height={40} className="w-32 md:w-40 lg:w-150 h-auto" />
                        </div>
                        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-700">Comprobante de pago</h1>
                    </div>
                    
                    {/* Info Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 lg:mb-8">
                        <div>
                            <h3 className="font-semibold mb-2">Prexun Asesorías</h3>
                            <p className="text-gray-600">{invoice.campus?.name || 'Campus no especificado'}</p>
                            <p className="text-gray-600">{invoice.campus?.address || 'Dirección no disponible'}</p>
                            {/* <p className="text-gray-600">{invoice.campus?.titular}</p>
                            <p className="text-gray-600">{invoice.campus?.rfc}</p> */}
                            {/* <p className="text-gray-600"><span className='font-bold'>Tarjeta:</span> {invoice?.card?.number}</p>
                            <p className="text-gray-600"><span className='font-bold'>CLABE:</span> {invoice?.card?.clabe}</p> */}

                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="font-medium">Comprobante de Pago</span>
                                <span className='bg-yellow-200 p-2'>{invoice.folio_new || invoiceNumber(invoice)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Estudiante</span>
                                <span className="text-right">
                                    {invoice.student?.firstname || 'N/A'} {invoice.student?.lastname || ''}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Fecha</span>
                                <span className="text-right">
                                    {new Date(invoice.payment_date ? invoice.payment_date : invoice.created_at).toLocaleDateString('es-MX', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        timeZone: 'UTC'
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Método de pago</span>
                                <span>{invoice.payment_method ? PaymentMethod[invoice.payment_method] : 'No especificado'}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Service Table */}
                    <div className="border border-gray-400 rounded overflow-hidden mb-6 lg:mb-8">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        PRODUCTOS Y SERVICIOS
                                    </th>
                                    <th className="px-3 md:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                        VALOR
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td className="px-3 md:px-6 py-4">
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {invoice.student?.grupo?.name || 'Grupo no asignado'} | {invoice.student?.grupo?.type || 'Tipo no especificado'}
                                            </div>
                                            {invoice.student?.grupo?.start_date && invoice.student?.grupo?.end_date ? (
                                                <div className="font-medium text-gray-900 text-xs lg:text-sm">
                                                    {new Date(invoice.student?.grupo?.start_date).toLocaleDateString('es-MX', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        timeZone: 'UTC'
                                                    })} - {new Date(invoice.student?.grupo?.end_date).toLocaleDateString('es-MX', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        timeZone: 'UTC'
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="text-gray-500 text-xs lg:text-sm">
                                                    Fechas no disponibles
                                                </div>
                                            )}
                                            <div className="text-gray-500 text-xs lg:text-sm mt-1">
                                                <p>Frecuencia clases: {
                                                    (() => {
                                                        try {
                                                            return invoice.student?.grupo?.frequency 
                                                                ? JSON.parse(invoice.student.grupo.frequency).join(', ') 
                                                                : 'No especificada';
                                                        } catch (error) {
                                                            return 'No especificada';
                                                        }
                                                    })()
                                                }</p>
                                                <p>{invoice.student?.grupo?.start_time || 'N/A'} - {invoice.student?.grupo?.end_time || 'N/A'}</p>
                                                <p>{invoice.notes || ''}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 md:px-6 py-4 text-center">MX${invoice.amount || '0.00'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end mb-6 lg:mb-8">
                        <div className="text-right w-full sm:w-1/2 md:w-1/3">
                            <div className="flex justify-between font-bold gap-2">
                                <span>SubTotal</span>
                                <span>MX${invoice.amount ? (invoice.amount / 1.16).toFixed(2) : '0.00'}</span>
                            </div>
                            <div className="flex justify-between font-bold gap-2">
                                <span>IVA</span>
                                <span>MX${invoice.amount ? (invoice.amount - (invoice.amount / 1.16)).toFixed(2) : '0.00'}</span>
                            </div>
                            <div className="flex justify-between font-bold gap-2 text-sm md:text-base">
                                <span>Total</span>
                                <span>MX${invoice.amount ? Number(invoice.amount).toFixed(2) : '0.00'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="border-t pt-6 lg:pt-8 text-xs">
                        <h3 className="font-semibold mb-2">Comentarios</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <p className="text-gray-600">
                                1. Este es un "Comprobante de pago", por ende, no es un comprobante fiscal o una factura.
                            </p>
                            <p className="text-gray-600">
                                2. Todas las tarifas se muestran en MXN y están sujetas a impuestos sobre las ventas (según corresponda).
                            </p>
                            <p className="text-gray-600">
                                3. No se hacen devoluciones o compensaciones de ninguna índole.
                            </p>
                            <p className="text-gray-600">
                                4. El valor de promoción solo aplica si se liquida en las fechas convenidas.
                            </p>
                            <p className="text-gray-600">
                                5. El libro de estudios se entregará una semana previa al inicio de clases.
                            </p>
                            <p className="text-gray-600">
                                6. Si usted requiere factura, solicitar al registrarse; no se emitirá en caso de no ser solicitada en la inscripción.
                            </p>
                            <p className="text-gray-600">
                                7. Nuestro material está protegido por derechos de autor, hacer uso con fines diferentes al establecido es perseguido por la ley.
                            </p>
                            <p className="text-gray-600">
                                8. En las sesiones de clase y evaluaciones no se permite usar o tener en las manos teléfonos celulares.
                            </p>
                            <p className="text-gray-600">
                                9. Los padres o tutores encargados del alumno deberán solicitar informes de su desempeño durante el curso.
                            </p>
                            <p className="text-gray-600">
                                10. Si por alguna situación esporádica el Estado suspende las clases presenciales, las clases serán en línea.
                            </p>
                        </div>
                        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <a href="https://asesoriasprexun.com/terminos-y-condiciones/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                                Términos y Condiciones
                            </a>
                            <Image src="/qr.png" alt="Prexun Términos y Condiciones" width={100} height={100} className="w-24 h-24" />
                        </div>
                    </div>
                </div>
            </div>

            <InvoicePDF icon={false} invoice={invoice} />
        </div>
    )
}