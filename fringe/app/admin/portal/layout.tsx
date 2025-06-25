"use client";

import {AppShell, Burger, Button, Flex, Group} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {Navbar} from "@/components/navbar/Navbar";
import {useAuth} from "@/contexts/auth-context";
import React from "react";


export default function AdminPortalLayout({
                                              children,
                                          }: {
    children: React.ReactNode;
}) {
    const [opened, {toggle}] = useDisclosure();
    const {logout} = useAuth();
    return (
            <AppShell
                layout="alt"
                header={{height: 70}}
                navbar={{width: 260, breakpoint: "sm", collapsed: {mobile: !opened}}}
                padding="md"
            >
                <AppShell.Header>
                    <Flex justify="space-between" visibleFrom="md" p="md">
                        <div    ></div>
                        <Button onClick={logout} color="pink.8" variant="outline">
                            Logout
                        </Button>
                    </Flex>
                    <Group px="md" pt="sm">
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
                        {/*<MantineLogo size={30} />*/}
                    </Group>
                </AppShell.Header>
                <AppShell.Navbar>
                    <Group px="md" pt="md" hiddenFrom="sm">
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
                    </Group>
                    <Navbar/>
                </AppShell.Navbar>
                <AppShell.Main bg="var(--mantine-color-primary-0)">{children}</AppShell.Main>
            </AppShell>

    );
}