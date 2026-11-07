import { LoaderCircle, CloudSun } from "lucide-react";

function Loading() {
  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center gap-5">
      <div className="relative">
        <CloudSun size={65} className="text-blue-400" />

        <LoaderCircle
          size={85}
          className="absolute -left-2 -top-2 animate-spin text-blue-500"
          strokeWidth={1.5}
        />
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold">
          Analyse météorologique...
        </h3>

        <p className="mt-2 text-sm text-gray-400">
          Récupération des données météo en cours.
        </p>
      </div>
    </div>
  );
}

export default Loading;