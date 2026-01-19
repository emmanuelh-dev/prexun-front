'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Upload, 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Mock data
const PRE_ASSIGNMENT_MOCK = [
  { id: 1, filename: 'nomina_juan_perez_s1.pdf' },
  { id: 2, filename: 'nomina_maria_garcia_s1.pdf' },
  { id: 3, filename: 'nomina_pedro_lopez_s1.pdf' },
];

const TRACKING_DATA = [
  {
    week: "Semana 1 2025",
    items: [
      { id: 101, empleado: "Juan Pérez", estado: "Firmado", fechaFirma: "2025-01-05", fechaSubida: "2025-01-02" },
      { id: 102, empleado: "María García", estado: "Pendiente", fechaFirma: "-", fechaSubida: "2025-01-02" },
    ]
  },
  {
    week: "Semana 2 2025",
    items: [
      { id: 201, empleado: "Juan Pérez", estado: "Firmado", fechaFirma: "2025-01-12", fechaSubida: "2025-01-09" },
    ]
  }
];

export default function AdminNominas() {
  const [openWeeks, setOpenWeeks] = useState<string[]>(["Semana 1 2025"]);

  const toggleWeek = (week: string) => {
    setOpenWeeks(prev => 
      prev.includes(week) ? prev.filter(w => w !== week) : [...prev, week]
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Configuración de Nómina</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] space-y-2">
              <label className="text-sm font-medium">Sección</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sección" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="administrativos">Administrativos</SelectItem>
                  <SelectItem value="profesores">Profesores</SelectItem>
                  <SelectItem value="limpieza">Limpieza</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px] space-y-2">
              <label className="text-sm font-medium">Otro</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Otros filtros" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="opcion1">Opción 1</SelectItem>
                  <SelectItem value="opcion2">Opción 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-center border-dashed border-2 bg-muted/30">
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <div className="text-sm font-medium">Subir varios archivos</div>
              <p className="text-xs text-muted-foreground pb-2">Arrastra y suelta tus archivos PDF aquí</p>
              <Button size="sm">Seleccionar archivos</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pre-asignación de archivos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {PRE_ASSIGNMENT_MOCK.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-2 border rounded-md hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">{file.filename}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">Asignar a:</span>
                  <div className="w-[200px]">
                    <Select>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Usuario" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Juan Pérez</SelectItem>
                        <SelectItem value="2">María García</SelectItem>
                        <SelectItem value="3">Pedro López</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button size="sm">Cargar y Procesar Nóminas</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Seguimiento de Nóminas</h3>
        {TRACKING_DATA.map((weekData) => (
          <Collapsible
            key={weekData.week}
            open={openWeeks.includes(weekData.week)}
            onOpenChange={() => toggleWeek(weekData.week)}
            className="border rounded-lg bg-card"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-accent/50 transition-colors">
              <span className="font-medium">{weekData.week}</span>
              {openWeeks.includes(weekData.week) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-4 pt-0 border-t">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empleado</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha de Firma</TableHead>
                      <TableHead>Fecha de Subida</TableHead>
                      <TableHead>Ver PDF Firmado</TableHead>
                      <TableHead>Ver PDF No Firmado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weekData.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium whitespace-nowrap">{item.empleado}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {item.estado === 'Firmado' ? (
                              <span className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                                <CheckCircle2 className="h-3 w-3" /> FIRMADO
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-amber-600 text-xs font-semibold">
                                <Clock className="h-3 w-3" /> NO FIRMADO
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{item.fechaFirma}</TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{item.fechaSubida}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50" disabled={item.estado !== 'Firmado'}>
                            <FileText className="h-4 w-4 mr-1" /> Ver PDF
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground">
                            <FileText className="h-4 w-4 mr-1" /> Ver PDF
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
