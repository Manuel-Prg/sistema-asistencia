import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EventCheckInCard } from "@/components/student/event-check-in-card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function EventosPage() {
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if they already have an active record
  const { data: activeRecords } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("student_id", user.id)
    .is("check_out", null)
    .limit(1);

  if (activeRecords && activeRecords.length > 0) {
    // Already checked in, return to dashboard
    redirect("/student");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-3xl">
        <div className="space-y-6 sm:space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link href="/student" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver al Panel
            </Link>
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              Registrar Evento Externo
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Registra tu asistencia en eventos especiales. Las horas registradas aquí se contarán al doble.
            </p>
          </div>

          {/* Form Card */}
          <EventCheckInCard />
        </div>
      </div>
    </div>
  );
}
