import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ClincForm from "./components/form";

function ClinicFormPage() {
  return (
    <div>
      <Dialog open>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar clínica</DialogTitle>
            <DialogDescription>
              Adicione uma clínica para continuar.
            </DialogDescription>
          </DialogHeader>
          <ClincForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ClinicFormPage;
