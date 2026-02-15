// components/student/check-in-out-card.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn, LogOut, Clock, MapPin, Sun, Moon } from "lucide-react";
import { checkIn, checkOut } from "@/app/student/actions";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EarlyDepartureDialog } from "./early-departure-dialog";
import type { CheckInOutCardProps } from "@/lib/types/student";
import { getMexicoCityTime } from "@/lib/utils";


const ROOMS = [
  "Sala 1",
  "Sala 2",
  "Sala 2 y Galería",
  "Sala 3",
  "Sala 4",
  "Sala 4 y 5",
  "Todas",
  "Site",
];

export function CheckInOutCard({ activeRecord }: CheckInOutCardProps) {
  const router = useRouter();
  const [shift, setShift] = useState<"matutino" | "vespertino" | "completo">("matutino");
  const [room, setRoom] = useState<string>(ROOMS[0]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showEarlyDepartureDialog, setShowEarlyDepartureDialog] =
    useState(false);
  const [calculatedHours, setCalculatedHours] = useState(0);

  const handleCheckIn = async () => {
    setLoading(true);
    setMessage(null);

    const result = await checkIn(room, shift);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
      setLoading(false);
    } else {
      setMessage({ type: "success", text: "Entrada registrada exitosamente" });
      setTimeout(() => {
        router.refresh();
        setLoading(false);
      }, 1000);
    }
  };

  const handleCheckOut = async () => {
    if (!activeRecord) return;

    const checkInTime = new Date(activeRecord.check_in);
    const checkOutTime = new Date();
    const hoursWorked =
      (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

    // ✅ CAMBIO: Ahora son 3 horas mínimas en lugar de 4
    if (hoursWorked < 3) {
      setCalculatedHours(hoursWorked);
      setShowEarlyDepartureDialog(true);
      return;
    }

    await performCheckOut();
  };

  const performCheckOut = async (earlyDepartureReason?: string) => {
    setLoading(true);
    setMessage(null);

    const result = await checkOut(earlyDepartureReason);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
      setLoading(false);
    } else {
      setMessage({
        type: "success",
        text: `Salida registrada. Trabajaste ${result.hoursWorked?.toFixed(
          2
        )} horas`,
      });
      setTimeout(() => {
        router.refresh();
        setLoading(false);
      }, 1500);
    }
  };

  return (
    <>
      <Card className="border-0 shadow-xl bg-white dark:bg-gray-900 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            Registro de Asistencia
          </CardTitle>
          <CardDescription className="text-sm sm:text-base dark:text-gray-400">
            {activeRecord
              ? "Tienes una entrada activa"
              : "Registra tu entrada al turno"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-5">
          {activeRecord ? (
            <div className="space-y-4">
              {/* Active Record Card */}
              <div className="relative overflow-hidden p-4 sm:p-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl space-y-3">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-200/30 dark:bg-emerald-800/20 rounded-full -mr-12 -mt-12" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-teal-200/30 dark:bg-teal-800/20 rounded-full -ml-8 -mb-8" />

                <div className="relative space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                    <p className="text-sm sm:text-base font-semibold text-emerald-900 dark:text-emerald-200">
                      Entrada activa
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300">
                      <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>
                        {format(
                          getMexicoCityTime(activeRecord.check_in),
                          "EEEE, d 'de' MMMM 'a las' hh:mm a",
                          { locale: es }
                        )}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300">
                      {activeRecord.shift === "matutino" ? (
                        <Sun className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      ) : activeRecord.shift === "vespertino" ? (
                        <Moon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      ) : (
                        <div className="flex mt-0.5 flex-shrink-0">
                          <Sun className="h-4 w-4 -mr-1" />
                          <Moon className="h-4 w-4" />
                        </div>
                      )}
                      <span>
                        Turno{" "}
                        {activeRecord.shift === "matutino"
                          ? "Matutino (11:00 - 14:00)"
                          : activeRecord.shift === "vespertino"
                            ? "Vespertino (14:00 - 18:00)"
                            : "Completo (11:00 - 18:00)"}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{activeRecord.room}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCheckOut}
                disabled={loading}
                className="w-full gap-2 h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg hover:shadow-xl transition-all duration-200"
                variant="destructive"
              >
                <LogOut className="h-5 w-5 sm:h-6 sm:w-6" />
                {loading ? "Registrando..." : "Registrar Salida"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {/* Room Selection */}
              <div className="space-y-2">
                <Label
                  htmlFor="room"
                  className="text-sm sm:text-base font-medium flex items-center gap-2 dark:text-gray-300"
                >
                  <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  Selecciona la sala
                </Label>
                <Select value={room} onValueChange={setRoom}>
                  <SelectTrigger
                    id="room"
                    className="h-11 sm:h-12 text-sm sm:text-base"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOMS.map((r) => (
                      <SelectItem
                        key={r}
                        value={r}
                        className="text-sm sm:text-base"
                      >
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Shift Selection */}
              <div className="space-y-2">
                <Label
                  htmlFor="shift"
                  className="text-sm sm:text-base font-medium flex items-center gap-2 dark:text-gray-300"
                >
                  <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  Selecciona tu turno
                </Label>
                <Select
                  value={shift}
                  onValueChange={(value: any) => setShift(value)}
                >
                  <SelectTrigger
                    id="shift"
                    className="h-11 sm:h-12 text-sm sm:text-base"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="matutino"
                      className="text-sm sm:text-base"
                    >
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Matutino (11:00 - 14:00)
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="vespertino"
                      className="text-sm sm:text-base"
                    >
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Vespertino (14:00 - 18:00)
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="completo"
                      className="text-sm sm:text-base"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          <Sun className="h-4 w-4 -mr-1" />
                          <Moon className="h-4 w-4" />
                        </div>
                        Completo (11:00 - 18:00)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleCheckIn}
                disabled={loading}
                className="w-full gap-2 h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <LogIn className="h-5 w-5 sm:h-6 sm:w-6" />
                {loading ? "Registrando..." : "Registrar Entrada"}
              </Button>
            </div>
          )}

          {message && (
            <Alert
              variant={message.type === "error" ? "destructive" : "default"}
              className={
                message.type === "success"
                  ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-950 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                  : ""
              }
            >
              <AlertDescription className="text-sm sm:text-base">
                {message.text}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <EarlyDepartureDialog
        open={showEarlyDepartureDialog}
        onOpenChange={setShowEarlyDepartureDialog}
        hoursWorked={calculatedHours}
        onConfirm={performCheckOut}
      />
    </>
  );
}