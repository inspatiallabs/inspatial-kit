import { $, createState } from "@inspatial/kit/state";
import { Carousel } from "@inspatial/kit/navigation";
import { useTheme } from "@inspatial/kit/theme";
import { Show } from "@inspatial/kit/control-flow";
import { YStack, Slot } from "@inspatial/kit/structure";
import { Button } from "@inspatial/kit/ornament";

//##############################################(WINDOW)##############################################//

export function ProjectsWindow() {
  //*************************(STATE)*************************//

  const useProject = createState({});

  //#########################(RENDER)#########################
  return (
    <>
      <YStack className="w-full items-center">
        <Slot className="relative w-full pt-[184px]">
          <Show
            when={$(() => useTheme.mode.get() === "dark")}
            otherwise={() => (
              <Carousel
                className="w-11/12 xl:w-9/12 m-auto"
                empty={{ isEmpty: true, slot: "/asset/carousel-light.svg" }}
              />
            )}
          >
            {() => (
              <Carousel
                className="w-11/12 xl:w-9/12 m-auto"
                empty={{ isEmpty: true, slot: "/asset/carousel-dark.svg" }}
              />
            )}
          </Show>

          <Button
            size="lg"
            className="absolute left-1/2 -translate-x-1/2 bottom-[4%] 2xl:bottom-[4%] 3xl:bottom-[3%] w-[200px] xl:w-[250px] 2xl:w-[300px] 3xl:w-[400px] 4xl:w-[450px] z-10"
          >
            Create New Project
          </Button>
        </Slot>
      </YStack>
    </>
  );
}
