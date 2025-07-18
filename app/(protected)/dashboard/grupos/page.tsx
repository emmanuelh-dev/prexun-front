'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Plus, Pencil } from 'lucide-react';
import { Campus, Grupo, Period } from '@/lib/types';
import GrupoModal from '../../../../components/dashboard/GrupoModal';
import { createGrupo, getCampuses, getGrupos, getPeriods, updateGrupo } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function GruposPage() {
  const [grupos, setGrupos] = React.useState<Grupo[]>([]);
  const [search, setSearch] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isOpen, setIsOpen] = React.useState(false);
  const [grupo, setGrupo] = React.useState<Grupo | null>(null);
  const [periods, setPeriods] = React.useState<Period[]>([]);
  const [campuses, setCampuses] = React.useState<Campus[]>([]);

  React.useEffect(() => {
    fetchPeriods();
    fetchCampuses();
    fetchGrupos();
  }, []);

  const filteredGrupos = grupos.filter((grupo) =>
    grupo.name.toLowerCase().includes(search.toLowerCase())
  );

  // Agrupar grupos por periodo
  const groupedGrupos = React.useMemo(() => {
    const grouped = new Map<string, Grupo[]>();

    filteredGrupos.forEach((grupo) => {
      const periodId = grupo.period_id;
      if (!grouped.has(periodId as any)) {
        grouped.set(periodId as any, []);
      }
      grouped.get(periodId as any)?.push(grupo);
    });

    return grouped;
  }, [filteredGrupos]);

  const handleSubmit = async (grupo: Grupo) => {
    try {
      // Preparar los datos del grupo incluyendo campus_ids
      const grupoData = {
        ...grupo,
        campus_ids: grupo.campuses // Enviar como campus_ids para el backend
      };

      if (grupo.id) {
        await updateGrupo(grupoData)
      } else {
        await createGrupo(grupoData)
      }
      fetchGrupos()
      setIsOpen(false)
      setGrupo(null)
    } catch (error) {
      console.error('Error:', error)
    }
  };

  const handleEdit = (grupo: Grupo) => {
    setGrupo(grupo);
    setIsOpen(true);
  };

  const fetchGrupos = async () => {
    try {
      const response = await getGrupos();
      setGrupos(response);
    } catch (error) {
      console.error('Error fetching grupos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCampuses = async () => {
    const response = await getCampuses();
    setCampuses(response);
  };

  const fetchPeriods = async () => {
    const response = await getPeriods();
    setPeriods(response);
  };

  const GruposTable = ({ grupos }: { grupos: Grupo[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Moodle ID</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Capacidad</TableHead>
          <TableHead>Planteles</TableHead>
          <TableHead>Frecuencia</TableHead>
          <TableHead>Horario</TableHead>
          <TableHead>Fecha de Inicio</TableHead>
          <TableHead>Fecha de Fin</TableHead>
          <TableHead>Estudiantes</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {grupos.map((grupo) => (
          <TableRow key={grupo.id}>
            <TableCell>{grupo.name}</TableCell>
            <TableCell>{grupo.moodle_id}</TableCell>
            <TableCell>{grupo.type}</TableCell>
            <TableCell>{grupo.capacity}</TableCell>
            <TableCell>
              {grupo.campuses && grupo.campuses.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {grupo.campuses.map((campus, index) => {
                    // Si es un string, buscar el campus por ID
                    const campusInfo = typeof campus === 'string' 
                      ? campuses.find(c => c.id?.toString() === campus)
                      : campus;
                    
                    return (
                      <span key={campusInfo?.id || index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {campusInfo?.name || campus}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <span className="text-gray-400">Sin asignar</span>
              )}
            </TableCell>
            <TableCell>
              {Object.entries(JSON.parse(grupo.frequency as any))
                .map(([day, value]) => value)
                .join(', ')}
            </TableCell>
            <TableCell>
              {grupo.start_time} - {grupo.end_time}
            </TableCell>
            <TableCell>{grupo.start_date}</TableCell>
            <TableCell>{grupo.end_date}</TableCell>
            <TableCell>{grupo.students_count}/{grupo.capacity}</TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" onClick={() => handleEdit(grupo)}>
                <Pencil className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      <div className="p-4">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Grupos</h1>
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Buscar grupos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
              <Button onClick={() => setIsOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Grupo
              </Button>
            </div>
          </div>



          {isLoading ? (
            <div className="text-center">Cargando...</div>
          ) : filteredGrupos.length === 0 ? (
            <div className="text-center">No se encontraron grupos</div>
          ) : (
            <div className="flex flex-col gap-6">
              {periods.map((period) => {
                const periodGrupos = groupedGrupos.get(period.id) || [];
                if (periodGrupos.length === 0) return null;

                return (
                  <Card key={period.id}>
                    <CardHeader className='sticky top-0 z-8 bg-card'>
                      <CardTitle>{period.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <GruposTable grupos={periodGrupos} />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <GrupoModal
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false);
              setGrupo(null);
            }}
            onSubmit={handleSubmit}
            grupo={grupo}
            periods={periods}
            campuses={campuses}
          />
        </div>
      </div>
    </div>
  );
}