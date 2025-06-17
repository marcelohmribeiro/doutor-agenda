"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";

import { upsertAppointment } from "@/actions/upsert-appointment";
import {
  UpsertAppointmentSchema,
  upsertAppointmentSchema,
} from "@/actions/upsert-appointment/schema";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { doctorsTable, patientsTable } from "@/db/schema";
import { cn } from "@/lib/utils";

type UpsertAppointmentFormProps = {
  doctors: (typeof doctorsTable.$inferSelect)[];
  patients: (typeof patientsTable.$inferSelect)[];
  onSuccess: () => void;
};

export const UpsertAppointmentForm = ({
  doctors,
  patients,
  onSuccess,
}: UpsertAppointmentFormProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const form = useForm<UpsertAppointmentSchema>({
    resolver: zodResolver(upsertAppointmentSchema),
    defaultValues: {
      appointmentsPriceInCents: 0,
    },
  });

  const selectedDoctorId = useWatch({
    control: form.control,
    name: "doctorId",
  });

  const selectedPatientId = useWatch({
    control: form.control,
    name: "patientId",
  });

  useEffect(() => {
    if (selectedDoctorId) {
      const doctor = doctors.find((doctor) => doctor.id === selectedDoctorId);
      if (doctor) {
        form.setValue(
          "appointmentsPriceInCents",
          doctor.appointmentPriceInCents,
        );
      }
    }
  }, [selectedDoctorId, doctors, form]);

  const { execute, status } = useAction(upsertAppointment, {
    onSuccess: () => {
      toast.success("Agendamento criado com sucesso!");
      onSuccess();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Ocorreu um erro ao criar o agendamento.");
    },
  });

  const onSubmit = (values: UpsertAppointmentSchema) => {
    execute(values);
  };

  const isSubmitting = status === "executing";
  const areDoctorAndPatientSelected = selectedDoctorId && selectedPatientId;
  const isDateTimeEnabled = selectedPatientId && selectedDoctorId;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo agendamento</DialogTitle>
        <DialogDescription>
          Preencha os dados para criar um novo agendamento.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paciente</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um paciente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Médico</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um médico" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="appointmentsPriceInCents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da consulta</FormLabel>
                <FormControl>
                  <NumericFormat
                    customInput={Input}
                    value={field.value / 100}
                    onValueChange={(values) => {
                      field.onChange(
                        Math.round((values.floatValue ?? 0) * 100),
                      );
                    }}
                    prefix="R$ "
                    decimalScale={2}
                    fixedDecimalScale
                    thousandSeparator="."
                    decimalSeparator=","
                    disabled={!selectedDoctorId}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data</FormLabel>
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        disabled={!areDoctorAndPatientSelected}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setIsPopoverOpen(false);
                      }}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!isDateTimeEnabled}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* TODO: Implementar horários disponíveis baseados no médico */}
                    <SelectItem value="08:00">08:00</SelectItem>
                    <SelectItem value="09:00">09:00</SelectItem>
                    <SelectItem value="10:00">10:00</SelectItem>
                    <SelectItem value="11:00">11:00</SelectItem>
                    <SelectItem value="14:00">14:00</SelectItem>
                    <SelectItem value="15:00">15:00</SelectItem>
                    <SelectItem value="16:00">16:00</SelectItem>
                    <SelectItem value="17:00">17:00</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
