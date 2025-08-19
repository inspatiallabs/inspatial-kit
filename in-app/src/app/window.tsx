import { YStack } from "@inspatial/kit/structure";
import { AuthLayout } from "./(auth)/layout.tsx";
import { AppMenu } from "./menu.tsx";
import { Button } from "@inspatial/kit/ornament";
import { GoogleIcon } from "@inspatial/kit/icon";
import { InputField } from "@inspatial/kit/input";

export function AppWindow() {
  return (
    <>
      <YStack className="overflow-hidden h-screen w-screen">
        <AppMenu />
        <AuthLayout>
          <YStack className="w-full h-full items-center justify-center px-24 gap-y-4">
            {/**Button**/}
            <Button
              format="outlineSurface"
              size="xl"
              className="gap-x-2 w-full"
            >
              <GoogleIcon />
              Continue With Google
            </Button>

            {/**Divider**/}

            {/**Input**/}
            <InputField
              variant="emailfield"
              className="shadow-(--shadow-hollow)"
            />
            <InputField
              variant="passwordfield"
              className="shadow-(--shadow-hollow) "
            />

            {/**Button**/}
            <Button size="xl" className="w-full">
              Continue to InSpatial
            </Button>
          </YStack>
        </AuthLayout>
      </YStack>
    </>
  );
}
