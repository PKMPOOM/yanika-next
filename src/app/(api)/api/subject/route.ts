import { gradeTypes } from "@/interface/interface"
import { createSubjectSchema } from "@/interface/payload_validator"
import { prisma } from "@/lib/db"
import { stripeService } from "@/lib/stripe"
import { NextResponse } from "next/server"
import { ZodError } from "zod"

export async function POST(req: Request) {
    try {
        const { data } = await req.json()

        const { grade, subject_name } = createSubjectSchema.parse(data)

        const product = await stripeService.createProduct(
            subject_name,
            200 * 100
        )
        const stripeProductId = product.id

        const subject = await prisma.subject.create({
            data: {
                name: subject_name,
                grade: grade,
                stripe_product_id: stripeProductId,
                stripe_price_id:
                    typeof product.default_price === "string"
                        ? product.default_price
                        : null,
            },
        })

        return NextResponse.json({ id: subject.id }, { status: 200 })
    } catch (error) {
        if (error instanceof ZodError) {
            console.log(JSON.stringify(error, null, 2))
            return new Response("Invalid body", { status: 422 })
        }
        console.log(JSON.stringify(error, null, 2))
        return new Response("Internal server error", { status: 500 })
    }
}

export async function GET() {
    let availableGrades: gradeTypes[] = [
        {
            id: "school_1",
            name: "School 1",
            subjects: [],
        },
        {
            id: "school_2",
            name: "School 2",
            subjects: [],
        },
        {
            id: "school_3",
            name: "School 3",
            subjects: [],
        },
        {
            id: "school_4",
            name: "School 4",
            subjects: [],
        },
        {
            id: "school_5",
            name: "School 5",
            subjects: [],
        },
        {
            id: "school_6",
            name: "School 6",
            subjects: [],
        },
        {
            id: "high_school_1",
            name: "High School 1",
            subjects: [],
        },
        {
            id: "high_school_2",
            name: "High School 2",
            subjects: [],
        },
        {
            id: "high_school_3",
            name: "High School 3",
            subjects: [],
        },
        {
            id: "high_school_4",
            name: "High School 4",
            subjects: [],
        },
        {
            id: "high_school_5",
            name: "High School 5",
            subjects: [],
        },
        {
            id: "high_school_6",
            name: "High School 6",
            subjects: [],
        },
        {
            id: "university",
            name: "University",
            subjects: [],
        },
    ]

    try {
        const subjectList = await prisma.subject.findMany({
            select: {
                id: true,
                tags: true,
                description: true,
                name: true,
                grade: true,
            },
            orderBy: {
                created_date: "asc",
            },
        })

        subjectList.forEach((subject) => {
            const { grade, description, id, name, tags } = subject

            const matchingGrade = availableGrades.find(
                (subject) => subject.id === grade
            )
            if (matchingGrade) {
                matchingGrade.subjects.push({
                    description,
                    id,
                    name,
                    tags,
                    grade,
                })
            }
        })

        const filteredGrades = availableGrades.filter(
            (item) => item.subjects.length > 0
        )

        return NextResponse.json(
            { subjectList: filteredGrades },
            { status: 200 }
        )
    } catch (error) {
        if (error instanceof ZodError) {
            console.log(JSON.stringify(error, null, 2))

            return new Response("Invalid body", { status: 422 })
        }
        console.log(JSON.stringify(error, null, 2))
        return new Response("Internal server error", { status: 500 })
    }
}
