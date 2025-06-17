import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/db";
import { doctorsTable, patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { AddAppointmentButton } from "./_components/add-appointment-button";

async function AppointmentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (!session?.user.clinic) {
    redirect("/clinic-form");
  }

  const clinicId = session.user.clinic.id;

  const [doctors, patients] = await Promise.all([
    db.query.doctorsTable.findMany({
      where: eq(doctorsTable.clinicId, clinicId),
    }),
    db.query.patientsTable.findMany({
      where: eq(patientsTable.clinicId, clinicId),
    }),
  ]);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agendamentos</PageTitle>
          <PageDescription>
            Gerencie os agendamentos da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddAppointmentButton doctors={doctors} patients={patients} />
        </PageActions>
      </PageHeader>
      <PageContent>
        <div></div>
      </PageContent>
    </PageContainer>
  );
}

export default AppointmentsPage;
