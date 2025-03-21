import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

class StripeService {
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

    async setProductInactive(productId: string) {
        const product = await stripe.products.update(productId, {
            active: false,
        })
        return product
    }

    async updateProductDetails({
        stripe_product_id,
        name,
        description,
    }: {
        stripe_product_id: string
        name: string
        description: string
    }) {
        const product = await stripe.products.update(stripe_product_id, {
            name,
            description,
        })

        return product
    }

    async updatePriceDetails({
        stripe_product_id,
        stripe_price_id,
        newPrice,
    }: {
        newPrice: number
        stripe_product_id: string
        stripe_price_id: string
    }) {
        const newPriceId = await stripe.prices.create({
            product: stripe_product_id,

            unit_amount: newPrice * 100,
            currency: "thb",
        })

        await stripe.products.update(stripe_product_id, {
            default_price: newPriceId.id,
        })

        await stripe.prices.update(stripe_price_id, {
            active: false,
        })

        return newPriceId
    }

    // async createPaymentLink(productId: string, timeSlotId: string) {
    async createPaymentLink({
        productId,
        timeSlotId,
        userId,
        amount,
    }: {
        productId: string
        timeSlotId: string
        userId: string
        amount: number
    }) {
        const paymentLink = await stripe.paymentLinks.create({
            line_items: [
                {
                    price: productId, // Must be a pre-created Stripe Price ID
                    quantity: amount,
                },
            ],

            metadata: { timeSlotId, userId },

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

    async verifyWebhook(rawBody: string, sig: string, endpointSecret: string) {
        const event = stripe.webhooks.constructEvent(
            rawBody,
            sig,
            endpointSecret
        )
        return event
    }

    async getInvoiceUrl(invoiceId: string) {
        const invoice = await stripe.invoices.retrieve(invoiceId)
        return invoice.hosted_invoice_url
    }
}

export const stripeService = new StripeService()
