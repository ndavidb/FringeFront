import { Role } from "@/types/role";

const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/roles`;
export async function getRoles(): Promise<Role[]> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}

export async function deleteRoles(roleId: number): Promise<void> {
    const response = await fetch(`${url}/${roleId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
}

export async function addRole(role: Role): Promise<void> {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(role),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
}

export async function updateRole(role: Role): Promise<void> {
    const response = await fetch(`${url}/${role.roleId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(role),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
}