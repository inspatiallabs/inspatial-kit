import { XStack, Slot, YStack } from "@inspatial/kit/structure";
import { Button } from "@in/kit/ornament/button/index.native.tsx";
import { useAuth } from "./state.ts";
import { InputField } from "@inspatial/kit/input";
import { GoogleIcon } from "@inspatial/kit/icon";
import { AppMenu } from "../menu.tsx";
import { Image } from "@inspatial/kit/media";

export function AuthWindow() {
  //##############################################(RENDER)##############################################//

  return (
    <>
    <AppMenu />
      <XStack className="relative bg-(--surface) shadow-(--shadow-effect) overflow-hidden h-screen w-full">
        {/**Media View**/}
        <Slot className="xl:flex w-6/12 h-screen hidden bg-brand items-center justify-center">
          <Image
            src="/asset/media.png"
            className="flex justify-center items-center w-full h-screen"
          />
        </Slot>
        {/**Form Widget (Auth)**/}
        <Slot className="relative flex bg-(--surface) h-full w-full justify-center items-center lg:w-6/12 border-b-[8px] border-(--background)">
          <YStack className="w-full h-full items-center justify-center px-24 gap-y-4 ">
            <Button
              format="outlineSurface"
              size="xl"
              className="gap-x-2 w-full"
              on:submit={() => {
                useAuth.user.value = {
                  name: "John Doe",
                  email: "john.doe@example.com",
                };
                useAuth.view.value = "dashboard";
              }}
            >
              <GoogleIcon />
              Continue With Google
            </Button>

            <InputField
              variant="emailfield"
              className="shadow-(--shadow-hollow)"
            />
            <InputField
              variant="passwordfield"
              className="shadow-(--shadow-hollow) "
            />

            <Button
              size="xl"
              className="w-full"
              on:tap={() => {
                useAuth.user.value = {
                  name: "John Doe",
                  email: "john.doe@example.com",
                };
                useAuth.view.value = "dashboard";
              }}
            >
              Continue to InSpatial
            </Button>
          </YStack>
        </Slot>
      </XStack>
    </>
  );
}
