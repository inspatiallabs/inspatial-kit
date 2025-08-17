import { XStack, Slot } from "@inspatial/kit/structure";
import { Image } from "@inspatial/kit/media";
import { iss } from "@inspatial/kit/style";

export function AuthLayout({
  children,
  className,
}: {
  children?: any;
  className?: string;
}) {
  //##############################################(RENDER)##############################################//

  return (
    <>
      <XStack className="relative overflow-hidden h-screen w-full xl:p-5 md:px-1 md:py-1">
        {/**Layout Component**/}
        <Slot className="w-6/12 h-screen lg:hidden bg-brand md:w-auto flex items-center justify-center">
          <img
            src="/asset/media.png"
            className="flex justify-center items-center w-full h-screen"
          />
        </Slot>
        {/**Page**/}
        <Slot
          className={iss(
            "relative flex bg-(--surface) h-full w-6/12 justify-center items-center lg:w-full",
            className
          )}
        >
          {children}
        </Slot>
      </XStack>
    </>
  );
}
