'use client';

import React, { useState } from 'react';
import AdminNominas from '@/app/(protected)/nominas/components/AdminNominas';
import UserNominas from '@/app/(protected)/nominas/components/UserNominas';
import { Button } from '@/components/ui/button';
import { User, ShieldCheck } from 'lucide-react';
import SectionContainer from '@/components/SectionContainer';

export default function NominasPage() {
  // Mock role state for development as requested
  const [role, setRole] = useState<'contador' | 'usuario'>('contador');

  return (
    <SectionContainer>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Gestión de Nóminas</h1>
        <p className="text-muted-foreground text-sm">Administra y firma los recibos de nómina de los empleados.</p>
      </div>
      
      <div className="mb-6 flex items-center justify-end gap-2 border-b pb-4">
        <p className="text-sm text-muted-foreground mr-2">Simular rol:</p>
        <Button 
          variant={role === 'contador' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setRole('contador')}
          className="flex gap-2"
        >
          <ShieldCheck className="h-4 w-4" />
          Administrador (Contador)
        </Button>
        <Button 
          variant={role === 'usuario' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setRole('usuario')}
          className="flex gap-2"
        >
          <User className="h-4 w-4" />
          Usuario (Empleado)
        </Button>
      </div>

      {role === 'contador' ? <AdminNominas /> : <UserNominas />}
    </SectionContainer>
  );
}
