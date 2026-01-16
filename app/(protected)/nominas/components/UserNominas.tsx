'use client';

import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  FileSignature, 
  FileText, 
  CheckCircle2, 
  Clock,
  Download
} from 'lucide-react';

const USER_DATA = [
  { id: 301, empleado: "Juan Pérez", semana: "Semana 3 2025", estado: "Pendiente", fechaFirma: "-", fechaSubida: "2025-01-15" },
  { id: 201, empleado: "Juan Pérez", semana: "Semana 2 2025", estado: "Firmado", fechaFirma: "2025-01-12", fechaSubida: "2025-01-09" },
  { id: 101, empleado: "Juan Pérez", semana: "Semana 1 2025", estado: "Firmado", fechaFirma: "2025-01-05", fechaSubida: "2025-01-02" },
];

export default function UserNominas() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mis Recibos de Nómina</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Semana correspondiente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha de Firma</TableHead>
                <TableHead>Fecha de Subida</TableHead>
                <TableHead>Ver PDF Firmado</TableHead>
                <TableHead>Ver PDF No Firmado</TableHead>
                <TableHead className="text-right">FIRMAR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {USER_DATA.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium whitespace-nowrap">{item.empleado}</TableCell>
                  <TableCell>{item.semana}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.estado === 'Firmado' ? (
                        <span className="flex items-center gap-1 text-green-600 font-semibold text-xs">
                          <CheckCircle2 className="h-4 w-4" /> FIRMADO
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600 font-semibold text-xs">
                          <Clock className="h-4 w-4" /> NO FIRMADO
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">{item.fechaFirma}</TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">{item.fechaSubida}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600" disabled={item.estado !== 'Firmado'}>
                      <FileText className="h-4 w-4 mr-1" /> Ver PDF
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
                      <FileText className="h-4 w-4 mr-1" /> Ver PDF
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.estado === 'Pendiente' && (
                      <Button variant="default" size="sm" className="flex gap-2 font-bold bg-blue-600 hover:bg-blue-700">
                        <FileSignature className="h-4 w-4" /> FIRMAR
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-100">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">Importante</h4>
              <p className="text-sm text-blue-700">
                Recuerda que tus recibos de nómina deben ser firmados electrónicamente antes de que finalice la semana actual. 
                Si tienes algún problema con los datos mostrados, contacta al departamento de contabilidad.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
