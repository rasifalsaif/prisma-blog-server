import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";


async function seedAdmin() {

    try {
        console.log("****Admin Seeding Started****")
        const adminData = {
            name: "Admin Saheb 5",
            email: "admin5@gmail.com",
            role: UserRole.ADMIN,
            password: "admin1234", // In a real application, make sure to hash the password before storing it in the database
            emailVerified: true,
        }
        console.log("****Checking Admin exists or not****")
        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email,
            },
        });
        if (existingUser) {
            throw new Error("Admin user already exists");
        }

        const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": "http://localhost:4000"
            },
            body: JSON.stringify(adminData),
        })


        if (signUpAdmin.ok) {
            console.log("****Admin user created successfully****")
            await prisma.user.update({
                where: {
                    email: adminData.email,
                },
                data: {
                    emailVerified: true,
                },
            })
            console.log("****Admin user email verified successfully****")
        }
        console.log("****Admin Seeding Completed****")

    } catch (error) {
        console.error(error);
    }

}
seedAdmin();