import React, { useState } from 'react'
import { Button } from '../ui/button'
import { PenIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { updateStudent } from '@/lib/api/studentApi'

interface Student {
    id: number
    email: string
    firstname: string
    lastname: string
}

export default function UpdatePersonalInfo({student}: {student: Student}) {
    const [formData, setFormData] = useState({
        id: student.id,
        email: student.email,
        firstname: student.firstname,
        lastname: student.lastname,
        })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await updateStudent(formData)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Actualizar Información Personal <PenIcon className="ml-2" /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Actualizar Información Personal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="correo@prexun.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="firstname">Nombre</Label>
            <Input
              id="firstname"
              name="firstname"
              type="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
              placeholder="Nombre"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastname">Apellido</Label>
            <Input
              id="lastname"
              name="lastname"
              type="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              placeholder="Nombre"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Guardar Cambios
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
