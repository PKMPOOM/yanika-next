import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export class StripeService {
    async createProduct(name: string, price: number) {
        const product = await stripe.products.create({
            name,
            default_price_data: {
                currency: "thb",
                unit_amount: price,
            },
        })

        return product
    }

    async deleteProduct(productId: string) {
        const product = await stripe.products.del(productId)
        return product
    }

    async createPaymentLink(productId: string) {
        const paymentLink = await stripe.paymentLinks.create({
            line_items: [
                {
                    price: productId, // Must be a pre-created Stripe Price ID
                    quantity: 1,
                },
            ],

            invoice_creation: {
                enabled: true,
            },
        })

        return paymentLink
    }

    async getInvoice(invoiceId: string) {
        const invoice = await stripe.invoices.retrieve(invoiceId)
        return invoice
    }
}
