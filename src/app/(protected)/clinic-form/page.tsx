import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import WithAuthentication from "@/hocs/with-authentication";

import ClincForm from "./_components/form";

const ClinicFormPage = async () => {
  return (
    <WithAuthentication mustHavePlan>
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
    </WithAuthentication>
  );
};

export default ClinicFormPage;
