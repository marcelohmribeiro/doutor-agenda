"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { createClinic } from "@/actions/create-clinic";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const clinicsFormSchema = z.object({
  name: z.string().trim().min(1, { message: "Nome é obrigatorio" }).max(50),
});

function ClincForm() {
  const form = useForm<z.infer<typeof clinicsFormSchema>>({
    resolver: zodResolver(clinicsFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof clinicsFormSchema>) => {
    try {
      await createClinic(data.name);
      toast.success("Clínica criada com sucesso!");
      form.reset();
    } catch (error) {
      if (isRedirectError(error)) {
        return;
      }
      console.error("Error creating clinic:", error);
      toast.error("Erro ao criar clínica.");
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da clínica</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da clínica" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="sm:justify-start">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 className="h4 w-4 animate-spin" />
              )}
              Criar clínica
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}

export default ClincForm;
