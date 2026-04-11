import { ClerkProvider } from "@clerk/nextjs";
import { hasClerkEnv } from "../lib/auth";

type AppProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export function AppProvider({ children }: AppProviderProps) {
  if (!hasClerkEnv) {
    return children;
  }

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#79f0d0",
          colorBackground: "#08111f",
          colorInputBackground: "#0f1a2d",
          colorInputText: "#eef4ff",
          colorText: "#eef4ff",
          colorTextSecondary: "#a6b5d4",
          borderRadius: "8px",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
