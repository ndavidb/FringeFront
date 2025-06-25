import RolesTable from "@/app/(public)/roles/components/RolesTable";
import {Button, Container, Space, Title} from "@mantine/core";
import AddRoleForm from "@/app/(public)/roles/components/AddRole";
import Link from "next/link";

export default function RolePage() {
    return (
        <Container size="lg" mt="xl">
            <Button component={Link} href="/">Home Page</Button>
            <Title ta="center" mb="xl">Fringe Festival</Title>
            <RolesTable />
            <Space h="xl"/>
            <AddRoleForm />
        </Container>
    );
}
