"use client"

import Container from "@/Components/Global/Container"
import { useSession } from "@/lib/auth-client"
import { Button } from "antd"
import Link from "next/link"

const DEFAULT_PRICE_THB = 200

// prefilled_email=loikloikpoom%40gmail.com

const availableCreditPackage = [
    {
        id: "1",
        name: "1 Credit",
        price: 1,
        description: "1 Classroom Credit",
        link: "https://buy.stripe.com/14k2c07kb6Vs5Us8wA",
        priceTHB: 200,
    },
    {
        id: "3",
        name: "3 Credit",
        price: 3,
        description: "3 Classroom Credit",
        link: "https://buy.stripe.com/00g5oc0VNcfMaaI147",
        priceTHB: DEFAULT_PRICE_THB * 3,
    },
    {
        id: "5",
        name: "5 Credit",
        price: 5,
        description: "5 Classroom Credit",
        link: "https://buy.stripe.com/fZe7wkawna7E0A89AC",
        priceTHB: DEFAULT_PRICE_THB * 5,
    },
    {
        id: "10",
        name: "10 Credit",
        price: 10,
        description: "10 Classroom Credit",
        link: "https://buy.stripe.com/fZe2c047Z2FcdmUcMN",
        priceTHB: DEFAULT_PRICE_THB * 10,
    },
    {
        id: "20",
        name: "20 Credit",
        price: 20,
        description: "20 Classroom Credit",
        link: "https://buy.stripe.com/aEUg2Q1ZR6Vs0A8cMM",
        priceTHB: DEFAULT_PRICE_THB * 20,
    },
]

type Props = {}

const Page = (props: Props) => {
    const { data, error } = useSession()
    if (!data || error) {
        return <div>Loading...</div>
    }

    const userEmail = data.user.email

    return (
        <Container>
            <CommonHeader title="Buy Credit" />
            <div className=" grid grid-cols-3 gap-2 ">
                {availableCreditPackage.map((pack) => {
                    return (
                        <CreditCard
                            key={pack.id}
                            name={pack.name}
                            priceTHB={pack.priceTHB}
                            description={pack.description}
                            link={pack.link + "?prefilled_email=" + userEmail}
                        />
                    )
                })}
            </div>
        </Container>
    )
}

export default Page

const CommonHeader = ({ title }: { title: string }) => {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <p className=" rounded-lg mb-2.5 bg-linear-to-r from-emerald-500 to-emerald-400 p-6 text-3xl text-white">
                    {title}
                </p>
            </div>
        </div>
    )
}

type CreditCardProps = {
    name: string
    priceTHB: number
    description: string
    link: string
}

const CreditCard = ({ name, priceTHB, description, link }: CreditCardProps) => {
    return (
        <div className="rounded-lg flex flex-col gap-2 bg-white border border-gray-200 p-6  w-full">
            <div className="flex justify-between">
                <p className="text-xl font-semibold">{name}</p>
                <p className="text-lg ">{priceTHB} THB</p>
            </div>
            <p className="text-xs text-gray-500">{description}</p>
            <div className="flex ">
                <Link
                    href={link}
                    target="_blank"
                    style={{
                        width: "100%",
                    }}
                >
                    <Button type="primary" block>
                        Buy Now
                    </Button>
                </Link>
            </div>
        </div>
    )
}
