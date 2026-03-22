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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogIn, Clock, MapPin, Sun, Moon, CalendarDays } from "lucide-react";
import { checkInEvent } from "@/app/student/actions";
import { showSuccess, showError } from "@/lib/toast-utils";

export function EventCheckInCard() {
  const router = useRouter();
  const [shift, setShift] = useState<"matutino" | "vespertino" | "completo">("matutino");
  const [eventName, setEventName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async () => {
    if (!eventName.trim()) {
      showError("Por favor ingresa el nombre del evento");
      return;
    }

    setLoading(true);

    const result = await checkInEvent(eventName.trim(), shift);

    if (result.error) {
      showError(result.error);
      setLoading(false);
    } else {
      showSuccess("Entrada al evento registrada exitosamente");
      setTimeout(() => {
        router.push("/student");
        router.refresh();
      }, 1000);
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-white dark:bg-gray-900 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl text-indigo-700 dark:text-indigo-400">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
            <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          Detalles del Evento
        </CardTitle>
        <CardDescription className="text-sm sm:text-base dark:text-gray-400">
          Captura el nombre del evento y el turno para iniciar el conteo de horas (contarán al doble).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-5">
        <div className="space-y-4 sm:space-y-5">
          {/* Event Name Input */}
          <div className="space-y-2">
            <Label
              htmlFor="eventName"
              className="text-sm sm:text-base font-medium flex items-center gap-2 dark:text-gray-300"
            >
              <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Nombre del Evento 
            </Label>
            <Input
              id="eventName"
              placeholder="Ej. Feria de Ciencias"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="h-11 sm:h-12 text-sm sm:text-base"
            />
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
            {loading ? "Registrando..." : "Iniciar Evento"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
