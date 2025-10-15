import { getSupabaseServerClient } from "@/lib/supabase/server"
import { StudentsTable } from "@/components/supervisor/students-table"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import Link from "next/link"

export default async function StudentsPage() {
  const supabase = await getSupabaseServerClient()

  const { data: students } = await supabase
    .from("students")
    .select("*, profile:profiles(*)")
    .order("profile(full_name)")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Estudiantes</h2>
          <p className="text-gray-600">Lista completa de estudiantes y su progreso</p>
        </div>
        <Link href="/supervisor/users/new">
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Agregar Usuario
          </Button>
        </Link>
      </div>

      <StudentsTable students={students || []} />
    </div>
  )
}
