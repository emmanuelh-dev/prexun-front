'use client';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Receipt } from 'lucide-react';
import { Card, Student, Transaction } from '@/lib/types';
import { createCharge, updateCharge } from '@/lib/api';
import { Textarea } from '@/components/ui/textarea';
import { useActiveCampusStore } from '@/lib/store/plantel-store';
import { Input } from '@/components/ui/input';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

interface ChargesFormProps {
  fetchStudents: () => void;
  student?: Student | null;
  cards: Card[];
  campusId: number;
  student_id?: number;
  icon?: boolean;
  transaction?: Transaction;
  formData: Transaction;
  setFormData: (formData: Transaction) => void;
  onTransactionUpdate?: (transaction: Transaction) => void;
  mode?: 'create' | 'update';
}

export default function ChargesForm({
  fetchStudents,
  cards,
  student,
  campusId,
  student_id,
  icon = false,
  transaction,
  formData,
  setFormData,
  onTransactionUpdate,
  mode = 'create'
}: ChargesFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const activeCampus = useActiveCampusStore((state) => state.activeCampus);

  const { SAT } = useFeatureFlags();

  const calculateDenominationsTotal = (denominations: Record<string, number>): number => {
    return Object.entries(denominations).reduce((total, [denomination, count]) => {
      return total + (Number(denomination) * (count || 0));
    }, 0);
  };

  const validateDenominations = (): boolean => {
    if (formData.payment_method === 'cash' && formData.denominations && typeof formData.denominations === 'object' && !Array.isArray(formData.denominations)) {
      const denominationsTotal = Number(calculateDenominationsTotal(formData.denominations)).toFixed(2);
      const amount = Number(formData.amount).toFixed(2);

      if (denominationsTotal !== amount) {
        setErrors({
          ...errors,
          denominations: `El total de las denominaciones (${denominationsTotal}) debe ser igual al monto del pago (${amount})`
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    setLoading(true);

    try {
      const updatedTransaction = mode === 'create'
        ? await createCharge(formData)
        : await updateCharge({
          ...formData,
          denominations: null,
          paid: 1,
          cash_register_id: activeCampus.latest_cash_register.id,
          payment_date: formData.payment_date,
          image: formData.image,
        });

      setOpen(false);
      if (onTransactionUpdate) {
        onTransactionUpdate(updatedTransaction);
      }
      fetchStudents();
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDenominationChange = (denomination: string, value: string) => {
    const newDenominations = {
      ...formData.denominations,
      [denomination]: parseInt(value) || 0,
    };

    setFormData({
      ...formData,
      denominations: newDenominations,
    });

    if (errors.denominations) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.denominations;
        return newErrors;
      });
    }
  };



  return (
    <>

      {
        activeCampus?.latest_cash_register ? icon ? (
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
            <Receipt className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={() => setOpen(true)}>
            {mode === 'create' ? 'Crear Pago' : 'Registrar Pago'}
          </Button>
        ) : null
      }


      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Registrar Nuevo Pago' : 'Registrar Pago'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Fecha de pago</Label>
                <Input
                  type="date"
                  value={formData.payment_date}
                  onChange={(e) =>
                    setFormData({ ...formData, payment_date: e.target.value })
                  }
                  required
                />
                {errors.payment_date && (
                  <p className="text-red-500 text-sm">{errors.payment_date}</p>
                )}
              </div>
              {student && (
                <div className="space-y-2">
                  <Label>Estudiante</Label>
                  <Input
                    type="text"
                    value={`${student.firstname} ${student.lastname}`}
                    disabled
                  />
                  {errors.student_id && (
                    <p className="text-red-500 text-sm">{errors.student_id}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label>Monto</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: Number(e.target.value) })
                  }
                  required
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm">{errors.amount}</p>
                )}
              </div>



              <div className="space-y-2">
                <Label>Método de Pago</Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      payment_method: value as 'cash' | 'transfer' | 'card',
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transfer">Transferencia</SelectItem>
                    <SelectItem value="card">Tarjeta</SelectItem>
                  </SelectContent>
                </Select>
                {errors.payment_method && (
                  <p className="text-red-500 text-sm">{errors.payment_method}</p>
                )}
              </div>
              {formData.payment_method === 'transfer' &&
                (
                  <div className="space-y-2">
                    <Label>Comprobante</Label>
                    <Input
                      type='file'
                      accept="image/*"
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.files?.[0] })
                      }
                    />
                  </div>
                )}
              {formData.payment_method === 'transfer' && (
                <div className="space-y-2">
                  <Label>Tarjeta</Label>
                  <Select
                    value={formData.card_id}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        card_id: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {cards
                        .filter(card => !SAT || card.sat)
                        .map(card => (
                          <SelectItem key={card.id} value={card.id.toString()}>
                          <span className='flex items-center gap-2'>
                            {card.sat ? (
                            <div className='text-green-500 bg-green-500 rounded-full size-2 pr-2' />
                            ) : (
                            <div className='text-red-500 bg-red-500 rounded-full size-2 pr-2' />
                            )}
                            {card.name}
                          </span>
                          {card.number} <br /> {card.clabe}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Notas</Label>
                <Textarea
                  rows={6}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
            </div>

            {/* {formData.payment_method === 'cash' && (
              <div className="space-y-2">
                <Label>Denominaciones</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['1000', '500', '200', '100', '50', '20', '10', '5'].map(
                    (denom) => (
                      <div key={denom} className="space-y-1">
                        <Label>${denom}</Label>
                        <Input
                          type="number"
                          value={formData.denominations[denom] || ''}
                          onChange={(e) =>
                            handleDenominationChange(denom, e.target.value)
                          }
                        />
                      </div>
                    )
                  )}
                </div>
                {errors.denominations && (
                  <p className="text-red-500 text-sm mt-2">{errors.denominations}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Total en denominaciones: ${formData.denominations && typeof formData.denominations === 'object' && !Array.isArray(formData.denominations) ? calculateDenominationsTotal(formData.denominations) : 0}
                </p>
              </div>
            )} */}

            <Button type="submit" disabled={loading}>
              {loading ? 'Procesando...' : mode === 'create' ? 'Registrar Pago' : 'Registrar Pago'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

