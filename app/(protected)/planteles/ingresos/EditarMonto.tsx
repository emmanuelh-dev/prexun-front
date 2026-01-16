'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Transaction } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/lib/api/axiosConfig';
import { DollarSign } from 'lucide-react';

interface EditarMontoProps {
  transaction: Transaction;
  onSuccess: () => void;
}

export default function EditarMonto({ transaction, onSuccess }: EditarMontoProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(
    transaction.amount !== undefined && transaction.amount !== null
      ? String(transaction.amount)
      : ''
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
      toast({
        title: 'Error',
        description: 'Monto inválido.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.put(`/charges/${transaction.id}`, {
        amount: parsedAmount,
      });

      toast({
        title: 'Monto actualizado',
        description: `El monto se actualizó a $${parsedAmount}`,
        variant: 'default',
      });

      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Error al actualizar el monto:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el monto. Intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Editar monto">
          <DollarSign className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Monto</DialogTitle>
          <DialogDescription>
            Actualiza el monto de la transacción de {transaction.student?.firstname}{' '}
            {transaction.student?.lastname}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-2 py-4">
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="amount" className="text-right">
                Monto
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}