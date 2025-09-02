// deno-lint-ignore-file jsx-no-children-prop
import { $, createState } from "@inspatial/kit/state";
import { Carousel, Link } from "@inspatial/kit/navigation";
import { useTheme } from "@inspatial/kit/theme";
import { Show } from "@inspatial/kit/control-flow";
import { YStack, Slot, XStack } from "@inspatial/kit/structure";
import { Button } from "@inspatial/kit/ornament";
import { Modal } from "@inspatial/kit/presentation";
import { Text } from "@inspatial/kit/typography";
import { XPrimeIcon } from "@inspatial/kit/icon";
import { Image } from "@inspatial/kit/media";
import { route } from "../../routes.tsx";

//##############################################(WINDOW)##############################################//

export function ProjectsWindow() {
  //*************************(STATE)*************************//

  // const useProject = createState({});

  //#########################(RENDER)#########################
  return (
    <>
      <Modal
        id="create-new-project-modal"
        children={{
          overlay: {
            // style: {
            //   web: {
            //     backgroundColor: "yellow",
            //   },
            // },
            backdrop: "transparent",
          },

          // Custom View
          view: [
            {
              style: {
                web: {
                  border: "4px solid var(--background)",
                },
              },
              size: "full",
              radius: "none",
              children: (
                <YStack>
                  <Button
                    size="lg"
                    format="background"
                    on:presentation={{
                      id: "create-new-project-modal",
                      action: "close",
                    }}
                    style={{
                      web: {
                        borderRadius: "0px",
                        borderBottomRightRadius: "8px",
                        position: "absolute",
                        left: "0px",
                        top: "0px",
                      },
                    }}
                  >
                    <XPrimeIcon
                      style={{
                        web: {
                          padding: "6px",
                        },
                      }}
                    />
                  </Button>
                  <XStack
                    style={{
                      web: {
                        minWidth: "100vw",
                        minHeight: "100vh",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                        margin: "0 auto",
                        gap: "20px",
                      },
                    }}
                  >
                    <Link to="editor" target="_blank">
                      <Image src="/asset/card-1.svg" alt="card-1" />
                    </Link>
                    <Link to="editor" target="_blank">
                      <Image src="/asset/card-2.svg" alt="card-2" />
                    </Link>
                    <Link to="editor" target="_blank">
                      <Image src="/asset/card-3.svg" alt="card-3" />
                    </Link>
                  </XStack>
                </YStack>
              ),
            },
          ],
        }}
      />

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
            on:presentation={{
              id: "create-new-project-modal",
              action: "toggle",
            }}
          >
            Create New Project
          </Button>
        </Slot>
      </YStack>
    </>
  );
}
