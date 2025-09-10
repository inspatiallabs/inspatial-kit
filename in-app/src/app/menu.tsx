import { Link } from "@inspatial/kit/navigation";
import { XStack, Slot } from "@inspatial/kit/structure";
import { Notch } from "@inspatial/kit/ornament";
import { route } from "./routes.tsx";
import { InSpatialIcon } from "@inspatial/kit/icon";

export function AppMenu() {
  return (
    <>
    {/*#################################(TOP NOTCH)#################################*/}
      <Notch className="pointer-events-none absolute w-full top-0 z-50 max-h-[56px] m-auto pr-8" />

      <XStack className="pointer-events-auto absolute inset-x-0 top-0 h-[56px] z-[51] flex justify-center items-center space-x-10">
        <Link to="https://www.inspatial.dev" className="min-w-[48px]">
          Dev
        </Link>
        <Link to="https://www.inspatial.cloud" className="min-w-[48px]">
          Cloud
        </Link>

        <InSpatialIcon
          on:tap={() => route.to("/")}
          format="regular"
          className="cursor-pointer"
        />

        <Link
          to="/"
          className={`rounded-full py-[4px] px-[14px] min-w-[48px] ${
            route.get().startsWith("/") && "bg-(--brand)/20 text-(--brand)"
          }`}
        >
          App
        </Link>
        <Link to="https://www.inspatial.store" className="min-w-[48px]">
          Store
        </Link>
      </XStack>
      
    </>
  );
}
