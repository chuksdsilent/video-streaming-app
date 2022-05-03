import React from "react";

import { AppShell, Box, Header, Image, Navbar } from "@mantine/core";
const Homepage = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 300 }} height={500} p="xs">
          Sidebar
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          <Box>
            <Box>
              <Image src="/logo.png" alt="logo" width="100px" height="40px" />
            </Box>
          </Box>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
};

export default Homepage;
