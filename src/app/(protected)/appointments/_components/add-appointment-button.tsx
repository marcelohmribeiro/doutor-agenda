"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { doctorsTable, patientsTable } from "@/db/schema";

import AddAppointmentForm from "./add-appointment-form";

type AddAppointmentButtonProps = {
  doctors: (typeof doctorsTable.$inferSelect)[];
  patients: (typeof patientsTable.$inferSelect)[];
};

export const AddAppointmentButton = ({
  doctors,
  patients,
}: AddAppointmentButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Novo agendamento
        </Button>
      </DialogTrigger>
      <AddAppointmentForm
        isOpen={isOpen}
        doctors={doctors}
        patients={patients}
        onSuccess={() => setIsOpen(false)}
      />
    </Dialog>
  );
};
