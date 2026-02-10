import { Student } from '../types';
import axiosInstance from './axiosConfig';

export const updateStudent = async (student: any) => {
  const response = await axiosInstance.patch('/students/hard-update', student);
  return response.data;
};

export const updateStudentPassword = async (id: number, password: string) => {
  const response = await axiosInstance.put(`/students/${id}/password`, { password });
  return response.data;
};
