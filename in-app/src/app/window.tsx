import { YStack } from "@inspatial/kit/structure";
import { AuthLayout } from "./(auth)/layout.tsx";
import { AppMenu } from "./menu.tsx";
import { Text } from "@inspatial/kit/typography";
import { Button } from "@inspatial/kit/ornament";

export function AppWindow() {
  return (
    <>
      <AppMenu />
      <AuthLayout>
        <YStack className="w-full h-full items-center justify-center">
          {/**Button**/}
          <Button format="outlineSurface" size="xl" className="min-w-full">
            Continue With Google
          </Button>

          {/**Divider**/}

          {/**Input**/}

          {/**Button**/}
        </YStack>
      </AuthLayout>
    </>
  );
}
